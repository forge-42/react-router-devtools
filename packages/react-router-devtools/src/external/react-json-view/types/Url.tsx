import { useTypesStore, type TagType, type TypesElement } from '../store/Types.js';
import { useTypesRender } from '../utils/useRender.js';

export const Url = (props: TypesElement<TagType>) => {
  const { Url: Comp = {} } = useTypesStore();
  useTypesRender(Comp, props, 'Url');

  return null;
};

Url.displayName = 'JVR.Url';
