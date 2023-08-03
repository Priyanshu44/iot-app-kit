import { ListTimeSeriesCommand, ListTimeSeriesCommandInput } from '@aws-sdk/client-iotsitewise';
import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query';
import { WithIoTSiteWiseClient } from '../../../../types';
import { iotSiteWiseKey } from '../../../data/sitewise';

const timeSeriesKeys = {
  all: [{ ...iotSiteWiseKey[0], scope: 'time series' }] as const,
  lists: () => [{ ...timeSeriesKeys.all[0], resource: 'time series summary' }] as const,
  list: ({ aliasPrefix }: ListTimeSeriesCommandInput) => [{ ...timeSeriesKeys.lists()[0], aliasPrefix }] as const,
};

function createQueryFn({ client }: WithIoTSiteWiseClient) {
  return async function ({
    pageParam: nextToken,
    signal,
  }: QueryFunctionContext<ReturnType<typeof timeSeriesKeys.list>>) {
    try {
      const command = new ListTimeSeriesCommand({
        nextToken,
        aliasPrefix: nextToken,
      });

      return client.send(command, { abortSignal: signal });
    } catch (error) {
      const errorMessage = `Failed to list time series data streams. Error: ${error}`;
      console.error(errorMessage);

      if (error instanceof Error) {
        throw error;
      }

      throw new Error(errorMessage);
    }
  };
}

export interface UseTimeSeriesDataStreamsProps extends WithIoTSiteWiseClient {
  alias?: string;
}

export function useTimeSeriesDataStreams({ alias, client }: UseTimeSeriesDataStreamsProps) {
  const {
    data: { pages: timeSeriesDataStreams = [] } = {},
    hasNextPage,
    fetchNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: timeSeriesKeys.list({ aliasPrefix: alias }),
    queryFn: createQueryFn({ client }),
    getNextPageParam: ({ nextToken }) => nextToken,
  });

  return { timeSeriesDataStreams, hasNextPage, fetchNextPage, status, error };
}
