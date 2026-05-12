import type { ComponentDataType } from '../types';

export type SidebarDragInputType = 'mouse' | 'touch';

export type SidebarComponentDragItem = {
  componentData: ComponentDataType;
  inputType: SidebarDragInputType;
};
