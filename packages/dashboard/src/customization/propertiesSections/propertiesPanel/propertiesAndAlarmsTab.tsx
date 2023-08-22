import React from 'react';

import SpaceBetween from '@cloudscape-design/components/space-between';

import { PropertiesAndAlarmsSettingsConfiguration } from '../propertiesAndAlarmsSettings';

export const PropertiesAndAlarmsSection = () => (
  <SpaceBetween size='xs' direction='vertical'>
    <PropertiesAndAlarmsSettingsConfiguration />
  </SpaceBetween>
);
