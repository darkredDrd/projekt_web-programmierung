import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { fetchCustomers, updateCustomer, deleteCustomer } from '../../../services/api';
import { useRole } from '../../../services/RoleContext';
import { useError } from '../../../services/ErrorContext';
import { IconButton, Modal, Box, TextField, Button, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
};

type CustomerListProps = {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
};

const CustomerList: React.FC<CustomerListProps> = ({ customers, setCustomers }) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { role } = useRole();
  const { setError } = useError();
  const navigate = useNavigate();

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
  }, [role, setError, setCustomers]);

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (customer: Customer) => {
    if (window.confirm(`Do you really want to delete Customer ${customer.id} ${customer.name}?`)) {
      try {
        await deleteCustomer(role, customer.id, setError);
        setCustomers(customers.filter((c) => c.id !== customer.id));
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const handleSave = async () => {
    if (selectedCustomer) {
      try {
        await updateCustomer(role, selectedCustomer.id, selectedCustomer, setError);
        setCustomers(customers.map((c) => (c.id === selectedCustomer.id ? selectedCustomer : c)));
        setIsEditModalOpen(false);
      } catch (error) {
        console.error('Error updating customer:', error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedCustomer((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleInspect = (customer: Customer) => {
    // Implementiere die Inspektionslogik hier
    navigate(`/customer/${customer.id}`);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    { field: 'address', headerName: 'Address', flex: 1 },
    { field: 'created_at', headerName: 'Created At', flex: 1 },
    { field: 'updated_at', headerName: 'Updated At', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEdit(params.row as Customer)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row as Customer)}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => handleInspect(params.row as Customer)}>
          <SearchIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid rows={customers} columns={columns} pagination pageSizeOptions={[10]} getRowId={(row) => row.id} />
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Box sx={{ ...modalStyle }}>
          <Typography variant="h6" component="h2">
            Edit Customer
          </Typography>
          <TextField
            label="Name"
            name="name"
            value={selectedCustomer?.name || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={selectedCustomer?.email || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone"
            name="phone"
            value={selectedCustomer?.phone || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Address"
            name="address"
            value={selectedCustomer?.address || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={() => setIsEditModalOpen(false)} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
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

export default CustomerList;