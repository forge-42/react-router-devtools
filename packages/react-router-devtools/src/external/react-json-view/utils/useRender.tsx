import { useEffect } from 'react';
import { useSymbolsDispatch, type SymbolsElement } from '../store/Symbols.js';
import { useTypesDispatch, type TagType, type TypesElement } from '../store/Types.js';
import { useSectionDispatch, type SectionElement } from '../store/Section.js';

export function useSymbolsRender(currentProps: SymbolsElement<TagType>, props: SymbolsElement<TagType>, key: string) {
  const dispatch = useSymbolsDispatch();
  const cls = [currentProps.className, props.className].filter(Boolean).join(' ');
  const reset = {
    ...currentProps,
    ...props,
    className: cls,
    style: {
      ...currentProps.style,
      ...props.style,
    },
    children: props.children || currentProps.children,
  };
  useEffect(() => dispatch({ [key]: reset }), [props]);
}

export function useTypesRender<K extends TagType>(
  currentProps: TypesElement<TagType>,
  props: TypesElement<K>,
  key: string,
) {
  const dispatch = useTypesDispatch();
  const cls = [currentProps.className, props.className].filter(Boolean).join(' ');
  const reset = {
    ...currentProps,
    ...props,
    className: cls,
    style: {
      ...currentProps.style,
      ...props.style,
    },
    children: props.children || currentProps.children,
  };
  useEffect(() => dispatch({ [key]: reset }), [props]);
}

export function useSectionRender<K extends TagType>(
  currentProps: SectionElement<TagType>,
  props: SectionElement<K>,
  key: string,
) {
  const dispatch = useSectionDispatch();
  const cls = [currentProps.className, props.className].filter(Boolean).join(' ');
  const reset = {
    ...currentProps,
    ...props,
    className: cls,
    style: {
      ...currentProps.style,
      ...props.style,
    },
    children: props.children || currentProps.children,
  };
  useEffect(() => dispatch({ [key]: reset }), [props]);
}
