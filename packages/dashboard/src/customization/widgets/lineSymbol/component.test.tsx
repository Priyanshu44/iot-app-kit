import React from 'react';
import { render } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useDragAndUpdate } from './lineAnchor/component'; // Correct path to your hook
import { DndProvider, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import LineWidgetComponent from './component';
import { Provider } from 'react-redux';
import { configureDashboardStore } from '~/store';
import { useIsSelected } from '~/customization/hooks/useIsSelected';
import { DashboardState } from '~/store/state';
import { MOCK_LINE_WIDGET } from '~/../testing/mocks';
import { useWidgetActions } from '~/customization/hooks/useWidgetActions';

jest.mock('~/customization/hooks/useIsSelected', () => ({
  useIsSelected: jest.fn(),
}));

const initialState: Partial<DashboardState> = {
  dashboardConfiguration: {
    widgets: [MOCK_LINE_WIDGET],
    viewport: { duration: '5m' },
  },
  selectedWidgets: [MOCK_LINE_WIDGET],
};

describe('LineWidgetComponent', () => {
  let mockStore;

  beforeEach(() => {
    // jest.resetAllMocks();
    mockStore = configureDashboardStore(initialState);
  });

  const renderComponentWithDnd = (properties) => {
    return render(
      <Provider store={mockStore}>
        <DndProvider backend={HTML5Backend}>
          <LineWidgetComponent
            id='line-id'
            x={1}
            y={2}
            z={3}
            height={100}
            width={100}
            type='line-widget'
            properties={properties}
          />
        </DndProvider>
      </Provider>
    );
  };

  describe('Rendering', () => {
    beforeEach(() => {
      const { container } = renderComponentWithDnd({
        lineStyle: 'solid',
        color: 'black',
        thickness: 5,
      });
      console.log(container.innerHTML);
    });

    [
      { lineStyle: 'solid', color: 'black', thickness: 5, isSelected: true },
      { lineStyle: 'dashed', color: 'black', thickness: 5, isSelected: true },
      { lineStyle: 'dotted', color: 'black', thickness: 5, isSelected: true },
      { lineStyle: 'solid', color: 'red', thickness: 5, isSelected: false },
      { lineStyle: 'dashed', color: 'blue', thickness: 10, isSelected: false },
      { lineStyle: 'dotted', color: 'green', thickness: 15, isSelected: false },
    ].forEach((configuration) => {
      const { lineStyle, color, thickness, isSelected } = configuration;
      const properties = { lineStyle, color, thickness };
      (useIsSelected as jest.Mock).mockImplementation(() => isSelected);
      it(`should render with ${JSON.stringify(properties)} correctly`, () => {
        const { container } = renderComponentWithDnd(properties);
        expect(container).toMatchSnapshot();
      });
    });
  });

  describe('useDragAndUpdate', () => {
    const mockWidget = {
      height: 200,
      width: 200,
      properties: {
        start: {
          x: 50,
          y: 50,
        },
        end: {
          x: 150,
          y: 150,
        },
      },
    };

    // Similarly for 'end' anchor and other test scenarios
  });
});
