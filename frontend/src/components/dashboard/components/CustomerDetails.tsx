import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchCustomerById,
  updateCustomer,
  fetchOffersByCustomerId,
  deleteCustomer,
} from "../../../services/api";
import { useRole } from "../../../services/RoleContext";
import { useError } from "../../../services/ErrorContext";
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";

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
  customer_id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const { role } = useRole();
  const { setError } = useError();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getCustomer = async () => {
      if (id) {
        try {
          const response = await fetchCustomerById(role, id, setError);
          setCustomer(response.customer); // Extrahiere das Kundenobjekt aus dem API-Response
        } catch (error) {
          console.error("Error fetching customer:", error);
        }
      }
    };

    const getOffers = async () => {
      if (id) {
        try {
          const response = await fetchOffersByCustomerId(role, id, setError);
          setOffers(response); // Extrahiere die Angebote aus dem API-Response und setze einen Standardwert
        } catch (error) {
          console.error("Error fetching offers:", error);
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
        console.error("Error updating customer:", error);
      }
    }
  };

  const handleDelete = async () => {
    if (customer) {
      try {
        await deleteCustomer(role, customer.id, setError);
        navigate("/customers"); // Navigate back to the customers list after deletion
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleInspect = (offerId: number) => {
    navigate(`/offer-details/${offerId}`);
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "Offer ID", flex: 1 },
    { field: "title", headerName: "Title", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    { field: "price", headerName: "Price", flex: 1 },
    { field: "currency", headerName: "Currency", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <IconButton onClick={() => handleInspect(params.row.id)}>
          <SearchIcon />
        </IconButton>
      ),
    },
  ];

  if (!customer) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Customer Details
      </Typography>
      <Paper elevation={3} sx={{ p: 3, maxWidth: "800px", margin: "auto" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", width: "150px" }}
              >
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
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", width: "150px" }}
              >
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
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", width: "150px" }}
              >
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
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", width: "150px" }}
              >
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
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", width: "150px" }}
              >
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
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
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
            <>
              <Button
                variant="contained"
                onClick={handleEdit}
                sx={{ mr: 2 }}
                disabled={role !== "Basic Account-Manager"}
              >
                {role === "Basic Account-Manager"
                  ? "Edit"
                  : "Current role isn't authorized to edit customer"}
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={role !== "Basic Account-Manager"}
              >
                {role === "Basic Account-Manager"
                  ? "Delete"
                  : "Current role isn't authorized to delete customer"}
              </Button>
            </>
          )}
        </Box>
      </Paper>
      <Accordion sx={{ mt: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Offers</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={offers}
              columns={columns}
              pageSizeOptions={[5, 10]}
              getRowId={(row) => row.id}
            />
          </div>
        </AccordionDetails>
      </Accordion>
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this customer?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerDetail;
