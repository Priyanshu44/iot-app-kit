import React from 'react';

import { IoTSiteWiseQueryEditor } from './iotSiteWiseQueryEditor';
import { QueryEditorErrorBoundary } from './queryEditorErrorBoundary';
import { QueryEditorPort } from './queryEditorPort';
import type { QueryEditorProps } from './types';

export function QueryEditor(props: QueryEditorProps) {
  return (
    <QueryEditorErrorBoundary>
      <QueryEditorPort>
        <IoTSiteWiseQueryEditor {...props} />
      </QueryEditorPort>
    </QueryEditorErrorBoundary>
  );
}
