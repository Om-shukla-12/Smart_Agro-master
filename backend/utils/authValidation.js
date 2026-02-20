const GMAIL_REGEX = /^[A-Za-z0-9._%+-]+@gmail\.com$/i;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9])\S{8,}$/;

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const isValidGmail = (email = '') => GMAIL_REGEX.test(email.trim());

const isStrongPassword = (password = '') => PASSWORD_REGEX.test(password);

module.exports = {
  normalizeEmail,
  isValidGmail,
  isStrongPassword,
};
