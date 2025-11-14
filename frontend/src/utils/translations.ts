/**
 * Translation mappings for backend enum values to Spanish
 */

export const PHYSICAL_STATE_TRANSLATIONS: Record<string, string> = {
  Available: 'Disponible',
  Injured: 'Lesionado',
  'In recovery': 'En recuperación',
  Suspended: 'Suspendido',
  'Not available': 'No disponible',
  'On loan': 'Cedido',
  Resting: 'Descansando',
};

export const STAFF_ROLE_TRANSLATIONS: Record<string, string> = {
  COACH: 'Entrenador',
  DOCTOR: 'Médico',
  PHYSIOTHERAPIST: 'Fisioterapeuta',
  ASSISTANT_COACH: 'Asistente Técnico',
  ANALYST: 'Analista',
  NUTRITIONIST: 'Nutricionista',
  GOALKEEPER_COACH: 'Entrenador de Porteros',
  FITNESS_COACH: 'Preparador Físico',
};

export const TEAM_GENDER_TRANSLATIONS: Record<string, string> = {
  MALE: 'Masculino',
  FEMALE: 'Femenino',
  MIXED: 'Mixto',
};

export const TEAM_CATEGORY_TRANSLATIONS: Record<string, string> = {
  FIRST_DIVISION: 'Primera División',
  RESERVE: 'Reserva',
  UNDER_20: 'Sub-20',
  UNDER_17: 'Sub-17',
  ACADEMY: 'Academia',
};

/**
 * Translates a physical state name from English to Spanish
 */
export function translatePhysicalState(state: string | null | undefined): string {
  if (!state) return 'Desconocido';
  return PHYSICAL_STATE_TRANSLATIONS[state] || state;
}

/**
 * Translates a staff role name from English to Spanish
 */
export function translateStaffRole(role: string | null | undefined): string {
  if (!role) return 'Desconocido';
  return STAFF_ROLE_TRANSLATIONS[role] || role;
}

/**
 * Translates a team gender from English to Spanish
 */
export function translateGender(gender: string | null | undefined): string {
  if (!gender) return 'Desconocido';
  return TEAM_GENDER_TRANSLATIONS[gender] || gender;
}

/**
 * Translates a team category from English to Spanish
 */
export function translateCategory(category: string | null | undefined): string {
  if (!category) return 'Desconocido';
  return TEAM_CATEGORY_TRANSLATIONS[category] || category;
}
