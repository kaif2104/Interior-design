import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const API_URL = `${BASE_URL}/feedback`;

export const createFeedback = (feedbackData) => {
  return axios.post(API_URL, feedbackData);
};

export const getFeedback = (filters = {}) => {
  return axios.get(API_URL, { params: filters });
};
