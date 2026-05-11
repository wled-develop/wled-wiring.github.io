import { useDragLayer } from 'react-dnd';
import { ItemTypes } from '../types';
import type { SidebarComponentDragItem } from './dragTypes';

export const ComponentDragPreviewLayer = () => {
  const {isDragging, itemType, item, currentOffset} = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
    itemType: monitor.getItemType(),
    item: monitor.getItem() as SidebarComponentDragItem | null,
    currentOffset: monitor.getClientOffset(),
  }));

  if(!isDragging || itemType !== ItemTypes.NODE || !item || item.inputType === 'mouse' || !currentOffset) {
    return null;
  }

  const image = item.componentData.image;
  if(!image) return null;

  const maxWidth = 140;
  const maxHeight = 100;
  const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
  const width = image.width * scale;
  const height = image.height * scale;

  return (
    <div
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 2000,
        left: 0,
        top: 0,
        transform: `translate(${currentOffset.x - width / 2}px, ${currentOffset.y - height / 2}px)`,
      }}
    >
      <img
        src={image.url}
        style={{
          width,
          height,
          objectFit: 'contain',
          opacity: 0.82,
          filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.28))',
        }}
      />
    </div>
  );
};
