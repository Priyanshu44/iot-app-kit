import React, { CSSProperties, useEffect, useRef } from 'react';
import './component.css';
import { LineWidget } from '~/customization/widgets/types';
import { XYCoord, useDrag } from 'react-dnd';
import { DashboardWidget } from '~/types';
import { useGridSettings } from '~/components/actions/useGridSettings';
import { useWidgetActions } from '~/customization/hooks/useWidgetActions';

function computeNewPosition(
  initialPosition: XYCoord,
  offsetDifference: XYCoord,
  height: number,
  width: number,
  cellSize: number
) {
  // currently constrained within the bounds of the box
  const { x: initialX, y: initialY } = initialPosition;
  const { x: offsetX, y: offsetY } = offsetDifference;

  const widthPixels = Math.round(width * cellSize);
  const heightPixels = Math.round(height * cellSize);

  const newX = Math.max(0, Math.min(initialX + offsetX, widthPixels));
  const newY = Math.max(0, Math.min(initialY + offsetY, heightPixels));

  return { x: newX, y: newY };
}

const useDragAndUpdate = (widget: LineWidget, anchorType: 'start' | 'end') => {
  const { update: updateWidget } = useWidgetActions<DashboardWidget>();
  // These refs are needed because we want to remember the coordinates at the start of the drag event.
  // We don't want to recalculate the coordinates of the points on every render, only when the drag event completes.
  const initialStartPointRef = useRef({
    x: 0,
    y: 0,
  });
  const initialEndPointRef = useRef({
    x: 0,
    y: 0,
  });

  const { cellSize } = useGridSettings();

  const [{ diff, isDragging }, ref] = useDrag({
    type: 'LineAnchor',
    item: () => {
      initialStartPointRef.current = {
        x: widget.properties.start.x,
        y: widget.properties.start.y,
      };
      initialEndPointRef.current = {
        x: widget.properties.end.x,
        y: widget.properties.end.y,
      };
      return {
        anchorType,
      };
    },
    collect: (monitor) => {
      const offsetDifference = monitor.getDifferenceFromInitialOffset();
      return { diff: offsetDifference, isDragging: monitor.isDragging() };
    },
  });
  useEffect(() => {
    if (isDragging && diff) {
      const initialPoint = anchorType === 'start' ? initialStartPointRef.current : initialEndPointRef.current;

      const { x, y } = computeNewPosition(initialPoint, diff, widget.height, widget.width, cellSize);
      const updatedProperties = {
        ...widget.properties,
        [anchorType]: {
          x,
          y,
        },
      };

      const updatedWidget = {
        ...widget,
        properties: updatedProperties,
      };

      updateWidget(updatedWidget);
    }
  }, [diff?.x, diff?.y]);

  return ref;
};

export const LineAnchor: React.FC<{
  style: CSSProperties;
  anchorType: 'start' | 'end';
  widget: LineWidget;
}> = ({ style, anchorType, widget }) => {
  const dragRef = useDragAndUpdate(widget, anchorType);
  return (
    <div
      id='line-symbol-widget'
      data-testid={'line-' + anchorType + '-anchor'}
      ref={dragRef}
      style={style}
      className='line-anchor'
    />
  );
};
