import { useStore } from "../store.js";
import { useExpandsStore } from "../store/Expands.js";
import { BracketsClose } from "../symbol/index.js";

interface NestedCloseProps<T extends object> {
  value?: T;
  expandKey: string;
  level: number;
}

export const NestedClose = <T extends object>(props: NestedCloseProps<T>) => {
  const { value, expandKey, level } = props;
  const expands = useExpandsStore();
  const isArray = Array.isArray(value);
  const { collapsed } = useStore();
  const isMySet = value instanceof Set;
  const isExpanded =
    expands[expandKey] ??
    (typeof collapsed === "boolean" ? collapsed : typeof collapsed === "number" ? level > collapsed : false);
  const len = Object.keys(value!).length;
  if (isExpanded || len === 0) {
    return null;
  }
  const style: React.CSSProperties = {
    paddingLeft: 4,
  };
  return (
    <div style={style}>
      <BracketsClose isBrackets={isArray || isMySet} isVisiable={true} />
    </div>
  );
};

NestedClose.displayName = "JVR.NestedClose";
