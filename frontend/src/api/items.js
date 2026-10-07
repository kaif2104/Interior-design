import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const API_URL = `${BASE_URL}/items`;

export const getItems = (params = {}) => {
  return axios.get(API_URL, { params });
};

export const getItemById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const createItem = (itemData) => {
  return axios.post(API_URL, itemData, { withCredentials: true });
};

export const updateItem = (id, itemData) => {
  return axios.put(`${API_URL}/${id}`, itemData, { withCredentials: true });
};

export const deleteItem = (id) => {
  return axios.delete(`${API_URL}/${id}`, { withCredentials: true });
};
