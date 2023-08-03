import { type SiteWisePropertyAliasQuery, type SiteWiseAssetQuery } from '@iot-app-kit/source-iotsitewise';

export interface SelectedAsset {
  id: string;
}

export interface SelectedModeledDataStream {
  assetId: string;
  id: string;
}

export interface SelectedUnmodeledDataStream {
  alias: string;
}

export type SelectedDataStream = SelectedModeledDataStream | SelectedUnmodeledDataStream;

export type Selection = SelectedAsset | SelectedDataStream;

export type Query = SiteWisePropertyAliasQuery & SiteWiseAssetQuery;
