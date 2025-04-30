import { type TagType } from '../store/Types.js';
import { type SectionElement, useSectionStore } from '../store/Section.js';
import { useSectionRender } from '../utils/useRender.js';

export const Copied = (props: SectionElement<TagType>) => {
  const { Copied: Comp = {} } = useSectionStore();
  useSectionRender(Comp, props, 'Copied');
  return null;
};

Copied.displayName = 'JVR.Copied';
