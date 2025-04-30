import { useTypesStore, type TagType, type TypesElement } from '../store/Types.js';
import { useTypesRender } from '../utils/useRender.js';

export const Undefined = (props: TypesElement<TagType>) => {
  const { Undefined: Comp = {} } = useTypesStore();
  useTypesRender(Comp, props, 'Undefined');

  return null;
};

Undefined.displayName = 'JVR.Undefined';
