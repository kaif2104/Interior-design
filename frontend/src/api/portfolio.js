import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const API_URL = `${BASE_URL}/portfolio`;

export const getPortfolioItems = (filters = {}) => {
  return axios.get(API_URL, { params: filters });
};

export const getPortfolioItemById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};