import React from 'react';

import { colorBorderDividerDefault } from '@cloudscape-design/design-tokens';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import Tabs from '@cloudscape-design/components/tabs';

import { useSelection } from '../../propertiesSection';

import { PropertiesPanelEmpty } from './emptyPanel';
import { StylesSection } from './styleTab';
import { PropertiesAndAlarmsSection } from './propertiesAndAlarmsTab';
import { ThresholdsSection } from './thresholdsTab';

import './panel.css';

/** Panel element responsible for rendering chart configuration sections. */
export const PropertiesPanel = () => {
  const selection = useSelection();

  return (
    <div className='properties-panel'>
      <div className='properties-panel-header-container' style={{ borderColor: colorBorderDividerDefault }}>
        <Box padding='m'>
          <Header variant='h3'>Configuration</Header>
        </Box>
      </div>

      {selection ? (
        <Box padding={{ horizontal: 'm', bottom: 'l' }}>
          <Tabs
            tabs={[
              {
                label: 'Style',
                id: 'style',
                content: <StylesSection />,
              },
              {
                label: 'Properties & Alarms',
                id: 'propertiesAndAlarms',
                content: <PropertiesAndAlarmsSection />,
              },
              {
                label: 'Thresholds',
                id: 'thresholds',
                content: <ThresholdsSection />,
              },
            ]}
          />
        </Box>
      ) : (
        <PropertiesPanelEmpty />
      )}
    </div>
  );
};
