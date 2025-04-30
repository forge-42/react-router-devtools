import { useTypesStore, type TagType, type TypesElement } from '../store/Types.js';
import { useTypesRender } from '../utils/useRender.js';

export const True = (props: TypesElement<TagType>) => {
  const { True: Comp = {} } = useTypesStore();
  useTypesRender(Comp, props, 'True');

  return null;
};

True.displayName = 'JVR.True';
