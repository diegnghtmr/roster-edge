import useGetList from '../getServices/useGetList';

export interface SelectOption {
  value: number | string;
  label: string;
}

interface CatalogEntry {
  id: number;
  name: string;
  clubName?: string;
  symbol?: string;
}

function readCatalog(data: unknown): CatalogEntry[] {
  if (!Array.isArray(data)) return [];

  const entries: CatalogEntry[] = [];
  const ids = new Set<number>();
  for (const row of data as unknown[]) {
    if (!row || typeof row !== 'object' || !('id' in row) || !('name' in row)) continue;
    const { id, name } = row;
    if (typeof id !== 'number' || !Number.isSafeInteger(id) || id <= 0 || ids.has(id)) continue;
    if (typeof name !== 'string' || !name.trim()) continue;

    ids.add(id);
    entries.push({
      id,
      name,
      clubName: 'clubName' in row && typeof row.clubName === 'string' ? row.clubName : undefined,
      symbol: 'symbol' in row && typeof row.symbol === 'string' ? row.symbol : undefined,
    });
  }
  return entries;
}

function useCatalog(resource: string, key: string, enabled: boolean, clubId?: number) {
  const { data, isLoading, error } = useGetList({
    key: clubId ? [key, clubId] : [key],
    resource: [resource],
    params: clubId ? { clubId: String(clubId) } : undefined,
    keyResults: 'data',
    enabled,
  });

  return { entries: readCatalog(data), isLoading, error };
}

const namedOption = ({ id, name }: CatalogEntry): SelectOption => ({
  value: id,
  label: `${name} (ID: ${id})`,
});

const clubOption = ({ id, name, clubName }: CatalogEntry): SelectOption =>
  namedOption({ id, name: clubName ? `${name} - ${clubName}` : name });

const currencyOption = (entry: CatalogEntry): SelectOption =>
  entry.symbol ? { value: entry.id, label: `${entry.name} (${entry.symbol})` } : namedOption(entry);

function useFilterOptions(
  resource: string,
  key: string,
  enabled: boolean,
  toOption = namedOption,
  clubId?: number
) {
  const { entries, isLoading } = useCatalog(resource, key, enabled, clubId);
  return { options: entries.map(toOption), isLoading };
}

export const useClubsForFilter = (enabled = true) =>
  useFilterOptions('clubs', 'clubs-filter', enabled);

export const useTeamsForFilter = (clubId?: number, enabled = true) =>
  useFilterOptions('teams', 'teams-filter', enabled, clubOption, clubId);

export const useSeasonsForFilter = (clubId?: number, enabled = true) =>
  useFilterOptions('seasons', 'seasons-filter', enabled, clubOption, clubId);

export const useCategoriesForFilter = (enabled = true) =>
  useFilterOptions('team-categories', 'categories-filter', enabled);

export const useTeamGenderCatalog = (enabled = true) =>
  useCatalog('team-genders', 'genders-filter', enabled);

export const useGendersForFilter = (enabled = true) => {
  const { entries, isLoading } = useTeamGenderCatalog(enabled);
  return { options: entries.map(namedOption), isLoading };
};

export const usePlansForFilter = (enabled = true) =>
  useFilterOptions('plans', 'plans-filter', enabled);

export const usePaymentMethodsForFilter = (enabled = true) =>
  useFilterOptions('payment-methods', 'payment-methods-filter', enabled);

export const useCurrenciesForFilter = (enabled = true) =>
  useFilterOptions('currencies', 'currencies-filter', enabled, currencyOption);

export const useSubscriptionStatusesForFilter = (enabled = true) =>
  useFilterOptions('subscription-statuses', 'subscription-statuses-filter', enabled);
