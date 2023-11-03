import { minBy, map, max } from 'lodash';
import { v4 } from 'uuid';
import type { Action } from 'redux';
import type { Position, DashboardWidget } from '~/types';
import type { DashboardState } from '../../state';

type PasteWidgetsActionPayload = {
  position?: Position;
};
export interface PasteWidgetsAction extends Action {
  type: 'PASTE_WIDGETS';
  payload: PasteWidgetsActionPayload;
}

export const onPasteWidgetsAction = (payload: PasteWidgetsActionPayload): PasteWidgetsAction => ({
  type: 'PASTE_WIDGETS',
  payload,
});

export const pasteWidgets = (state: DashboardState, action: PasteWidgetsAction): DashboardState => {
  const { position } = action.payload;

  const cellSize = state.grid.cellSize;
  const copyGroup = state.copiedWidgets;
  const xgrid = state.grid.width;
  const ygrid = state.grid.height;
  let pasteCounter = state.pasteCounter + 1;

  let offset: Position = {
    x: 0,
    y: 0,
  };
  const correctionOffset = {
    x: 0,
    y: 0,
  };
  if (position !== undefined) {
    pasteCounter = 0;

    const cellPosition: Position = {
      x: position && Math.floor(position.x / cellSize),
      y: position && Math.floor(position.y / cellSize),
    };

    const leftmostWidget: DashboardWidget = minBy(copyGroup, 'x') || copyGroup[0];
    const groupLeftX = leftmostWidget.x;

    const topmostWidget: DashboardWidget = minBy(copyGroup, 'y') || copyGroup[0];
    const groupTopY = topmostWidget.y;

    const widgetsRightPos = map(copyGroup, (widget) => {
      return widget.x + widget.width;
    });
    const groupRightX: any = max(widgetsRightPos);

    const widgetsBottomPos = map(copyGroup, (widget) => {
      return widget.y + widget.height;
    });
    const groupBottomY: any = max(widgetsBottomPos);

    const groupWidth = groupRightX - groupLeftX;
    const groupHeight = groupBottomY - groupTopY;

    offset = {
      x: cellPosition.x - groupLeftX,
      y: cellPosition.y - groupTopY,
    };

    if (cellPosition.x + groupWidth > xgrid) {
      correctionOffset.x = cellPosition.x + groupWidth - xgrid;
    }
    if (cellPosition.y + groupHeight > ygrid) {
      correctionOffset.y = cellPosition.y + groupHeight - ygrid;
    }
  }

  const widgetsToPaste = copyGroup.map((widget) => ({
    ...widget,
    id: v4(),
    x: offset.x + widget.x + pasteCounter - correctionOffset.x,
    y: offset.y + widget.y + pasteCounter - correctionOffset.y,
  }));

  return {
    ...state,
    dashboardConfiguration: {
      ...state.dashboardConfiguration,
      widgets: [...state.dashboardConfiguration.widgets, ...widgetsToPaste],
    },
    pasteCounter: position !== undefined ? 0 : pasteCounter,
    selectedWidgets: widgetsToPaste,
  };
};
