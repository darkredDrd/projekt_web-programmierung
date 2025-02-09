import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';
import { addCustomer } from '../../../services/api';
import { useRole } from '../../../services/RoleContext';
import { useError } from '../../../services/ErrorContext';

const AddCustomer: React.FC = () => {
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', address: '' });
  const navigate = useNavigate();
  const { role } = useRole();
  const { setError } = useError();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await addCustomer(role, customer, setError);
      navigate('/customers'); // Navigate back to the customer list
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  return (
    <Box sx={{ ...modalStyle }}>
      <Typography variant="h6" component="h2">
        Add Customer
      </Typography>
      <TextField
        label="Name"
        name="name"
        value={customer.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        name="email"
        value={customer.email}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Phone"
        name="phone"
        value={customer.phone}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Address"
        name="address"
        value={customer.address}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button onClick={() => navigate('/customers')} sx={{ mr: 2 }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </Box>
    </Box>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default AddCustomer;