import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const adminAxios = axios.create({
  baseURL: API_BASE,
  withCredentials: true
});

export const getAdminStats = () => {
  return adminAxios.get('/auth/admin-stats');
};

export const getAllUsers = () => {
  return adminAxios.get('/auth/users');
};

export const updateConsultationStatus = (id, data) => {
  return adminAxios.patch(`/consultations/${id}/status`, data);
};

export const deleteConsultation = (id) => {
  return adminAxios.delete(`/consultations/${id}`);
};

export const createPortfolioItem = (data) => {
  return adminAxios.post('/portfolio', data);
};

export const updatePortfolioItem = (id, data) => {
  return adminAxios.put(`/portfolio/${id}`, data);
};

export const deletePortfolioItem = (id) => {
  return adminAxios.delete(`/portfolio/${id}`);
};

export const getAllPaymentsAdmin = () => {
  return adminAxios.get('/payments');
};

export const createStoreItem = (data) => {
  return adminAxios.post('/items', data);
};

export const updateStoreItem = (id, data) => {
  return adminAxios.put(`/items/${id}`, data);
};

export const deleteStoreItem = (id) => {
  return adminAxios.delete(`/items/${id}`);
};
