import {
  type DescribeAssetCommandInput,
  type ListAssetsCommandInput,
  type ListAssociatedAssetsCommandInput,
} from '@aws-sdk/client-iotsitewise';

import { iotSiteWiseKey } from './sitewise';

/** Cache key factory for IoT SiteWise assets.  */
export const assetKeys = {
  all: [{ ...iotSiteWiseKey[0], scope: 'assets' }] as const,
  lists: () => [{ ...assetKeys.all[0], resource: 'asset summary' }] as const,
  list: (input: ListAssetsCommandInput) =>
    [{ ...assetKeys.lists()[0], filter: input.filter, assetModelId: input.assetModelId }] as const,
  associatedLists: () => [{ ...assetKeys.all[0], resource: 'associated asset summary' }] as const,
  associatedList: ({ assetId, hierarchyId, traversalDirection }: ListAssociatedAssetsCommandInput) =>
    [{ ...assetKeys.associatedLists()[0], assetId, hierarchyId, traversalDirection }] as const,
  descriptions: () => [{ ...assetKeys.all[0], resource: 'asset description' }] as const,
  description: (input: DescribeAssetCommandInput) =>
    [{ ...assetKeys.descriptions()[0], assetId: input.assetId }] as const,
};
