import { useQuery } from "@tanstack/react-query";
import { fetchGet } from "@/api/endPoints/fetchGet";
import type {
  TeamRosterProfileResponse,
  RosterProfileReportFilter,
  SeasonAgendaResponse,
  SeasonAgendaReportFilter,
  TeamMatchLoadResponse,
  MatchLoadReportFilter,
  ScoringRankingResponse,
  ScoringRankingReportFilter,
  TeamStaffRatioResponse,
  StaffRatioReportFilter,
  TeamPointsProgressResponse,
  PointsProgressReportFilter,
  CategoryParticipationResponse,
  CategoryParticipationReportFilter,
  SeasonStandingResponse,
  SeasonStandingsReportFilter,
  ScheduleDensityResponse,
  ScheduleDensityReportFilter,
  StaffImpactResponse,
  StaffImpactReportFilter,
  PaymentMethodPerformanceResponse,
  PaymentMethodReportFilter,
  SubscriptionPlanPerformanceResponse,
  SubscriptionPlanReportFilter,
} from "@/interface/IReports";

// Helper function to build query params
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const buildQueryParams = (filters: any): string => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });
  return params.toString();
};

// ============================================
// Roster Profile Report Hook
// ============================================
export const useRosterProfileReport = (
  filters: RosterProfileReportFilter = {},
  enabled: boolean = true
) => {
  return useQuery<TeamRosterProfileResponse[]>({
    queryKey: ["reports", "roster-profile", filters],
    queryFn: async () => {
      const params = buildQueryParams(filters);
      const response = await fetchGet({
        resource: ["analytics", "reports", "roster-profile"],
        params,
      });
      return response.data || [];
    },
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// ============================================
// Season Agenda Report Hook
// ============================================
export const useSeasonAgendaReport = (
  filters: SeasonAgendaReportFilter = {},
  enabled: boolean = true
) => {
  return useQuery<SeasonAgendaResponse[]>({
    queryKey: ["reports", "season-agenda", filters],
    queryFn: async () => {
      const params = buildQueryParams(filters);
      const response = await fetchGet({
        resource: ["analytics", "reports", "season-agenda"],
        params,
      });
      return response.data || [];
    },
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// Match Load Report Hook
// ============================================
export const useMatchLoadReport = (
  filters: MatchLoadReportFilter = {},
  enabled: boolean = true
) => {
  return useQuery<TeamMatchLoadResponse[]>({
    queryKey: ["reports", "match-load", filters],
    queryFn: async () => {
      const params = buildQueryParams(filters);
      const response = await fetchGet({
        resource: ["analytics", "reports", "match-load"],
        params,
      });
      return response.data || [];
    },
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// Scoring Ranking Report Hook
// ============================================
export const useScoringRankingReport = (
  filters: ScoringRankingReportFilter = {},
  enabled: boolean = true
) => {
  return useQuery<ScoringRankingResponse[]>({
    queryKey: ["reports", "scoring-ranking", filters],
    queryFn: async () => {
      const params = buildQueryParams(filters);
      const response = await fetchGet({
        resource: ["analytics", "reports", "scoring-ranking"],
        params,
      });
      return response.data || [];
    },
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// Staff Ratio Report Hook
// ============================================
export const useStaffRatioReport = (
  filters: StaffRatioReportFilter = {},
  enabled: boolean = true
) => {
  return useQuery<TeamStaffRatioResponse[]>({
    queryKey: ["reports", "staff-ratio", filters],
    queryFn: async () => {
      const params = buildQueryParams(filters);
      const response = await fetchGet({
        resource: ["analytics", "reports", "staff-ratio"],
        params,
      });
      return response.data || [];
    },
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// Points Progress Report Hook
// ============================================
export const usePointsProgressReport = (
  filters: PointsProgressReportFilter = {},
  enabled: boolean = true
) => {
  return useQuery<TeamPointsProgressResponse[]>({
    queryKey: ["reports", "points-progress", filters],
    queryFn: async () => {
      const params = buildQueryParams(filters);
      const response = await fetchGet({
        resource: ["analytics", "reports", "points-progress"],
        params,
      });
      return response.data || [];
    },
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// Category Participation Report Hook
// ============================================
export const useCategoryParticipationReport = (
  filters: CategoryParticipationReportFilter = {},
  enabled: boolean = true
) => {
  return useQuery<CategoryParticipationResponse[]>({
    queryKey: ["reports", "category-participation", filters],
    queryFn: async () => {
      const params = buildQueryParams(filters);
      const response = await fetchGet({
        resource: ["analytics", "reports", "category-participation"],
        params,
      });
      return response.data || [];
    },
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// Season Standings Report Hook
// ============================================
export const useSeasonStandingsReport = (
  filters: SeasonStandingsReportFilter = {},
  enabled: boolean = true
) => {
  return useQuery<SeasonStandingResponse[]>({
    queryKey: ["reports", "season-standings", filters],
    queryFn: async () => {
      const params = buildQueryParams(filters);
      const response = await fetchGet({
        resource: ["analytics", "reports", "season-standings"],
        params,
      });
      return response.data || [];
    },
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// Schedule Density Report Hook
// ============================================
export const useScheduleDensityReport = (
  filters: ScheduleDensityReportFilter = {},
  enabled: boolean = true
) => {
  return useQuery<ScheduleDensityResponse[]>({
    queryKey: ["reports", "schedule-density", filters],
    queryFn: async () => {
      const params = buildQueryParams(filters);
      const response = await fetchGet({
        resource: ["analytics", "reports", "schedule-density"],
        params,
      });
      return response.data || [];
    },
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// Staff Impact Report Hook
// ============================================
export const useStaffImpactReport = (
  filters: StaffImpactReportFilter = {},
  enabled: boolean = true
) => {
  return useQuery<StaffImpactResponse>({
    queryKey: ["reports", "staff-impact", filters],
    queryFn: async () => {
      const params = buildQueryParams(filters);
      const response = await fetchGet({
        resource: ["analytics", "reports", "staff-impact"],
        params,
      });
      return response.data || {};
    },
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// Payment Method Performance Report Hook
// ============================================
export const usePaymentMethodPerformanceReport = (
  filters: PaymentMethodReportFilter = {},
  enabled: boolean = true
) => {
  return useQuery<PaymentMethodPerformanceResponse[]>({
    queryKey: ["reports", "payment-method-performance", filters],
    queryFn: async () => {
      const params = buildQueryParams(filters);
      const response = await fetchGet({
        resource: ["analytics", "reports", "payment-method-performance"],
        params,
      });
      return response.data || [];
    },
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// Subscription Plan Performance Report Hook
// ============================================
export const useSubscriptionPlanPerformanceReport = (
  filters: SubscriptionPlanReportFilter = {},
  enabled: boolean = true
) => {
  return useQuery<SubscriptionPlanPerformanceResponse[]>({
    queryKey: ["reports", "subscription-plan-performance", filters],
    queryFn: async () => {
      const params = buildQueryParams(filters);
      const response = await fetchGet({
        resource: ["analytics", "reports", "subscription-plan-performance"],
        params,
      });
      return response.data || [];
    },
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
};
