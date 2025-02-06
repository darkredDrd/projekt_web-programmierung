// frontend/src/services/api.ts
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/customers';

export const fetchCustomers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};