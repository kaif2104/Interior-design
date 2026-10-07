import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const API_URL = `${BASE_URL}/orders`;

export const createOrder = (orderData) => {
  return axios.post(API_URL, orderData, { withCredentials: true });
};

export const getOrders = (params = {}) => {
  return axios.get(API_URL, { params, withCredentials: true });
};

export const getOrderById = (id) => {
  return axios.get(`${API_URL}/${id}`, { withCredentials: true });
};

export const updateOrderStatus = (id, data) => {
  return axios.patch(`${API_URL}/${id}/status`, data, { withCredentials: true });
};

export const deleteOrder = (id) => {
  return axios.delete(`${API_URL}/${id}`, { withCredentials: true });
};
