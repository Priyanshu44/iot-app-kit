import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';

import React from 'react';
import { AssetExplorer } from './assetExplorer';
import { DataStreamExplorer } from './dataStreamExplorer';

import type { SelectedAsset, SelectedDataStream } from '../types';
import type { WithIoTSiteWiseClient } from '../../types';

export interface IoTSiteWiseDataStreamExplorerProps extends WithIoTSiteWiseClient {
  selectedAssets: SelectedAsset[];
  selectedDataStreams: SelectedDataStream[];
  onSelect: (selection: SelectedAsset[] | SelectedDataStream[]) => void;
}

export function IoTSiteWiseDataStreamExplorer({
  selectedAssets,
  selectedDataStreams,
  onSelect,
  client,
}: IoTSiteWiseDataStreamExplorerProps) {
  return (
    <Box padding={{ horizontal: 's' }}>
      <Header variant='h2'>Browse assets</Header>

      <AssetExplorer client={client} selectedAssets={selectedAssets} onSelect={onSelect} />

      <DataStreamExplorer
        client={client}
        selectedAssets={selectedAssets}
        selectedDataStreams={selectedDataStreams}
        onSelect={onSelect}
      />
    </Box>
  );
}
