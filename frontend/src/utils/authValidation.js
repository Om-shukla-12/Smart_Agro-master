const GMAIL_REGEX = /^[A-Za-z0-9._%+-]+@gmail\.com$/i;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9])\S{8,}$/;

export const normalizeEmail = (email = '') => email.trim().toLowerCase();

export const isValidGmail = (email = '') => GMAIL_REGEX.test(email.trim());

export const isStrongPassword = (password = '') => PASSWORD_REGEX.test(password);

export const getAuthValidationErrors = ({ email, password }) => {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = 'Email is required.';
  } else if (!isValidGmail(email)) {
    errors.email = 'Please enter a valid Gmail address (example@gmail.com).';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (!isStrongPassword(password)) {
    errors.password =
      'Password must be at least 8 characters with one uppercase letter and one special character.';
  }

  return errors;
};

export const validateAuthInput = ({ email, password }) => {
  const errors = getAuthValidationErrors({ email, password });
  if (errors.email) return errors.email;
  if (errors.password) return errors.password;

  return '';
};
