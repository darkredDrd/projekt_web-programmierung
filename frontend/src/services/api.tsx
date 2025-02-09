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

export const addCustomer = async (role: string, customer: Customer, setError: (error: string) => void) => {
  try {
    const response = await fetch('/api/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${role}`,
      },
      body: JSON.stringify(customer),
    });
    if (!response.ok) {
      throw new Error('Failed to add customer');
    }
    return await response.json();
  } catch (error) {
    setError(error.message);
    throw error;
  }
};

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
}

// Removed duplicate fetchOfferById function

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

export const uploadDocument = async (role: string, offerId: number, file: File, setError: (error: string) => void) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_URL}/offers/${offerId}/documents`, formData, {
      headers: {
        Authorization: role,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      setError(error.response.data.error);
    } else if (error instanceof Error) {
      setError('Error uploading document: ' + error.message);
    } else {
      setError('Error uploading document: An unknown error occurred');
    }
    throw error;
  }
};

export const fetchDocumentsCount = async (role: string, offerId: number, setError: (error: string) => void) => {
  try {
    const response = await axios.get(`${API_URL}/offers/${offerId}/documents`, {
      headers: {
        Authorization: role,
      },
    });
    return Array.isArray(response.data.documents) ? response.data.documents.length : 0;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      setError(error.response.data.error);
    } else if (error instanceof Error) {
      setError('Error fetching documents count: ' + error.message);
    } else {
      setError('Error fetching documents count: An unknown error occurred');
    }
    throw error;
  }
};

export const fetchDocuments = async (role: string, offerId: number, setError: (error: string) => void) => {
  try {
      const response = await axios.get(`${API_URL}/offers/${offerId}/documents`, {
          headers: {
            Authorization: role
          }
      });
      return response.data;
  } catch (error) {
      console.error('Error fetching documents:', error);
      setError(String(error));
      return [];
  }
};

export const fetchCommentsCount = async (role: string, offerId: number, setError: (error: string) => void) => {
  try {
    const response = await axios.get(`${API_URL}/offers/${offerId}/comments`, {
      headers: {
        Authorization: role,
      },
    });
    return Array.isArray(response.data.comments) ? response.data.comments.length : 0;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      setError(error.response.data.error);
    } else if (error instanceof Error) {
      setError('Error fetching comments count: ' + error.message);
    } else {
      setError('Error fetching comments count: An unknown error occurred');
    }
    throw error;
  }
};

export const fetchComments = async (role: string, offerId: number, setError: (error: string) => void) => {
  try {
    const response = await axios.get(`${API_URL}/offers/${offerId}/comments`, {
      headers: {
        Authorization: role,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      setError(error.response.data.error);
    } else if (error instanceof Error) {
      setError('Error fetching comments: ' + error.message);
    } else {
      setError('Error fetching comments: An unknown error occurred');
    }
    throw error;
  }
};

export const addComment = async (role: string, offerId: number, author: string, content: string, setError: (error: string) => void) => {
  try {
      const response = await fetch(`/api/offers/${offerId}/comments`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${role}`
          },
          body: JSON.stringify({ author, content })
      });
      if (!response.ok) {
          throw new Error('Failed to add comment');
      }
      return await response.json();
  } catch (error) {
      setError(error.message);
      throw error;
  }
};

export const createComment = async (role: string, offerId: number, author: string, content: string, setError: (error: string) => void) => {
    try {
        const response = await fetch(`/api/offers/${offerId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${role}`,
            },
            body: JSON.stringify({ author, content }),
        });
        if (!response.ok) {
            throw new Error('Failed to create comment');
        }
        return await response.json();
    } catch (error) {
        setError(String(error));
        throw error;
    }
};

export const updateOfferStatus = async (role: string, offerId: number, status: string, setError: (error: string) => void) => {
  try {
    const response = await axios.put(`${API_URL}/offers/${offerId}/status`, { status }, {
      headers: {
        Authorization: role,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      setError(error.response.data.error);
    } else if (error instanceof Error) {
      setError('Error updating offer status: ' + error.message);
    } else {
      setError('Error updating offer status: An unknown error occurred');
    }
    throw error;
  }
};

export const fetchOfferById = async (role: string, id: string, setError: (error: string) => void) => {
  try {
      const response = await fetch(`${API_URL}offers/${id}`, {
          headers: {
              Authorization: role,
          },
      });
      if (!response.ok) {
          throw new Error('Failed to fetch offer');
      }
      const data = await response.json();
      return data;
  } catch (error) {
      setError(String(error));
      throw error;
  }
};