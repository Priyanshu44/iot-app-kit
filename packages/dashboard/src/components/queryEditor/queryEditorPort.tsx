import React from 'react';

import { QueryEditorErrorBoundary } from './queryEditorErrorBoundary';
import type { QueryEditorProps } from './types';

interface QueryEditorPortProps {
  children: React.ReactElement<QueryEditorProps>;
}

/** Ensures query editors are instantiated correctly with the correct props. */
export function QueryEditorPort({ children }: QueryEditorPortProps) {
  return children;
}
