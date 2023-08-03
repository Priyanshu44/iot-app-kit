import type { Query, SelectedAsset, SelectedModeledDataStream, SelectedUnmodeledDataStream } from '../types';

export const selectionFactory = {
  create(query: Query) {
    return {
      assets: createAssetSelection(query),
      dataStreams: {
        modeled: createModeledDataStreamSelection(query),
        unmodeled: createUnmodeledDataStreamSelection(query),
      },
    };
  },
};

function createAssetSelection({ assets }: Query): SelectedAsset[] {
  const selectedAssets = assets.map(({ assetId: id }) => ({ id }));

  return selectedAssets;
}

function createModeledDataStreamSelection({ assets }: Query): SelectedModeledDataStream[] {
  const selectedModeledDataStreams = assets.flatMap(({ assetId, properties }) => {
    return properties.map(({ propertyId: id }) => ({ assetId, id }));
  });

  return selectedModeledDataStreams;
}

function createUnmodeledDataStreamSelection({ properties }: Query): SelectedUnmodeledDataStream[] {
  const selectedUnmodeledDataStreams = properties.map((property) => ({ alias: property.propertyAlias }));

  return selectedUnmodeledDataStreams;
}
