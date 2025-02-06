// frontend/src/components/CustomerList.tsx
import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { fetchCustomers } from '../services/api';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'phone', headerName: 'Phone', width: 150 },
  { field: 'address', headerName: 'Address', width: 250 },
  { field: 'created_at', headerName: 'Created At', width: 180 },
  { field: 'updated_at', headerName: 'Updated At', width: 180 },
];

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const getCustomers = async () => {
      try {
        const data = await fetchCustomers();
        setCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    getCustomers();
  }, []);

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid rows={customers} columns={columns} pageSize={10} />
    </div>
  );
};

export default CustomerList;