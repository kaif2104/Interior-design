import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const API_URL = `${BASE_URL}/consultations`;

export const createConsultation = (consultationData) => {
  return axios.post(API_URL, consultationData);
};

export const getConsultations = (filters = {}) => {
  return axios.get(API_URL, { params: filters });
};

export const getConsultationById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const updateConsultationStatus = (id, statusData) => {
  return axios.patch(`${API_URL}/${id}/status`, statusData);
};

export const deleteConsultation = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
