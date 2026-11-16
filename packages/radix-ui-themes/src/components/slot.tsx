import * as React from 'react';
import { Slot as SlotPrimitive } from 'radix-ui';

export const Root = SlotPrimitive.Root;
export const Slot = SlotPrimitive.Root;
// Explicit type annotation: radix-ui 1.8's Slottable type references an
// unexported name (SlottableComponent), which breaks declaration emit when
// re-exported. The runtime value is unchanged (including the __radixId tag).
export const Slottable = SlotPrimitive.Slottable as unknown as React.FC<{
  children?: React.ReactNode;
}>;
