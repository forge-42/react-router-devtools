import { useTypesStore, type TagType, type TypesElement } from '../store/Types.js';
import { useTypesRender } from '../utils/useRender.js';

export const Nan = (props: TypesElement<TagType>) => {
  const { Nan: Comp = {} } = useTypesStore();
  useTypesRender(Comp, props, 'Nan');

  return null;
};

Nan.displayName = 'JVR.Nan';
