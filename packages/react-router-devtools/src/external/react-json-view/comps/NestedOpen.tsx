import { KayName } from "./KeyValues.js";
import { useExpandsStore, useExpandsDispatch } from "../store/Expands.js";
import { useStore } from "../store.js";
import { Copied } from "./Copied.js";
import { CountInfoExtraComps } from "../section/CountInfoExtra.js";
import { CountInfoComp } from "../section/CountInfo.js";
import { Arrow, BracketsOpen, BracketsClose } from "../symbol/index.js";
import { EllipsisComp } from "../section/Ellipsis.js";
import { SetComp, MapComp } from "../types/index.js";

interface NestedOpenProps<T extends object> {
  keyName?: string | number;
  value?: T;
  initialValue?: T;
  expandKey: string;
  level: number;
}

export const NestedOpen = <T extends object>(props: NestedOpenProps<T>) => {
  const { keyName, expandKey, initialValue, value, level } = props;
  const expands = useExpandsStore();
  const dispatchExpands = useExpandsDispatch();
  const { onExpand, collapsed } = useStore();
  const isArray = Array.isArray(value);
  const isMySet = value instanceof Set;
  const isExpanded =
    expands[expandKey] ??
    (typeof collapsed === "boolean" ? collapsed : typeof collapsed === "number" ? level > collapsed : false);
  const isObject = typeof value === "object";
  const click = () => {
    const opt = { expand: !isExpanded, value, keyid: expandKey, keyName };
    onExpand && onExpand(opt);
    dispatchExpands({ [expandKey]: opt.expand });
  };

  const style: React.CSSProperties = { display: "inline-flex", alignItems: "center" };
  const arrowStyle = { transform: `rotate(${!isExpanded ? "0" : "-90"}deg)`, transition: "all 0.3s" };
  const len = Object.keys(value!).length;
  const showArrow = len !== 0 && (isArray || isMySet || isObject);
  const reset: React.HTMLAttributes<HTMLDivElement> = { style };
  if (showArrow) {
    reset.onClick = click;
  }
  return (
    <span {...reset}>
      {showArrow && <Arrow style={arrowStyle} expandKey={expandKey} />}
      {(keyName || typeof keyName === "number") && <KayName keyName={keyName} />}
      <SetComp value={initialValue} />
      <MapComp value={initialValue} />
      <BracketsOpen isBrackets={isArray || isMySet} />
      <EllipsisComp keyName={keyName!} value={value} isExpanded={isExpanded} />
      <BracketsClose isVisiable={isExpanded || !showArrow} isBrackets={isArray || isMySet} />
      <CountInfoComp value={value} keyName={keyName!} />
      <CountInfoExtraComps value={value} keyName={keyName!} />
      <Copied keyName={keyName!} value={value} expandKey={expandKey} />
    </span>
  );
};
NestedOpen.displayName = "JVR.NestedOpen";
