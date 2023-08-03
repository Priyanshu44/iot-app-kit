import Tabs from '@cloudscape-design/components/tabs';
import React from 'react';

import { IoTSiteWiseDataStreamExplorer } from './iotSiteWiseDataStreamExplorer';
import { IoTSiteWiseDataStreamSearch } from './iotSiteWiseDataStreamSearch';
import type { Query, Selection } from './types';
import { querySelectionConverter } from './querySelectionConverter';
import type { QueryEditorProps } from '../types';

export type IoTSiteWiseQueryEditorProps = QueryEditorProps<Query>;

export function IoTSiteWiseQueryEditor({ query, onUpdateQuery, client }: IoTSiteWiseQueryEditorProps) {
  const { assets: selectedAssets, dataStreams: selectedDataStreams } = querySelectionConverter.toSelection(query);

  function handleOnSelect(selection: Selection[]) {
    const newQuery = querySelectionConverter.toQuery(selection);

    onUpdateQuery(newQuery);
  }

  return (
    <Tabs
      tabs={[
        {
          label: 'Browse assets',
          id: 'first',
          content: (
            <IoTSiteWiseDataStreamExplorer
              selectedAssets={selectedAssets}
              selectedDataStreams={selectedDataStreams}
              onSelect={handleOnSelect}
              client={client}
            />
          ),
        },
        {
          label: 'Advanced search',
          id: 'second',
          content: <IoTSiteWiseDataStreamSearch />,
        },
      ]}
    />
  );
}
