import api from './api.js';

// Extracts a friendly message from an Axios error, falling back to a generic one.
const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || fallback;

export const signupRequest = async ({ name, email, password }) => {
  try {
    const { data } = await api.post('/auth/signup', { name, email, password });
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, message: getErrorMessage(error, 'Signup failed. Please try again.') };
  }
};

export const loginRequest = async ({ email, password }) => {
  try {
    const { data } = await api.post('/auth/login', { email, password });
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, message: getErrorMessage(error, 'Invalid email or password.') };
  }
};

export const logoutRequest = async () => {
  try {
    await api.post('/auth/logout');
  } catch {
    // Best-effort: even if this fails, the frontend will clear local state.
  }
};

export const getCurrentUserRequest = async () => {
  try {
    const { data } = await api.get('/auth/me');
    return data.user;
  } catch {
    return null;
  }
};
