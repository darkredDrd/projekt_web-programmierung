import * as React from 'react';
import { useState, useEffect } from 'react';
// import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useRole } from '../../../services/RoleContext';
import { useError } from '../../../services/ErrorContext';
import { createCustomer, fetchCustomers } from '../../../services/api';
import CustomerList from './CustomerList';

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
};

export default function MainGrid() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id' | 'created_at' | 'updated_at'>>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const { role } = useRole();
  const { setError } = useError();

  useEffect(() => {
    const getCustomers = async () => {
      try {
        const data = await fetchCustomers(role, setError);
        setCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    getCustomers();
  }, [role, setError]);

  const handleAdd = async () => {
    try {
      await createCustomer(role, newCustomer, setError);
      setIsAddModalOpen(false);
      setNewCustomer({ name: '', email: '', phone: '', address: '' }); // Reset new customer fields
      // Fetch customers again to update the list
      const data = await fetchCustomers(role, setError);
      setCustomers(data);
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, p: 2 }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Customers
      </Typography>
      {/* <Grid container spacing={2}>
        <Grid item xs={12} lg={12}> */}
          <CustomerList customers={customers} setCustomers={setCustomers} />
        {/* </Grid>
      </Grid> */}
      <Button variant="contained" color="primary" onClick={() => setIsAddModalOpen(true)} sx={{ mt: 2 }}>
        Add Customer
      </Button>
      <Modal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <Box sx={{ ...modalStyle }}>
          <Typography variant="h6" component="h2">
            Add Customer
          </Typography>
          <TextField
            label="Name"
            name="name"
            value={newCustomer.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={newCustomer.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone"
            name="phone"
            value={newCustomer.phone}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Address"
            name="address"
            value={newCustomer.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={() => setIsAddModalOpen(false)} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleAdd}>
              Add
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

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