import { useTypesStore, type TagType, type TypesElement } from '../store/Types.js';
import { useTypesRender } from '../utils/useRender.js';

export const Null = (props: TypesElement<TagType>) => {
  const { Null: Comp = {} } = useTypesStore();
  useTypesRender(Comp, props, 'Null');

  return null;
};

Null.displayName = 'JVR.Null';
