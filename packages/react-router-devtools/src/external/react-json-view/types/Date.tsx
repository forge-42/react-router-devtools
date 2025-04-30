import { useTypesStore, type TagType, type TypesElement } from '../store/Types.js';
import { useTypesRender } from '../utils/useRender.js';

export const Date = (props: TypesElement<TagType>) => {
  const { Date: Comp = {} } = useTypesStore();
  useTypesRender(Comp, props, 'Date');

  return null;
};

Date.displayName = 'JVR.Date';
