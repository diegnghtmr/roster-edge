/**
 * Valida si un email es válido
 * @param email - El email a validar
 * @returns true si el email es válido, false en caso contrario
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida si una contraseña es segura
 * @param password - La contraseña a validar
 * @returns Un objeto con la validez y los errores encontrados
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra mayúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra minúscula');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('La contraseña debe contener al menos un número');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('La contraseña debe contener al menos un carácter especial');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Valida si un número de teléfono es válido (formato español)
 * @param phone - El número de teléfono a validar
 * @returns true si el teléfono es válido, false en caso contrario
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+34|0034|34)?[6789]\d{8}$/;
  const cleanPhone = phone.replace(/[\s-]/g, '');
  return phoneRegex.test(cleanPhone);
};

/**
 * Valida si un campo está vacío
 * @param value - El valor a validar
 * @returns true si el campo está vacío, false en caso contrario
 */
export const isEmpty = (value: string | null | undefined): boolean => {
  return !value || value.trim().length === 0;
};

/**
 * Valida la longitud de un campo
 * @param value - El valor a validar
 * @param min - Longitud mínima
 * @param max - Longitud máxima
 * @returns true si la longitud es válida, false en caso contrario
 */
export const isValidLength = (value: string, min: number, max: number): boolean => {
  const length = value.trim().length;
  return length >= min && length <= max;
};

/**
 * Valida si un valor es un número
 * @param value - El valor a validar
 * @returns true si es un número, false en caso contrario
 */
export const isNumber = (value: any): boolean => {
  return !isNaN(value) && !isNaN(parseFloat(value));
};

/**
 * Valida si una URL es válida
 * @param url - La URL a validar
 * @returns true si la URL es válida, false en caso contrario
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
