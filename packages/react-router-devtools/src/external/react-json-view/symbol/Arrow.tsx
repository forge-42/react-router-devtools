import { useSymbolsStore, type SymbolsElement } from '../store/Symbols.js';
import { type TagType } from '../store/Types.js';
import { useSymbolsRender } from '../utils/useRender.js';

export const Arrow = (props: SymbolsElement<TagType>) => {
  const { Arrow: Comp = {} } = useSymbolsStore();
  useSymbolsRender(Comp, props, 'Arrow');
  return null;
};

Arrow.displayName = 'JVR.Arrow';
