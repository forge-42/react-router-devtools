import { useTypesStore, type TagType, type TypesElement } from '../store/Types.js';
import { useTypesRender } from '../utils/useRender.js';

export const Bigint = <K extends TagType>(props: TypesElement<K>) => {
  const { Bigint: Comp = {} } = useTypesStore();
  useTypesRender(Comp, props, 'Bigint');

  return null;
};

Bigint.displayName = 'JVR.Bigint';
