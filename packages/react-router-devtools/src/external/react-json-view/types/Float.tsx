import { useTypesStore, type TagType, type TypesElement } from '../store/Types.js';
import { useTypesRender } from '../utils/useRender.js';

export const Float = (props: TypesElement<TagType>) => {
  const { Float: Comp = {} } = useTypesStore();
  useTypesRender(Comp, props, 'Float');

  return null;
};

Float.displayName = 'JVR.Float';
