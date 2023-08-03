import type {
  Query,
  SelectedAsset,
  SelectedDataStream,
  SelectedUnmodeledDataStream,
  SelectedModeledDataStream,
  Selection,
} from '../types';

export const queryFactory = {
  create(selection: Selection[]): Query {
    const assetQueries = createAssetQueries(selection);
    const propertyAliasQueries = createPropertyAliasQueries(selection);

    return {
      assets: assetQueries,
      properties: propertyAliasQueries,
    };
  },
};

function createAssetQueries(selection: Selection[]) {
  const assetQueriesWithoutProperties = createAssetQueriesWithoutProperties(selection);
  const assetQueriesWithProperties = createAssetQueriesWithProperties(selection);
  const assetQueries = mergeAssetQueries(assetQueriesWithoutProperties, assetQueriesWithProperties);

  return assetQueries;
}

function createAssetQueriesWithoutProperties(selection: Selection[]) {
  return selection.filter(isSelectedAsset).map((asset) => ({ assetId: asset.id, properties: [] }));
}

function isSelectedAsset(selection: Selection): selection is SelectedAsset {
  return !isSelectedDataStream(selection);
}

function isSelectedDataStream(selection: Selection): selection is SelectedDataStream {
  return isSelectedModeledDataStream(selection) || isSelectedUnmodeledDataStream(selection);
}

function isSelectedUnmodeledDataStream(selection: Selection): selection is SelectedUnmodeledDataStream {
  return Object.hasOwn(selection, 'alias');
}

function isSelectedModeledDataStream(selection: Selection): selection is SelectedModeledDataStream {
  return Object.hasOwn(selection, 'id') && Object.hasOwn(selection, 'assetId');
}

function createAssetQueriesWithProperties(selection: Selection[]) {
  const assetQueriesWithProperties = selection
    .filter(isSelectedModeledDataStream)
    .map(({ assetId, id: propertyId }) => ({
      assetId,
      properties: [{ propertyId }],
    }));

  return dedupeAssetQueriesWithProperties(assetQueriesWithProperties);
}

function dedupeAssetQueriesWithProperties(queries: Query['assets']) {
  const dedupedAssetQueriesWithProperties = queries.reduce<Query['assets']>((acc, currentQuery) => {
    const existingQuery = acc.find((query) => query.assetId === currentQuery.assetId);

    if (existingQuery) {
      existingQuery.properties.push(...currentQuery.properties);
      return acc;
    }

    return [...acc, currentQuery];
  }, []);

  return dedupedAssetQueriesWithProperties;
}

function mergeAssetQueries(queriesA: Query['assets'], queriesB: Query['assets']) {
  const assetQueries = [...queriesA, ...queriesB];

  const mergedAssetQueries = assetQueries.reduce<Query['assets']>((acc, currentQuery) => {
    const existingQuery = acc.find((query) => query.assetId === currentQuery.assetId);

    if (existingQuery) {
      existingQuery.properties.push(...currentQuery.properties);
      return acc;
    }

    return [...acc, currentQuery];
  }, []);

  return mergedAssetQueries;
}

function createPropertyAliasQueries(selection: Selection[]) {
  const propertyAliasQueries = selection
    .filter(isSelectedUnmodeledDataStream)
    .map((unmodeledDataStream) => ({ propertyAlias: unmodeledDataStream.alias }));

  return dedupePropertyAliasQueries(propertyAliasQueries);
}

function dedupePropertyAliasQueries(queries: Query['properties']) {
  const propertyAliasQueries = queries.reduce<Query['properties']>((acc, currentQuery) => {
    const existingQuery = acc.find((query) => query.propertyAlias === currentQuery.propertyAlias);

    if (existingQuery) {
      return acc;
    }

    return [...acc, currentQuery];
  }, []);

  return propertyAliasQueries;
}
