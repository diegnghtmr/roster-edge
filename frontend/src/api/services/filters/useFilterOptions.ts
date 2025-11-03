/**
 * Custom hooks for fetching filter options (clubs, teams, seasons, etc.)
 * Used in report filters and other dropdowns
 */

import useGetList from "../getServices/useGetList";

export interface SelectOption {
  value: number | string;
  label: string;
}

/**
 * Fetch all clubs for filter dropdowns
 */
export const useClubsForFilter = (enabled = true) => {
  const { data, isLoading } = useGetList({
    key: ["clubs-filter"],
    resource: ["clubs"],
    keyResults: "data",
    enabled,
  });

  const options: SelectOption[] = (data || []).map((club: { id: number; name: string }) => ({
    value: club.id,
    label: `${club.name} (ID: ${club.id})`,
  }));

  return { options, isLoading };
};

/**
 * Fetch all teams for filter dropdowns
 * @param clubId - Optional filter by club ID
 */
export const useTeamsForFilter = (clubId?: number, enabled = true) => {
  const params = clubId ? { clubId } : undefined;

  const { data, isLoading } = useGetList({
    key: clubId ? ["teams-filter", clubId] : ["teams-filter"],
    resource: ["teams"],
    params,
    keyResults: "data",
    enabled,
  });

  const options: SelectOption[] = (data || []).map((team: { id: number; name: string; clubName?: string }) => ({
    value: team.id,
    label: team.clubName ? `${team.name} - ${team.clubName} (ID: ${team.id})` : `${team.name} (ID: ${team.id})`,
  }));

  return { options, isLoading };
};

/**
 * Fetch all seasons for filter dropdowns
 * @param clubId - Optional filter by club ID
 */
export const useSeasonsForFilter = (clubId?: number, enabled = true) => {
  const params = clubId ? { clubId } : undefined;

  const { data, isLoading } = useGetList({
    key: clubId ? ["seasons-filter", clubId] : ["seasons-filter"],
    resource: ["seasons"],
    params,
    keyResults: "data",
    enabled,
  });

  const options: SelectOption[] = (data || []).map((season: { id: number; name: string; clubName?: string }) => ({
    value: season.id,
    label: season.clubName ? `${season.name} - ${season.clubName} (ID: ${season.id})` : `${season.name} (ID: ${season.id})`,
  }));

  return { options, isLoading };
};

/**
 * Fetch all categories for filter dropdowns
 */
export const useCategoriesForFilter = (enabled = true) => {
  const { data, isLoading } = useGetList({
    key: ["categories-filter"],
    resource: ["team-categories"],
    keyResults: "data",
    enabled,
  });

  const options: SelectOption[] = (data || []).map((category: { id: number; name: string }) => ({
    value: category.id,
    label: `${category.name} (ID: ${category.id})`,
  }));

  return { options, isLoading };
};

/**
 * Fetch all genders for filter dropdowns
 */
export const useGendersForFilter = (enabled = true) => {
  const { data, isLoading } = useGetList({
    key: ["genders-filter"],
    resource: ["team-genders"],
    keyResults: "data",
    enabled,
  });

  const options: SelectOption[] = (data || []).map((gender: { id: number; name: string }) => ({
    value: gender.id,
    label: `${gender.name} (ID: ${gender.id})`,
  }));

  return { options, isLoading };
};
