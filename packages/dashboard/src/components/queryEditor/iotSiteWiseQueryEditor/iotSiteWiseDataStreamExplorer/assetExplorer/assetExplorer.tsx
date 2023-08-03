import Box from '@cloudscape-design/components/box';
import CollectionPreferences from '@cloudscape-design/components/collection-preferences';
import Header from '@cloudscape-design/components/header';
import Link from '@cloudscape-design/components/link';
import Pagination from '@cloudscape-design/components/pagination';
import PropertyFilter from '@cloudscape-design/components/property-filter';
import Table from '@cloudscape-design/components/table';
import React from 'react';

import { ResourceHierarchyPath } from './resourceHierarchyPath';
import { useAssets } from './useAssets';
import { useParentAssetId } from './useParentAssetId';
import { useAssetsCollection } from './useAssetsCollection';

import type { WithIoTSiteWiseClient } from '../../../types';
import type { SelectedAsset } from '../../types';

export interface AssetExplorerProps extends WithIoTSiteWiseClient {
  selectedAssets: SelectedAsset[];
  onSelect: (assets: SelectedAsset[]) => void;
}

/** User interface element enabling the exploration and selection of assets. */
export function AssetExplorer({ selectedAssets, onSelect, client }: AssetExplorerProps) {
  const [parentAssetId, setParentAssetId] = useParentAssetId();
  const { assets, isFetching, fetchNextPage } = useAssets({ assetId: parentAssetId, client });
  const { items, collectionProps, paginationProps, propertyFilterProps, preferences, setPreferences } =
    useAssetsCollection({
      assets,
      selectedAssets,
    });

  return (
    <Table
      {...collectionProps}
      ariaLabels={{
        itemSelectionLabel: (isNotSelected, asset) =>
          isNotSelected ? `Select asset ${asset.name}` : `Deselect asset ${asset.name}`,
      }}
      items={items}
      trackBy={({ id = '' }) => id}
      header={
        <>
          <Header
            variant='h3'
            actions={
              <ResourceHierarchyPath
                client={client}
                onClickAssetName={setParentAssetId}
                parentAssetId={parentAssetId}
              />
            }
          >
            Assets
          </Header>
        </>
      }
      columnDefinitions={[
        {
          sortingField: 'name',
          id: 'name',
          header: 'Name',
          cell: ({ name, id, hierarchies = [] }) => {
            return hierarchies.length > 0 ? (
              <Link
                ariaLabel='List child assets'
                onFollow={(event) => {
                  event.preventDefault();
                  setParentAssetId(id);
                }}
              >
                {name}
              </Link>
            ) : (
              name
            );
          },
        },

        {
          id: 'arn',
          header: 'ARN',
          cell: ({ arn }) => arn,
        },
        {
          id: 'id',
          header: 'ID',
          cell: ({ id }) => id,
        },
        {
          id: 'description',
          header: 'Description',
          cell: ({ description }) => description,
          sortingField: 'description',
        },
        {
          id: 'creationDate',
          header: 'Creation date',
          cell: ({ creationDate }) => creationDate?.toLocaleDateString(),
          sortingField: 'creationDate',
        },
        {
          id: 'lastUpdateDate',
          header: 'Last update date',
          cell: ({ lastUpdateDate }) => lastUpdateDate?.toLocaleDateString(),
          sortingField: 'lastUpdateDate',
        },
      ]}
      variant='embedded'
      loading={isFetching}
      loadingText='Loading assets...'
      selectionType='multi'
      stickyColumns={preferences.stickyColumns}
      onSelectionChange={(event) => {
        // tell user about selection
        if (onSelect) {
          onSelect(event.detail.selectedItems);
        }

        // pass event to `useCollection` for synchronization
        if (collectionProps.onSelectionChange) {
          collectionProps.onSelectionChange(event);
        }
      }}
      empty={
        <Box textAlign='center' color='inherit'>
          <b>No assets.</b>

          <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
            No assets to display.
          </Box>
        </Box>
      }
      resizableColumns
      pagination={
        <Pagination
          {...paginationProps}
          // only show open ended pagination on root assets
          openEnd={parentAssetId == null}
          ariaLabels={{
            nextPageLabel: 'Next page',
            paginationLabel: 'Resource explorer pagination',
            previousPageLabel: 'Previous page',
            pageLabel: (pageNumber) => `Page ${pageNumber}`,
          }}
          onNextPageClick={() => fetchNextPage()}
        />
      }
      filter={
        <PropertyFilter
          {...propertyFilterProps}
          filteringLoadingText='Loading suggestions'
          filteringErrorText='Error fetching suggestions.'
          filteringRecoveryText='Retry'
          filteringFinishedText='End of results'
          filteringEmpty='No suggestions found'
          i18nStrings={{
            filteringAriaLabel: 'your choice',
            dismissAriaLabel: 'Dismiss',
            filteringPlaceholder: 'Filter assets by text, property or value',
            groupValuesText: 'Values',
            groupPropertiesText: 'Properties',
            operatorsText: 'Operators',
            operationAndText: 'and',
            operationOrText: 'or',
            operatorLessText: 'Less than',
            operatorLessOrEqualText: 'Less than or equal',
            operatorGreaterText: 'Greater than',
            operatorGreaterOrEqualText: 'Greater than or equal',
            operatorContainsText: 'Contains',
            operatorDoesNotContainText: 'Does not contain',
            operatorEqualsText: 'Equals',
            operatorDoesNotEqualText: 'Does not equal',
            editTokenHeader: 'Edit filter',
            propertyText: 'Property',
            operatorText: 'Operator',
            valueText: 'Value',
            cancelActionText: 'Cancel',
            applyActionText: 'Apply',
            allPropertiesLabel: 'All properties',
            tokenLimitShowMore: 'Show more',
            tokenLimitShowFewer: 'Show fewer',
            clearFiltersText: 'Clear filters',
            removeTokenButtonAriaLabel: (token) => `Remove token ${token.propertyKey} ${token.operator} ${token.value}`,
            enteredTextLabel: (text) => `Use: "${text}"`,
          }}
        />
      }
      visibleColumns={preferences.visibleContent}
      stripedRows={preferences.stripedRows}
      wrapLines={preferences.wrapLines}
      preferences={
        <CollectionPreferences
          title='Asset preferences'
          confirmLabel='Confirm'
          cancelLabel='Cancel'
          preferences={preferences}
          onConfirm={({ detail }) => {
            setPreferences(detail as typeof preferences);
          }}
          pageSizePreference={{
            title: 'Select page size',
            options: [
              { value: 10, label: '10' },
              { value: 25, label: '25' },
              { value: 100, label: '100' },
              { value: 250, label: '250' },
            ],
          }}
          wrapLinesPreference={{
            label: 'Wrap lines',
            description: 'Select to see all the text and wrap the lines',
          }}
          stripedRowsPreference={{
            label: 'Striped rows',
            description: 'Select to add alternating shaded rows',
          }}
          visibleContentPreference={{
            title: 'Select visible content',
            options: [
              {
                label: `Asset fields`,
                options: [
                  { id: 'arn', label: 'ARN' },
                  { id: 'id', label: 'ID' },
                  { id: 'name', label: 'Name' },
                  { id: 'description', label: 'Description' },
                  { id: 'creationDate', label: 'Creation date' },
                  { id: 'lastUpdateDate', label: 'Last update date' },
                ],
              },
            ],
          }}
          stickyColumnsPreference={{
            firstColumns: {
              title: 'Stick first column(s)',
              description: 'Keep the first column(s) visible while horizontally scrolling the table content.',
              options: [
                { label: 'None', value: 0 },
                { label: 'First column', value: 1 },
              ],
            },
          }}
        />
      }
    />
  );
}
