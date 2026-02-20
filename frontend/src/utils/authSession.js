export const getToken = () => localStorage.getItem('token');

export const isAuthenticated = () => Boolean(getToken());

export const logoutUser = () => {
  localStorage.removeItem('token');
};
