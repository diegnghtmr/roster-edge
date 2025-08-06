/**
 * Formatea una fecha en formato legible
 * @param date - La fecha a formatear
 * @param locale - El locale a usar (por defecto 'es-ES')
 * @returns La fecha formateada
 */
export const formatDate = (date: Date | string, locale: string = 'es-ES'): string => {
  const dateObject = typeof date === 'string' ? new Date(date) : date;
  
  return dateObject.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formatea una fecha y hora en formato legible
 * @param date - La fecha a formatear
 * @param locale - El locale a usar (por defecto 'es-ES')
 * @returns La fecha y hora formateada
 */
export const formatDateTime = (date: Date | string, locale: string = 'es-ES'): string => {
  const dateObject = typeof date === 'string' ? new Date(date) : date;
  
  return dateObject.toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Obtiene el tiempo relativo desde una fecha
 * @param date - La fecha desde la cual calcular
 * @returns El tiempo relativo (ej: "hace 2 horas")
 */
export const getRelativeTime = (date: Date | string): string => {
  const dateObject = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObject.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'hace unos segundos';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `hace ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`;
  }
  
  if (diffInDays < 30) {
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `hace ${diffInWeeks} ${diffInWeeks === 1 ? 'semana' : 'semanas'}`;
  }
  
  if (diffInDays < 365) {
    const diffInMonths = Math.floor(diffInDays / 30);
    return `hace ${diffInMonths} ${diffInMonths === 1 ? 'mes' : 'meses'}`;
  }
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `hace ${diffInYears} ${diffInYears === 1 ? 'año' : 'años'}`;
};
