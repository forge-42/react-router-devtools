import { type ExecSyncOptions, execSync } from "node:child_process"
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import os from "node:os"
import { join, resolve } from "node:path"
import { parseArgs } from "node:util"
import chalk from "chalk"
import semver from "semver"
import { getServerEnv } from "~/env.server"

type RunOpts = { cwd?: string; inherit?: boolean }
function run(cmd: string, opts: RunOpts = {}) {
  const exOpts: ExecSyncOptions = {
    cwd: opts.cwd,
    stdio: opts.inherit ? "inherit" : "pipe",
    encoding: "utf8",
  }
  try {
    const res = execSync(cmd, exOpts)
    if (opts.inherit) return ""
    if (typeof res === "string") return res.trim()
    return (res?.toString?.("utf8") ?? "").trim()
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    throw new Error(`Command failed: ${cmd}\n${msg}`)
  }
}

const ensureDir = (p: string) => mkdirSync(p, { recursive: true })
const resetDir = (p: string) => {
  if (existsSync(p)) rmSync(p, { recursive: true, force: true })
  ensureDir(p)
}

const contentDir = "content"
const outputDir = "generated-docs"
const APP_ENV = getServerEnv().APP_ENV as "development" | "production"
const currentDocsWorkspace = process.cwd()

let docsRelative = ""
try {
  docsRelative = run("git rev-parse --show-prefix", { cwd: currentDocsWorkspace }).replace(/\/?$/, "")
} catch {
  docsRelative = ""
}

const allTags = () => run("git tag --list").split("\n").filter(Boolean)

function resolveTagsFromSpec(spec: string) {
  const tags = allTags().filter((t) => semver.valid(t))
  const tokens = spec.split(",").map((t) => t.trim()).filter(Boolean)
  const matched = tags.filter((tag) =>
    tokens.some((token) => semver.satisfies(tag, token, { includePrerelease: true })),
  )
  return matched.sort(semver.rcompare)
}

function hasDocsContentDir(dir: string) {
  return existsSync(resolve(dir, contentDir))
}

function buildDocs(sourceDir: string, outDir: string) {
  if (!existsSync(sourceDir)) throw new Error(`Docs workspace not found: ${sourceDir}`)
  const docsContentDir = resolve(sourceDir, contentDir)
  if (!existsSync(docsContentDir)) {
    throw new Error(`Docs content directory "${contentDir}" not found at ${docsContentDir}`)
  }

  resetDir(outDir)
  run("pnpm run content-collections:build", { cwd: sourceDir, inherit: true })

  const ccSrc = resolve(sourceDir, ".content-collections")
  const ccDest = join(outDir, ".content-collections")
  if (!existsSync(ccSrc)) throw new Error(`Build output missing at ${ccSrc}`)

  resetDir(ccDest)
  cpSync(ccSrc, ccDest, { recursive: true })
  console.log(chalk.green(`✔ Built docs → ${ccDest}`))
}

function buildRef(ref: string, labelForOutDir: string) {
  const tmpBase = mkdtempSync(resolve(os.tmpdir(), "docs-wt-"))
  const safeLabel = labelForOutDir.replace(/[^\w.-]+/g, "_")
  const worktreePath = resolve(tmpBase, safeLabel)

  run(`git worktree add --detach "${worktreePath}" "${ref}"`, {
    cwd: currentDocsWorkspace,
    inherit: true,
  })

  try {
    const docsWorkspace = docsRelative ? resolve(worktreePath, docsRelative) : worktreePath

    // Install at worktree ROOT first (monorepo lockfile lives here)
    const rootPkg = existsSync(resolve(worktreePath, "package.json"))
    const rootLock = existsSync(resolve(worktreePath, "pnpm-lock.yaml"))
    if (rootPkg) {
      run(`pnpm install ${rootLock ? "--frozen-lockfile" : "--no-frozen-lockfile"}`, {
        cwd: worktreePath,
        inherit: true,
      })
    }

    // Only install inside docs/ if it has its own lockfile
    const docsPkg = existsSync(resolve(docsWorkspace, "package.json"))
    const docsLock = existsSync(resolve(docsWorkspace, "pnpm-lock.yaml"))
    if (docsPkg && docsLock) {
      run("pnpm install --frozen-lockfile", { cwd: docsWorkspace, inherit: true })
    }

    const outDir = resolve(outputDir, labelForOutDir)
    buildDocs(docsWorkspace, outDir)
  } finally {
    run(`git worktree remove "${worktreePath}" --force`, {
      cwd: currentDocsWorkspace,
      inherit: true,
    })
    rmSync(tmpBase, { recursive: true, force: true })
  }
}

function hasLocalRef(ref: string) {
  try {
    run(`git show-ref --verify --quiet ${ref}`)
    return true
  } catch {
    return false
  }
}

function buildBranch(branch: string, labelForOutDir: string) {
run(`git fetch --tags --prune origin ${branch}`, {

    cwd: currentDocsWorkspace,
    inherit: true,
  })
  const localRef = `refs/heads/${branch}`
  const targetRef = hasLocalRef(localRef) ? localRef : `origin/${branch}`
  return buildRef(targetRef, labelForOutDir)
}

function buildTag(tag: string) {
  return buildRef(`refs/tags/${tag}`, tag)
}

function buildSpecifiedTags(spec: string, envLabel: "dev" | "prod"): string[] {
  const tags = resolveTagsFromSpec(spec)
  if (!tags.length) {
    throw new Error(
      `No tags matched spec "${spec}". Nothing to build in ${envLabel === "dev" ? "development" : "production"}.`,
    )
  }
  console.log(chalk.cyan(`(${envLabel}) Building docs for tags: ${tags.join(", ")}`))
  for (const tag of tags) buildTag(tag)
  return tags
}

function detectDefaultBranch(): string {
  try {
    const ref = run("git symbolic-ref --quiet refs/remotes/origin/HEAD") // e.g. 'refs/remotes/origin/main'
    const parts = ref.split("/")
    return parts[parts.length - 1] || "main"
  } catch {
    try {
      const info = run("git remote show origin")
      const m = info.match(/HEAD branch:\s*(\S+)/)
      if (m?.[1]) return m[1].trim()
    } catch {}
  }
  return "main"
}

;(async () => {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      versions: { type: "string" }, // optional
      branch: { type: "string" },   // optional (CLI override)
    },
  })

  const branch =
    (values.branch as string | undefined)?.trim() ||
    process.env.DOCS_BRANCH?.trim() ||
    detectDefaultBranch()

  const hasVersions = typeof values.versions === "string" && values.versions.trim().length > 0
  let builtVersions: string[] = []

  if (!hasVersions && APP_ENV === "development") {
    console.log(chalk.cyan(`(dev) Building docs from current workspace: ${currentDocsWorkspace} → current`))
    buildDocs(currentDocsWorkspace, join(outputDir, "current"))
    builtVersions = ["current"]
  } else if (!hasVersions && APP_ENV === "production") {
    console.log(chalk.cyan(`(prod) Building docs from '${branch}' branch only → ${branch}`))
    try {
      // Try to build from the target branch worktree
      buildBranch(branch, branch)
    } catch (e: any) {
      // If the target branch doesn’t have /docs/content yet (common for PRs introducing it),
      // fall back to building from the current workspace but emit under the same label.
      const msg = String(e?.message ?? e)
      if (msg.includes(`Docs content directory "${contentDir}" not found`)) {
        console.warn(
          chalk.yellow(
            `(prod) '${branch}' is missing /docs/${contentDir}. Falling back to current workspace for this build.`,
          ),
        )
        buildDocs(currentDocsWorkspace, join(outputDir, branch))
      } else {
        throw e
      }
    }
    builtVersions = [branch]
  } else {
    builtVersions = buildSpecifiedTags(values.versions as string, APP_ENV === "development" ? "dev" : "prod")
  }

  const versionsFile = resolve("app/utils/versions.ts")
  writeFileSync(
    versionsFile,
    `// Auto-generated file. Do not edit manually.
export const versions = ${JSON.stringify(builtVersions, null, 2)} as const
`,
  )

  console.log(chalk.green(`✔ Wrote versions.ts → ${versionsFile}`))
  console.log(chalk.green("✅ Done"))
})().catch((e) => {
  console.error(chalk.red("❌ Build failed:"), e)
  process.exit(1)
})
