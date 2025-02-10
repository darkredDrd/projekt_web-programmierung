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

export const fetchCustomerById = async (role: string, id: string, setError: (error: string) => void) => {
  try {
    const response = await axios.get(`${API_URL}/customers/${id}`, {
      headers: {
        Authorization: role,
      },
    });
    return response.data;
  } catch (error) {
    setError('Error fetching customer');
    throw error;
  }
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
};

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

export const uploadDocument = async (role: string, offerId: number, file: File, uploadedBy: string, setError: (error: string) => void) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_URL}/offers/${offerId}/documents`, formData, {
      headers: {
        Authorization: role,
        uploaded_by: uploadedBy,
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

export const updateDocument = async (role: string, offerId: number, documentId: number, data: { uploaded_by: string; file?: File }, setError: (error: string) => void) => {
  try {
    const formData = new FormData();
    if (data.file) {
      formData.append('file', data.file);
    }

    const response = await axios.put(`${API_URL}/offers/${offerId}/documents/${documentId}`, formData, {
      headers: {
        Authorization: role,
        'Content-Type': 'multipart/form-data',
        uploaded_by: data.uploaded_by,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      setError(error.response.data.error);
    } else if (error instanceof Error) {
      setError('Error updating document: ' + error.message);
    } else {
      setError('Error updating document: An unknown error occurred');
    }
    throw error;
  }
};

export const deleteDocument = async (role: string, offerId: number, id: number, setError: (error: string) => void) => {
  try {
    const response = await axios.delete(`${API_URL}/offers/${offerId}/documents/${id}`, {
      headers: {
        Authorization: role,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      setError(error.response.data.error);
    } else if (error instanceof Error) {
      setError('Error deleting document: ' + error.message);
    } else {
      setError('Error deleting document: An unknown error occurred');
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
      const response = await axios.post(`${API_URL}/offers/${offerId}/comments`, {
          offer_id: offerId,
          author,
          content
      }, {
          headers: {
              Authorization: role
          }
      });
      return response.data;
  } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
          setError(error.response.data.error);
      } else if (error instanceof Error) {
          setError('Error adding comment: ' + error.message);
      } else {
          setError('Error adding comment: An unknown error occurred');
      }
      throw error;
  }
};

export const updateComment = async (role: string, offerId: number, commentId: number, data: { author: string; content: string }, setError: (error: string) => void) => {
  try {
    const response = await axios.put(`${API_URL}/offers/${offerId}/comments/${commentId}`, {
      offer_id: offerId,
      ...data
    }, {
      headers: {
        Authorization: role,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      setError(error.response.data.error);
    } else if (error instanceof Error) {
      setError('Error updating comment: ' + error.message);
    } else {
      setError('Error updating comment: An unknown error occurred');
    }
    throw error;
  }
};

export const deleteComment = async (role: string, offerId: number, id: number, setError: (error: string) => void) => {
  try {
    const response = await axios.delete(`${API_URL}/offers/${offerId}/comments/${id}`, {
      headers: {
        Authorization: role,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      setError(error.response.data.error);
    } else if (error instanceof Error) {
      setError('Error deleting comment: ' + error.message);
    } else {
      setError('Error deleting comment: An unknown error occurred');
    }
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
    const response = await axios.get(`${API_URL}/offers/${id}`, {
      headers: {
        Authorization: role,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      setError(error.response.data.error);
    } else if (error instanceof Error) {
      setError('Error fetching offer: ' + error.message);
    } else {
      setError('Error fetching offer: An unknown error occurred');
    }
    throw error;
  }
};

export const fetchOffersByCustomerId = async (role: string, customerId: string, setError: (error: string) => void) => {
  try {
    const response = await axios.get(`/api/customers/${customerId}/offers`, {
      headers: {
        Authorization: role,
      },
    });
    return response.data;
  } catch (error) {
    setError('Error fetching offers');
    throw error;
  }
};