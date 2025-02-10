import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { updateOffer, fetchOffers, fetchDocumentsCount, fetchCommentsCount, fetchCustomers } from '../../../services/api';
import { useRole } from '../../../services/RoleContext';
import { useError } from '../../../services/ErrorContext';
import { IconButton, Modal, Box, TextField, Button, Typography, MenuItem } from '@mui/material';
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

type Offers = {
    id: number;
    customer_id: number;
    customer_name: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    status: string;
    created_by: string;
    created_at: string;
    updated_at: string;
    document_count: number;
    comment_count: number;
}

type OffersListProps = {
    offers: Offers[];
    setOffers: React.Dispatch<React.SetStateAction<Offers[]>>;
};

const OffersList: React.FC<OffersListProps> = ({ offers, setOffers }) => {
    const [selectedOffer, setSelectedOffer] = useState<Offers | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const { role } = useRole();
    const { setError } = useError();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const customersData = await fetchCustomers(role, setError);
                setCustomers(customersData);
    
                const offersData = await fetchOffers(role, setError);
                const updatedOffers = await Promise.all(offersData.map(async (offer: Offers) => {
                    const documentsCount = await fetchDocumentsCount(role, offer.id, setError);
                    const commentsCount = await fetchCommentsCount(role, offer.id, setError);
                    const customer = customersData.find((customer: Customer) => customer.id === offer.customer_id);
                    return { ...offer, document_count: documentsCount, comment_count: commentsCount, customer_name: customer ? customer.name : 'Unknown' };
                }));
    
                // Sort the offers by created_at in descending order
                updatedOffers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
                setOffers(updatedOffers);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(String(error));
            }
        };
    
        fetchInitialData();
    }, [role, setError, setOffers]);

    const handleInspect = (offer: Offers) => {
        navigate(`/offer-details/${offer.id}`);
    };

    const handleSave = async () => {
        if (selectedOffer) {
            try {
                await updateOffer(role, selectedOffer.id, selectedOffer, setError);
                setIsEditModalOpen(false);
                setSelectedOffer(null);
                // Fetch offers again to update the list
                const offersData = await fetchOffers(role, setError);
                const updatedOffers = await Promise.all(offersData.map(async (offer: Offers) => {
                    const documentsCount = await fetchDocumentsCount(role, offer.id, setError);
                    const commentsCount = await fetchCommentsCount(role, offer.id, setError);
                    const customer = customers.find((customer: Customer) => customer.id === offer.customer_id);
                    return { ...offer, document_count: documentsCount, comment_count: commentsCount, customer_name: customer ? customer.name : 'Unknown' };
                }));
                setOffers(updatedOffers);
            } catch (error) {
                console.error('Error updating offer:', error);
                setError(String(error));
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSelectedOffer((prev) => (prev ? { ...prev, [name]: value } : null));
    }

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'Offer ID', flex: 1 },
        { field: 'customer_name', headerName: 'Customer Name', flex: 1 },
        { field: 'title', headerName: 'Title', flex: 1 },
        { field: 'status', headerName: 'Status', flex: 1 },
        { field: 'document_count', headerName: 'Documents', flex: 1 },
        { field: 'comment_count', headerName: 'Comments', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            renderCell: (params) => (
                <div>
                    <IconButton onClick={() => handleInspect(params.row as Offers)}>
                        <SearchIcon />
                    </IconButton>
                </div>
            ),
        },
    ];

    return (
        <div style={{ height: 600, width: '100%' }}>
            <DataGrid rows={offers} columns={columns} pagination pageSizeOptions={[10]} getRowId={(row) => row.id} />
            <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                <Box sx={{ ...modalStyle }}>
                    <Typography variant="h6" component="h2">
                        Edit Offer
                    </Typography>
                    <TextField
                        name="customer_id"
                        label="Customer ID"
                        value={selectedOffer?.customer_id || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        name="customer_name"
                        label="Customer Name"
                        value={selectedOffer?.customer_name || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        name="title"
                        label="Title"
                        value={selectedOffer?.title || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        name="description"
                        label="Description"
                        value={selectedOffer?.description || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        name="price"
                        label="Price"
                        value={selectedOffer?.price || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        select
                        label="Currency"
                        name="currency"
                        value={selectedOffer?.currency || ''}
                        onChange={handleChange}
                        fullWidth
                        margin='normal'
                    >
                        <MenuItem value="USD">USD</MenuItem>
                        <MenuItem value="EUR">EUR</MenuItem>
                        <MenuItem value="GBP">GBP</MenuItem>
                    </TextField>
                    <TextField
                        select
                        name="status"
                        label="Status"
                        value={selectedOffer?.status || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="draft">Draft</MenuItem>
                        <MenuItem value="in_progress">In Progress</MenuItem>
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="on_ice">On Ice</MenuItem>
                    </TextField>
                    <TextField
                        name="created_by"
                        label="Created By"
                        value={selectedOffer?.created_by || ''}
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

export default OffersList;