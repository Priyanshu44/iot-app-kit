import { useCollection } from '@cloudscape-design/collection-hooks';
import { type AssetSummary } from '@aws-sdk/client-iotsitewise';

import type { SelectedAsset } from '../../../types';
import { useExplorerPreferences } from '../../../../useExplorerPreferences';

export interface UseAssetsCollectionProps {
  assets: AssetSummary[];
  selectedAssets: SelectedAsset[];
}

export function useAssetsCollection({ assets, selectedAssets }: UseAssetsCollectionProps) {
  const [preferences, setPreferences] = useExplorerPreferences({
    defaultVisibleContent: ['name'],
    resourceName: 'asset',
  });

  const { items, collectionProps, paginationProps, propertyFilterProps } = useCollection(assets, {
    propertyFiltering: {
      filteringProperties: [
        {
          key: 'id',
          propertyLabel: 'ID',
          groupValuesLabel: 'Property IDs',
          operators: ['=', '!=', ':', '!:'],
        },
        {
          key: 'name',
          propertyLabel: 'Name',
          groupValuesLabel: 'Property names',
          operators: ['=', '!=', ':', '!:'],
        },
        {
          key: 'description',
          propertyLabel: 'Description',
          groupValuesLabel: 'Property descriptions',
          operators: ['=', '!=', ':', '!:'],
        },
        {
          key: 'creationDate',
          propertyLabel: 'Creation date',
          groupValuesLabel: 'Property creation dates',
          operators: ['=', '!=', '<', '<=', '>', '>='],
        },
        {
          key: 'lastUpdateDate',
          propertyLabel: 'Last update date',
          groupValuesLabel: 'Property last update dates',
          operators: ['=', '!=', '<', '<=', '>', '>='],
        },
      ],
    },
    pagination: { pageSize: preferences.pageSize },
    selection: {
      trackBy: (item) => item.id ?? '',
      defaultSelectedItems: selectedAssets as unknown as typeof assets,
    },
    sorting: {},
  });

  return { items, collectionProps, paginationProps, propertyFilterProps, preferences, setPreferences };
}
