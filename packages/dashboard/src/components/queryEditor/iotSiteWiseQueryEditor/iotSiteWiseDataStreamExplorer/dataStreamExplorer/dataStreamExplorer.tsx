import React from 'react';

import { ModeledDataStreamExplorer } from './modeledDataStreamExplorer';
import { UnmodeledDataStreamExplorer } from './unmodeledDataStreamExplorer';
import type { SelectedAsset, SelectedDataStream } from '../../types';
import type { WithIoTSiteWiseClient } from '../../../types';

export interface DataStreamExplorerProps extends WithIoTSiteWiseClient {
  selectedAssets: SelectedAsset[];
  selectedDataStreams: SelectedDataStream[];
  onSelect: (dataStreams: SelectedDataStream[]) => void;
}

export function DataStreamExplorer({ selectedAssets, ...explorerProps }: DataStreamExplorerProps) {
  return selectedAssets.length > 0 ? (
    <ModeledDataStreamExplorer {...explorerProps} />
  ) : (
    <UnmodeledDataStreamExplorer {...explorerProps} />
  );
}
