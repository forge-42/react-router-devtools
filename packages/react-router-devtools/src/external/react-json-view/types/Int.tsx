import { useTypesStore, type TagType, type TypesElement } from '../store/Types.js';
import { useTypesRender } from '../utils/useRender.js';

export const Int = (props: TypesElement<TagType>) => {
  const { Int: Comp = {} } = useTypesStore();
  useTypesRender(Comp, props, 'Int');

  return null;
};

Int.displayName = 'JVR.Int';
