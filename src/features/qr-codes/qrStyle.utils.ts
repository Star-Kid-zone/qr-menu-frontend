import type { DataModulesStyle, FinderPatternOuterStyle } from '@lglab/react-qr-code';
import type { DataModuleStyle, FinderPatternStyle } from '@/types';

export function toReactQrModuleStyle(style: DataModuleStyle | string): DataModulesStyle {
  if (style === 'box' || style === 'square-sm') return 'square-sm';
  if (style === 'plus' || style === 'hashtag') return 'hashtag';
  return (style as DataModulesStyle) || 'square';
}

export function toFinderOuterStyle(style: FinderPatternStyle): FinderPatternOuterStyle {
  if (style === 'heart') return 'circle';
  return style as FinderPatternOuterStyle;
}
