import React from 'react';

import SpaceBetween from '@cloudscape-design/components/space-between';

import { ThresholdSettingsConfiguration } from '../thresholdSettings';

export const ThresholdsSection = () => (
  <SpaceBetween size='xs' direction='vertical'>
    <ThresholdSettingsConfiguration />
  </SpaceBetween>
);
