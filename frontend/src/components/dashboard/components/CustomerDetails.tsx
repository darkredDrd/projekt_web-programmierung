import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCustomerById, updateCustomer, fetchOffersByCustomerId } from '../../../services/api';
import { useRole } from '../../../services/RoleContext';
import { useError } from '../../../services/ErrorContext';
import { Box, Typography, Grid, Paper, TextField, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
};

type Offer = {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  status: string;
  created_by: string;
};

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const { role } = useRole();
  const { setError } = useError();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const getCustomer = async () => {
      if (id) {
        try {
          const response = await fetchCustomerById(role, id, setError);
          setCustomer(response.customer); // Extrahiere das Kundenobjekt aus dem API-Response
        } catch (error) {
          console.error('Error fetching customer:', error);
        }
      }
    };

    const getOffers = async () => {
      if (id) {
        try {
          const response = await fetchOffersByCustomerId(role, id, setError);
          setOffers(response.offers || []); // Extrahiere die Angebote aus dem API-Response und setze einen Standardwert
        } catch (error) {
          console.error('Error fetching offers:', error);
        }
      }
    };

    getCustomer();
    getOffers();
  }, [id, role, setError]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (customer) {
      try {
        await updateCustomer(role, customer.id, customer, setError);
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating customer:', error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  if (!customer) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Customer Details
      </Typography>
      <Paper elevation={3} sx={{ p: 3, maxWidth: '800px', margin: 'auto' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', width: '150px' }}>
                Customer ID:
              </Typography>
              {isEditing ? (
                <TextField
                  name="id"
                  value={customer.id}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              ) : (
                <Typography variant="body1">{customer.id}</Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', width: '150px' }}>
                Name:
              </Typography>
              {isEditing ? (
                <TextField
                  name="name"
                  value={customer.name}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
              ) : (
                <Typography variant="body1">{customer.name}</Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', width: '150px' }}>
                Email:
              </Typography>
              {isEditing ? (
                <TextField
                  name="email"
                  value={customer.email}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
              ) : (
                <Typography variant="body1">{customer.email}</Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', width: '150px' }}>
                Phone:
              </Typography>
              {isEditing ? (
                <TextField
                  name="phone"
                  value={customer.phone}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
              ) : (
                <Typography variant="body1">{customer.phone}</Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', width: '150px' }}>
                Address:
              </Typography>
              {isEditing ? (
                <TextField
                  name="address"
                  value={customer.address}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
              ) : (
                <Typography variant="body1">{customer.address}</Typography>
              )}
            </Box>
          </Grid>
                  </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          {isEditing ? (
            <>
              <Button variant="contained" onClick={handleSave} sx={{ mr: 2 }}>
                Save
              </Button>
              <Button variant="contained" color="error" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="contained" onClick={handleEdit} sx={{ mr: 2 }}>
              Edit
            </Button>
          )}
        </Box>
      </Paper>
      <Accordion sx={{ mt: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Offers</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {offers && offers.length > 0 ? (
            offers.map((offer) => (
              <Box key={offer.id} sx={{ mb: 2 }}>
                <Typography variant="body1"><strong>Title:</strong> {offer.title}</Typography>
                <Typography variant="body1"><strong>Description:</strong> {offer.description}</Typography>
                <Typography variant="body1"><strong>Price:</strong> {offer.price} {offer.currency}</Typography>
                <Typography variant="body1"><strong>Status:</strong> {offer.status}</Typography>
                <Typography variant="body1"><strong>Created By:</strong> {offer.created_by}</Typography>
              </Box>
            ))
          ) : (
            <Typography>No offers available for this customer.</Typography>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default CustomerDetail;