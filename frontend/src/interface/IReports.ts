// Analytics Report Types for RosterEdge

// ============================================
// Roster Profile Report
// ============================================
export interface PhysicalStateBreakdown {
  physicalStateId?: number;
  physicalStateName?: string;
  players?: number;
}

export interface TeamRosterProfileResponse {
  teamId?: number;
  teamName?: string;
  clubId?: number;
  clubName?: string;
  totalPlayers?: number;
  activePlayers?: number;
  averageAge?: number;
  physicalStates?: PhysicalStateBreakdown[];
}

export interface RosterProfileReportFilter {
  clubId?: number;
  teamId?: number;
  onlyActiveTeams?: boolean;
  onlyActivePlayers?: boolean;
}

// ============================================
// Season Agenda Report
// ============================================
export interface SeasonAgendaResponse {
  eventId?: number;
  eventName?: string;
  eventDate?: string; // ISO date format
  daysToEvent?: number;
  phase?: string;
  seasonId?: number;
  seasonName?: string;
  seasonStartDate?: string;
  seasonEndDate?: string;
  clubId?: number;
  clubName?: string;
  venueId?: number;
  venueName?: string;
  cityId?: number;
  cityName?: string;
}

export interface SeasonAgendaReportFilter {
  seasonId?: number;
  clubId?: number;
  fromDate?: string;
  toDate?: string;
  horizonDays?: number;
}

// ============================================
// Match Load Report
// ============================================
export interface TeamMatchLoadResponse {
  seasonId?: number;
  seasonName?: string;
  teamId?: number;
  teamName?: string;
  clubId?: number;
  clubName?: string;
  homeMatches?: number;
  awayMatches?: number;
  totalMatches?: number;
}

export interface MatchLoadReportFilter {
  seasonId?: number;
  clubId?: number;
  teamId?: number;
}

// ============================================
// Scoring Ranking Report
// ============================================
export interface ScoringRankingResponse {
  seasonId?: number;
  seasonName?: string;
  teamId?: number;
  teamName?: string;
  clubId?: number;
  clubName?: string;
  matchesPlayed?: number;
  goalsFor?: number;
  goalsAgainst?: number;
  goalDifference?: number;
  goalsPerMatch?: number;
  goalsAgainstPerMatch?: number;
}

export interface ScoringRankingReportFilter {
  seasonId?: number;
  clubId?: number;
  minMatches?: number;
}

// ============================================
// Staff Ratio Report
// ============================================
export interface StaffRoleBreakdown {
  roleId?: number;
  roleName?: string;
  staffCount?: number;
}

export interface TeamStaffRatioResponse {
  teamId?: number;
  teamName?: string;
  clubId?: number;
  clubName?: string;
  players?: number;
  activePlayers?: number;
  staff?: number;
  activeStaff?: number;
  staffToPlayerRatio?: number;
  averageStaffTenure?: number;
  roleBreakdown?: StaffRoleBreakdown[];
}

export interface StaffRatioReportFilter {
  clubId?: number;
  teamId?: number;
  onlyActive?: boolean;
}

// ============================================
// Points Progress Report
// ============================================
export interface TeamPointsProgressResponse {
  seasonId?: number;
  seasonName?: string;
  teamId?: number;
  teamName?: string;
  matchId?: number;
  matchDate?: string;
  matchdayId?: number;
  matchdayName?: string;
  matchNumber?: number;
  pointsEarned?: number;
  cumulativePoints?: number;
  goalsFor?: number;
  goalsAgainst?: number;
  goalDifference?: number;
}

export interface PointsProgressReportFilter {
  seasonId?: number;
  teamId?: number;
}

// ============================================
// Category Participation Report
// ============================================
export interface CategoryParticipationResponse {
  clubId?: number;
  clubName?: string;
  seasonId?: number;
  seasonName?: string;
  categoryId?: number;
  categoryName?: string;
  genderId?: number;
  genderName?: string;
  matchesCount?: number;
  participationPercentage?: number;
}

export interface CategoryParticipationReportFilter {
  clubId?: number;
  seasonId?: number;
  categoryId?: number;
  genderId?: number;
}

// ============================================
// Season Standings Report
// ============================================
export interface SeasonStandingResponse {
  seasonId?: number;
  seasonName?: string;
  teamId?: number;
  teamName?: string;
  clubId?: number;
  clubName?: string;
  played?: number;
  wins?: number;
  draws?: number;
  losses?: number;
  goalsFor?: number;
  goalsAgainst?: number;
  goalDifference?: number;
  points?: number;
  winRate?: number;
  pointsPerMatch?: number;
  rankingPosition?: number;
}

export interface SeasonStandingsReportFilter {
  seasonId?: number;
  clubId?: number;
}

// ============================================
// Schedule Density Report
// ============================================
export interface ScheduleDensityResponse {
  teamId?: number;
  teamName?: string;
  seasonId?: number;
  seasonName?: string;
  matchId?: number;
  matchDate?: string;
  restDays?: number;
  matchesLastSevenDays?: number;
  matchesNextSevenDays?: number;
  matchDurationMinutes?: number;
  belowRestThreshold?: boolean;
}

export interface ScheduleDensityReportFilter {
  seasonId?: number;
  teamId?: number;
  fromDate?: string;
  toDate?: string;
  alertThresholdDays?: number;
}

// ============================================
// Staff Impact Report
// ============================================
export interface TeamStaffImpactDetail {
  teamId?: number;
  teamName?: string;
  clubId?: number;
  clubName?: string;
  seasonId?: number;
  seasonName?: string;
  staffToPlayerRatio?: number;
  averagePlayerAge?: number;
  averageStaffTenure?: number;
  winRate?: number;
  pointsPerMatch?: number;
  goalDifference?: number;
  matchesPlayed?: number;
}

export interface StaffImpactResponse {
  ratioWinRateCorrelation?: number;
  ratioPointsCorrelation?: number;
  averageStaffRatio?: number;
  averagePlayerAge?: number;
  teamDetails?: TeamStaffImpactDetail[];
}

export interface StaffImpactReportFilter {
  seasonId?: number;
  clubId?: number;
}

// ============================================
// Payment Method Performance Report
// ============================================
export interface PaymentMethodPerformanceResponse {
  paymentMethodId?: number;
  paymentMethodName?: string;
  totalPayments?: number;
  uniqueCustomers?: number;
  plansCovered?: number;
  grossAmount?: number;
  totalDiscount?: number;
  netRevenue?: number;
  averageTicket?: number;
  revenueSharePercentage?: number;
  discountRatePercentage?: number;
  firstPaymentDate?: string;
  lastPaymentDate?: string;
}

export interface PaymentMethodReportFilter {
  fromDate?: string;
  toDate?: string;
  planId?: number;
  currencyId?: number;
}

// ============================================
// Subscription Plan Performance Report
// ============================================
export interface SubscriptionPlanPerformanceResponse {
  planId?: number;
  planName?: string;
  planPrice?: number;
  totalSubscriptions?: number;
  activeSubscriptions?: number;
  trialSubscriptions?: number;
  suspendedSubscriptions?: number;
  inactiveSubscriptions?: number;
  upcomingRenewals?: number;
  churnedRecently?: number;
  paymentsCount?: number;
  grossRevenue?: number;
  totalDiscount?: number;
  netRevenue?: number;
  averageRevenuePerSubscription?: number;
  arpu?: number;
  retentionRatePercentage?: number;
}

export interface SubscriptionPlanReportFilter {
  fromDate?: string;
  toDate?: string;
  planId?: number;
  statusId?: number;
  renewalHorizonDays?: number;
  churnWindowDays?: number;
  referenceDate?: string;
}

// ============================================
// Report Metadata
// ============================================
export interface ReportMetadata {
  id: string;
  name: string;
  description: string;
  category: 'team' | 'season' | 'performance' | 'staff' | 'finance';
  icon: string;
  endpoint: string;
}
