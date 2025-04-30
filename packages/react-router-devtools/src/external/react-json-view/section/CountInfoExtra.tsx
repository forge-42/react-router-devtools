import { type TagType } from '../store/Types.js';
import { type SectionElement, type SectionElementProps, useSectionStore } from '../store/Section.js';
import { useSectionRender } from '../utils/useRender.js';

export const CountInfoExtra = <K extends TagType>(props: SectionElement<K>) => {
  const { CountInfoExtra: Comp = {} } = useSectionStore();
  useSectionRender(Comp, props, 'CountInfoExtra');
  return null;
};

CountInfoExtra.displayName = 'JVR.CountInfoExtra';

interface CountInfoExtraCompsProps<T extends object> {
  value?: T;
  keyName: string | number;
}

export const CountInfoExtraComps = <T extends object>(
  props: SectionElementProps<TagType> & CountInfoExtraCompsProps<T>,
) => {
  const { value = {}, keyName, ...other } = props;
  const { CountInfoExtra: Comp = {} } = useSectionStore();
  const { as, render, ...reset } = Comp;
  if (!render && !reset.children) return null;
  const Elm = as || 'span';
  const isRender = render && typeof render === 'function';
  const elmProps = { ...reset, ...other };
  const child = isRender && render(elmProps, { value, keyName });
  if (child) return child;
  return <Elm {...elmProps} />;
};

CountInfoExtraComps.displayName = 'JVR.CountInfoExtraComps';
