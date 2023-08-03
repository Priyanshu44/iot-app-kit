import { useQueries, type QueryFunctionContext } from '@tanstack/react-query';
import invariant from 'tiny-invariant';

import { extractPropertiesFromAsset } from './extractPropertiesFromAsset';
import { assetKeys } from '../../../../../data/assets';
import { describeAsset } from '../../../../../describeAsset';
import type { WithIoTSiteWiseClient } from '../../../../../types';

export interface UseAssetPropertiesProps extends WithIoTSiteWiseClient {
  assetIds: string[];
}

export function useAssetProperties({ assetIds, client }: UseAssetPropertiesProps) {
  const queries =
    useQueries({
      queries: assetIds.map((assetId) => ({
        // we store the descriptions in the cache using the assetId as the key
        queryKey: assetKeys.description({ assetId }),
        queryFn: createUseAssetPropertiesQueryFn({ client }),
        select: extractPropertiesFromAsset,
      })),
    }) ?? [];

  const assetProperties = queries.flatMap(({ data = [] }) => data);
  const isFetching = queries.some(({ isFetching }) => isFetching);

  return { assetProperties, isFetching };
}

function createUseAssetPropertiesQueryFn({ client }: WithIoTSiteWiseClient) {
  return async function ({
    queryKey: [{ assetId }],
    signal,
  }: QueryFunctionContext<ReturnType<typeof assetKeys.description>>) {
    invariant(assetId, 'Expected assetId to be defined as required by the enabled flag.');

    // asset descriptions include properties
    return describeAsset({ assetId, signal, client });
  };
}
