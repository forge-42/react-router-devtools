import { useSymbolsStore, type SymbolsElement } from '../store/Symbols.js';
import { type TagType } from '../store/Types.js';
import { useSymbolsRender } from '../utils/useRender.js';

export const BraceLeft = (props: SymbolsElement<TagType>) => {
  const { BraceLeft: Comp = {} } = useSymbolsStore();
  useSymbolsRender(Comp, props, 'BraceLeft');

  return null;
};

BraceLeft.displayName = 'JVR.BraceLeft';
