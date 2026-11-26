import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useClubsForFilter, useSeasonsForFilter, useTeamsForFilter } from '@/api/services/filters/useFilterOptions';
import useGetList from '@/api/services/getServices/useGetList';
import useGetOne from '@/api/services/getServices/useGetOne';
import { useMutateDeleteService } from '@/api/services/useDelete';
import { useDependencyService } from '@/api/services/useDependency';
import { apiData, mockApi, queryRouter } from './httpFixture';

describe('filter API responses', () => {
  it.each([{}, { data: null }, { data: { id: 11, name: 'Not a list' } }, { data: [] }])(
    'exposes no options for an empty or malformed list: %j',
    async (wire) => {
      mockApi(() => Response.json(wire));
      const { result } = renderHook(() => useClubsForFilter(), { wrapper: queryRouter() });
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.options).toEqual([]);
    }
  );

  it('keeps valid names and IDs but does not expose malformed entries in a dropdown', async () => {
    mockApi(() => apiData([{ id: 11, name: 'North' }, { id: '45', name: 'Wrong ID type' }, { id: 20 }]));
    const { result } = renderHook(() => useClubsForFilter(), { wrapper: queryRouter() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.options).toEqual([{ value: 11, label: 'North (ID: 11)' }]);
  });

  it.each([
    ['teams', useTeamsForFilter],
    ['seasons', useSeasonsForFilter],
  ] as const)('serializes the numeric club ID for %s and keeps related labels', async (resource, useFilter) => {
    const fetchMock = mockApi(() => apiData([{ id: 45, name: 'First', clubName: 'North' }]));
    const { result } = renderHook(() => useFilter(17), { wrapper: queryRouter() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const url = new URL(String(fetchMock.mock.calls[0][0]));
    expect(url.pathname).toBe(`/api/${resource}/`);
    expect([...url.searchParams]).toEqual([['clubId', '17']]);
    expect(result.current.options).toEqual([{ value: 45, label: 'First - North (ID: 45)' }]);
  });

  it('leaves a missing single resource unset instead of returning a truthy array', async () => {
    mockApi(() => apiData(null));
    const { result } = renderHook(() => useGetList<{ id: number }>({
      key: 'match-9', resource: ['matches/9'], keyResults: 'data',
    }), { wrapper: queryRouter() });
    expect(result.current.data).toBeUndefined();
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it('keeps unfiltered list metadata and the caller’s search parameters', async () => {
    const row = { id: 11, name: 'North' };
    const fetchMock = mockApi(() => Response.json({ data: [row], records_count: 20, limit: 1, next_page: 2, previous_page: null }));
    const { result } = renderHook(() => useGetList<typeof row[]>({
      key: 'countries', resource: ['countries'], keyResults: 'data', params: new URLSearchParams('page=1'),
    }), { wrapper: queryRouter() });
    await waitFor(() => expect(result.current.data).toEqual([row]));
    expect(result.current.metaData).toEqual({ records_count: 20, limit: 1, next_page: 2, previous_page: null });
    expect(String(fetchMock.mock.calls[0][0])).toBe('http://localhost/api/countries/?page=1');
  });

  it('keeps the single-resource hook’s raw response envelope', async () => {
    const row = { id: 11, name: 'North' };
    const fetchMock = mockApi(() => apiData(row));
    const { result } = renderHook(() => useGetOne({ key: ['country', 11], resource: ['countries', '11'] }), { wrapper: queryRouter() });
    await waitFor(() => expect(result.current.data).toEqual({ success: true, data: row }));
    expect(String(fetchMock.mock.calls[0][0])).toBe('http://localhost/api/countries/11/?');
  });

  it('keeps the status and empty payload for a successful HTTP 204 delete', async () => {
    const fetchMock = mockApi(() => new Response(null, { status: 204 }));
    const { result } = renderHook(() => useMutateDeleteService(['countries']), { wrapper: queryRouter() });
    await act(async () => {
      await expect(result.current.mutateAsync(11)).resolves.toEqual({ data: {}, status: 204 });
    });
    expect(String(fetchMock.mock.calls[0][0])).toBe('http://localhost/api/countries/11');
    expect(fetchMock.mock.calls[0][1]?.method).toBe('DELETE');
  });

  it('keeps the raw dependency response and GET search parameters', async () => {
    const fetchMock = mockApi(() => apiData([]));
    const { result } = renderHook(() => useDependencyService(['teams']), { wrapper: queryRouter() });
    await act(async () => {
      await expect(result.current.mutateAsync('clubId=17')).resolves.toEqual({ success: true, data: [] });
    });
    expect(String(fetchMock.mock.calls[0][0])).toBe('http://localhost/api/teams/?clubId=17');
    expect(fetchMock.mock.calls[0][1]?.method).toBe('GET');
  });
});
