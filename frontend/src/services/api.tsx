import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const fetchCustomers = async (role: string, setError: (error: string) => void) => {
  try {
    const response = await axios.get(`${API_URL}/customers`, {
      headers: {
        Authorization: role,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      setError(error.response.data.error);
    } else if (error instanceof Error) {
      setError('Error fetching customers: ' + error.message);
    } else {
      setError('Error fetching customers: An unknown error occurred');
    }
    throw error;
  }
};

type CustomerSchema = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

export const updateCustomer = async (role: string, id: number, data: CustomerSchema, setError: (error: string) => void) => {
  try {
    const response = await axios.put(`${API_URL}/customers/${id}`, data, {
      headers: {
        Authorization: role,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      setError(error.response.data.error);
    } else if (error instanceof Error) {
      setError('Error updating customer: ' + error.message);
    } else {
      setError('Error updating customer: An unknown error occurred');
    }
    throw error;
  }
};

export const deleteCustomer = async (role: string, id: number, setError: (error: string) => void) => {
  try {
    const response = await axios.delete(`${API_URL}/customers/${id}`, {
      headers: {
        Authorization: role,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      setError(error.response.data.error);
    } else if (error instanceof Error) {
      setError('Error deleting customer: ' + error.message);
    } else {
      setError('Error deleting customer: An unknown error occurred');
    }
    throw error;
  }
};

export const createCustomer = async (role: string, data: CustomerSchema, setError: (error: string) => void) => {
  try {
    const response = await axios.post(`${API_URL}/customers`, data, {
      headers: {
        Authorization: role,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      setError(error.response.data.error);
    } else if (error instanceof Error) {
      setError('Error creating customer: ' + error.message);
    } else {
      setError('Error creating customer: An unknown error occurred');
    }
    throw error;
  }
}

export const fetchOffers = async (role: string, setError: (error: string) => void) => {
  try {
    const response = await axios.get(`${API_URL}/offers`, {
      headers: {
        Authorization: role,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      setError(error.response.data.error);
    } else if (error instanceof Error) {
      setError('Error fetching offers: ' + error.message);
    } else {
      setError('Error fetching offers: An unknown error occurred');
    }
    throw error;
  }
}

type OffersSchema = {
  customer_id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  status: string;
  created_by: string;
};

export const updateOffer = async (role: string, id: number, data: OffersSchema, setError: (error: string) => void) => {
  try {
    const response = await axios.put(`${API_URL}/offers/${id}`, data, {
      headers: {
        Authorization: role,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      setError(error.response.data.error);
    } else if (error instanceof Error) {
      setError('Error updating offer: ' + error.message);
    } else {
      setError('Error updating offer: An unknown error occurred');
    }
    throw error;
  }
};

export const deleteOffer = async (role: string, id: number, setError: (error: string) => void) => {
  try {
    const response = await axios.delete(`${API_URL}/offers/${id}`, {
      headers: {
        Authorization: role,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      setError(error.response.data.error);
    } else if (error instanceof Error) {
      setError('Error deleting offer: ' + error.message);
    } else {
      setError('Error deleting offer: An unknown error occurred');
    }
    throw error;
  }
};

export const createOffer = async (role: string, data: OffersSchema, setError: (error: string) => void) => {
  try {
    const response = await axios.post(`${API_URL}/offers`, data, {
      headers: {
        Authorization: role,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      setError(error.response.data.error);
    } else if (error instanceof Error) {
      setError('Error creating offer: ' + error.message);
    } else {
      setError('Error creating offer: An unknown error occurred');
    }
    throw error;
  }
};

export const getDocuments = async (role: string, setError: (error: string) => void) => {
  try {
    const response = await axios.get(`${API_URL}/documents`, {
      headers: {
        Authorization: role,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      setError(error.response.data.error);
    } else if (error instanceof Error) {
      setError('Error fetching documents: ' + error.message);
    } else {
      setError('Error fetching documents: An unknown error occurred');
    }
    throw error;
  }
};
