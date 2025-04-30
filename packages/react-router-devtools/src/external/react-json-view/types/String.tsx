import { useTypesStore, type TagType, type TypesElement } from '../store/Types.js';
import { useTypesRender } from '../utils/useRender.js';

export const StringText = (props: TypesElement<TagType>) => {
  const { Str: Comp = {} } = useTypesStore();
  useTypesRender(Comp, props, 'Str');

  return null;
};

StringText.displayName = 'JVR.StringText';
