import type { CSSProperties, FC } from 'react'
import { useRef } from 'react'
import { useDrag } from 'react-dnd'
import { ItemTypes } from '../types'

import { FlowNodeProps } from '../types';
import type { SidebarDragInputType } from './dragTypes';

const style: CSSProperties = {
  cursor: 'move',
  float: 'left',
}

interface DropResult {
  name: string
}

export const DragableComponent: FC<FlowNodeProps> = function Box({data}) {
  const dragInputTypeRef = useRef<SidebarDragInputType>('mouse');
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.NODE,
    item: () => ({
      componentData: data,
      inputType: dragInputTypeRef.current,
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>()
      if (item && dropResult) {
        //alert fires two times in firefox, do not use it
        //alert(`You dropped ${item.name} into ${dropResult.name}!`);
        //console.log(`You dropped ${item.name} into ${dropResult.name}!`);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }))

  const opacity = isDragging ? 0.4 : 1
  return (
    <div ref={(element) => {
        drag(element);
      }}
        style={{ ...style,
            opacity,
            width: "100%",
            height: "60px",
            touchAction: "none",
        }}
        onPointerDown={(event) => {
          dragInputTypeRef.current = event.pointerType === 'mouse' ? 'mouse' : 'touch';
        }}
        onMouseDown={() => {
          dragInputTypeRef.current = 'mouse';
        }}
        onTouchStart={() => {
          dragInputTypeRef.current = 'touch';
        }}
        data-testid={`flownode`}
    >
      <img
        src={data.image?.url}
        style= {{
          width: "100%",
          height: "100%",
          objectFit: "scale-down",
        }}
      
      />
    </div>
  )
}
