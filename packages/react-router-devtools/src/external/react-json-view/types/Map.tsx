import { useTypesStore, type TagType, type TypesElement } from '../store/Types.js';
import { useTypesRender } from '../utils/useRender.js';

export const Map = (props: TypesElement<TagType>) => {
  const { Map: Comp = {} } = useTypesStore();
  useTypesRender(Comp, props, 'Map');

  return null;
};

Map.displayName = 'JVR.Map';
