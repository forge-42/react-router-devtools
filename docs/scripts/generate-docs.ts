import { type ExecSyncOptions, execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path, { join, resolve, posix as pathPosix } from "node:path";
import { parseArgs } from "node:util";
import chalk from "chalk";
import semver from "semver";
import { getServerEnv } from "~/env.server";

type RunOpts = { cwd?: string; inherit?: boolean };
function run(cmd: string, opts: RunOpts = {}) {
  const exOpts: ExecSyncOptions = {
    cwd: opts.cwd,
    stdio: opts.inherit ? "inherit" : "pipe",
    encoding: "utf8",
  };
  try {
    const res = execSync(cmd, exOpts);
    if (opts.inherit) return "";
    if (typeof res === "string") return res.trim();
    return (res?.toString?.("utf8") ?? "").trim();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Command failed: ${cmd}\n${msg}`);
  }
}

const ensureDir = (p: string) => mkdirSync(p, { recursive: true });
const resetDir = (p: string) => { if (existsSync(p)) rmSync(p, { recursive: true, force: true }); ensureDir(p); };

const contentDir = "content";
const outputDir = "generated-docs";
const APP_ENV = getServerEnv().APP_ENV as "development" | "production";
const currentDocsWorkspace = process.cwd();

let docsRelative = "";
try {
  docsRelative = run("git rev-parse --show-prefix", { cwd: currentDocsWorkspace }).replace(/\/?$/, "");
} catch {
  docsRelative = "";
}

const repoPath = (...segs: string[]) =>
  path.normalize(path.join(...segs.filter(Boolean)));

const allTags = () => run("git tag --list").split("\n").filter(Boolean);

function resolveTagsFromSpec(spec: string) {
  const tags = allTags().filter((t) => semver.valid(t));
  const tokens = spec.split(",").map((t) => t.trim()).filter(Boolean);
  const matched = tags.filter((tag) =>
    tokens.some((token) => semver.satisfies(tag, token, { includePrerelease: true })),
  );
  return matched.sort(semver.rcompare);
}

function detectDefaultBranch() {
  try {
    const ref = run("git symbolic-ref refs/remotes/origin/HEAD");
    const parts = ref.split("/");
    return parts[parts.length - 1];
  } catch {
    throw new Error("Cannot detect default branch from origin/HEAD");
  }
}


function hasLocalRef(ref: string) {
  try { run(`git show-ref --verify --quiet ${ref}`); return true; } catch { return false; }
}

const REPO_ROOT = run("git rev-parse --show-toplevel", { cwd: currentDocsWorkspace });

function refHasPath(ref: string, pathFromRepoRoot: string): boolean {
  const p = pathFromRepoRoot.replace(/^\/+/, "").replace(/\/+$/, "");
  try {
    run(`git -C "${REPO_ROOT}" rev-parse --verify --quiet "${ref}:${p}"`);
    return true;
  } catch { return false; }
}

function buildDocs(sourceDir: string, outDir: string) {
  if (!existsSync(sourceDir)) throw new Error(`Docs workspace not found: ${sourceDir}`);

  const docsContentDir = resolve(sourceDir, contentDir);
  if (!existsSync(docsContentDir)) {
    throw new Error(`Docs content directory "${contentDir}" not found at ${docsContentDir}`);
  }

  resetDir(outDir);
  run("pnpm run content-collections:build", { cwd: sourceDir, inherit: true });

  const ccSrc = resolve(sourceDir, ".content-collections");
  const ccDest = join(outDir, ".content-collections");
  if (!existsSync(ccSrc)) throw new Error(`Build output missing at ${ccSrc}`);

  resetDir(ccDest);
  cpSync(ccSrc, ccDest, { recursive: true });

  console.log(chalk.green(`✔ Built docs → ${ccDest}`));
}

function buildRef(ref: string, labelForOutDir: string) {
  const tmpBase = mkdtempSync(resolve(os.tmpdir(), "docs-wt-"));
  const safeLabel = labelForOutDir.replace(/[^\w.-]+/g, "_");
  const worktreePath = resolve(tmpBase, safeLabel);

  run(`git worktree add --detach "${worktreePath}" "${ref}"`, {
    cwd: currentDocsWorkspace,
    inherit: true,
  });

  try {
    const docsWorkspace = docsRelative ? resolve(worktreePath, docsRelative) : worktreePath;

    const rootPkg = existsSync(resolve(worktreePath, "package.json"));
    const rootLock = existsSync(resolve(worktreePath, "pnpm-lock.yaml"));
    if (rootPkg) {
      run(`pnpm install ${rootLock ? "--frozen-lockfile" : "--no-frozen-lockfile"}`, {
        cwd: worktreePath,
        inherit: true,
      });
    }

    const docsPkg = existsSync(resolve(docsWorkspace, "package.json"));
    const docsLock = existsSync(resolve(docsWorkspace, "pnpm-lock.yaml"));
    if (docsPkg && docsLock) {
      run("pnpm install --frozen-lockfile", { cwd: docsWorkspace, inherit: true });
    }

    const outDir = resolve(outputDir, labelForOutDir);
    buildDocs(docsWorkspace, outDir);
  } finally {
    run(`git worktree remove "${worktreePath}" --force`, {
      cwd: currentDocsWorkspace,
      inherit: true,
    });
    rmSync(tmpBase, { recursive: true, force: true });
  }
}

function buildBranch(branch: string, labelForOutDir: string) {
  run(`git fetch --tags --prune origin ${branch}`, {
    cwd: currentDocsWorkspace,
    inherit: true,
  });
  const localRef = `refs/heads/${branch}`;
  const targetRef = hasLocalRef(localRef) ? localRef : `origin/${branch}`;
  return buildRef(targetRef, labelForOutDir);
}

function buildTag(tag: string) { return buildRef(`refs/tags/${tag}`, tag); }


function isPullRequestCI() {
  return process.env.GITHUB_EVENT_NAME === "pull_request" || !!process.env.GITHUB_HEAD_REF;
}


(async () => {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      versions: { type: "string" }, // optional: comma/space list of semver ranges or exact tags (e.g. "v1.0.0, v1.1.x")
      branch:   { type: "string" }, // optional: default branch override (e.g. main)
    },
  });

  const defaultBranch =
    (values.branch as string | undefined)?.trim() ||
    process.env.DOCS_BRANCH?.trim() ||
    detectDefaultBranch();

  const rawVersions = (values.versions as string | undefined)?.trim() ?? "";
  const hasVersionsArg = rawVersions.length > 0;

  let builtVersions: string[] = [];

  if (APP_ENV === "development") {
    // Local dev: always build the current workspace → current
    console.log(chalk.cyan(`(dev) Building docs from current workspace: ${currentDocsWorkspace} → current`));
    buildDocs(currentDocsWorkspace, join(outputDir, "current"));
    builtVersions = ["current"];
  } else if (isPullRequestCI()) {
    // PR builds
    if (hasVersionsArg) {
      // Build PR content as "current" + requested tags
      console.log(chalk.cyan(`(pr) Building PR docs → current`));
      buildDocs(currentDocsWorkspace, join(outputDir, "current"));

      const tags = resolveTagsFromSpec(rawVersions);
      if (!tags.length) throw new Error(`No tags matched spec "${rawVersions}".`);
      console.log(chalk.cyan(`(pr) Also building tags: ${tags.join(", ")}`));
      for (const t of tags) buildTag(t);

      builtVersions = ["current", ...tags];
    } else {
      // Only PR content as "current"
      console.log(chalk.cyan(`(pr) Building PR docs → current`));
      buildDocs(currentDocsWorkspace, join(outputDir, "current"));
      builtVersions = ["current"];
    }
  } else {
    // Non-PR (e.g., release)
    if (hasVersionsArg) {
      // Build exactly the versions provided (this keeps older docs available if you list them)
      const tags = resolveTagsFromSpec(rawVersions);
      if (!tags.length) throw new Error(`No tags matched spec "${rawVersions}".`);
      console.log(chalk.cyan(`(ci) Building tags: ${tags.join(", ")}`));
      for (const t of tags) buildTag(t);
      builtVersions = [...tags];
    } else {
      // Fallback: build default branch (useful if you want a "main" channel)
    const checkPath = repoPath(docsRelative, contentDir); // "docs/content"
run(`git fetch --prune origin ${defaultBranch}`, { cwd: currentDocsWorkspace, inherit: true });

const hasOnDefault = refHasPath(`origin/${defaultBranch}`, checkPath);
if (!hasOnDefault) {
        throw new Error(`Default branch 'origin/${defaultBranch}' has no '${checkPath}'. Pass --versions to build tags.`);
      }
      console.log(chalk.cyan(`(ci) Building docs from '${defaultBranch}' → ${defaultBranch}`));
      buildBranch(defaultBranch, defaultBranch);
      builtVersions = [defaultBranch];
    }
  }

  // Write versions file for the app
  const versionsFile = resolve("app/utils/versions.ts");
  writeFileSync(
    versionsFile,
    `// Auto-generated file. Do not edit manually.
export const versions = ${JSON.stringify(builtVersions, null, 2)} as const
`,
  );
  console.log(chalk.green(`✔ Wrote versions.ts → ${versionsFile}`));
  console.log(chalk.green("✅ Done"));
})().catch((e) => {
  console.error(chalk.red("❌ Build failed:"), e);
  process.exit(1);
});