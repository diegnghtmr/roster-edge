/**
 * Validates if an email is valid
 * @param email - The email to validate
 * @returns true if the email is valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates if a password is secure
 * @param password - The password to validate
 * @returns An object with validity and found errors
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates if a phone number is valid (international format)
 * @param phone - The phone number to validate
 * @param countryCode - Optional country code for more accurate validation (e.g., 'US', 'GB')
 * @returns true if the phone is valid, false otherwise
 */
export const isValidPhone = (phone: string, countryCode?: string): boolean => {
  // Remove all non-digit characters except + at the beginning
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  
  // Basic validation rules
  if (cleanPhone.length < 7 || cleanPhone.length > 15) {
    return false;
  }
  
  // If starts with +, must be followed by country code (1-3 digits)
  if (cleanPhone.startsWith('+')) {
    const withoutPlus = cleanPhone.substring(1);
    if (!/^\d{7,14}$/.test(withoutPlus)) {
      return false;
    }
  }
  
  // Country-specific validation
  if (countryCode) {
    switch (countryCode.toUpperCase()) {
      case 'US':
      case 'CA':
        // North American format: 10 digits or +1 followed by 10 digits
        return /^(\+1)?\d{10}$/.test(cleanPhone);
      case 'GB':
        // UK format: 10-11 digits or +44 followed by 9-10 digits
        return /^(\+44)?\d{10,11}$/.test(cleanPhone);
      case 'MX':
        // Mexican format: 10 digits or +52 followed by 10 digits
        return /^(\+52)?\d{10}$/.test(cleanPhone);
      default:
        // Generic international format
        return /^\+?\d{7,15}$/.test(cleanPhone);
    }
  }
  
  // Generic validation: 7-15 digits, optionally starting with +
  return /^\+?\d{7,15}$/.test(cleanPhone);
};

/**
 * Validates if a field is empty
 * @param value - The value to validate
 * @returns true if the field is empty, false otherwise
 */
export const isEmpty = (value: string | null | undefined): boolean => {
  return !value || value.trim().length === 0;
};

/**
 * Validates the length of a field
 * @param value - The value to validate
 * @param min - Minimum length
 * @param max - Maximum length
 * @returns true if the length is valid, false otherwise
 */
export const isValidLength = (value: string, min: number, max: number): boolean => {
  const length = value.trim().length;
  return length >= min && length <= max;
};

/**
 * Validates if a value is a number
 * @param value - The value to validate
 * @returns true if it's a number, false otherwise
 */
export const isNumber = (value: unknown): boolean => {
  return typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)) && !isNaN(parseFloat(value)));
};

/**
 * Validates if a URL is valid
 * @param url - The URL to validate
 * @returns true if the URL is valid, false otherwise
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
