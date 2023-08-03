import type { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import type { SiteWiseAssetQuery, SiteWisePropertyAliasQuery } from '@iot-app-kit/source-iotsitewise';

/** Utility type for IoT SiteWise Client. */
export interface WithIoTSiteWiseClient {
  /** AWS SDK v3 IoT SiteWise client. */
  client: IoTSiteWiseClient;
}

export type WithClient = WithIoTSiteWiseClient;

/** Utility type for AbortSignal. */
export interface WithAbortSignal {
  /** Optional AbortSignal instance to enable query cancellation. */
  signal?: AbortSignal;
}

type IoTSiteWiseQuery = SiteWiseAssetQuery | SiteWisePropertyAliasQuery;

export type Query = IoTSiteWiseQuery;

export interface QueryEditorProps<Q extends Query = Query> extends WithClient {
  query: Q;
  onUpdateQuery: (query: Q) => void;
}
