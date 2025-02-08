import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { updateOffer, fetchOffers, fetchDocumentsCount, fetchCommentsCount, fetchDocuments } from '../../../services/api';
import { useRole } from '../../../services/RoleContext';
import { useError } from '../../../services/ErrorContext';
import { IconButton, Modal, Box, TextField, Button, Typography, MenuItem, List, ListItem, ListItemText } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

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
    documentsCount?: number;
    commentsCount?: number;
}

type Document = {
    id: number;
    name: string;
    url: string;
}

type OffersListProps = {
    offers: Offers[];
    setOffers: React.Dispatch<React.SetStateAction<Offers[]>>;
};

const OffersList: React.FC<OffersListProps> = ({ offers, setOffers }) => {
    const [selectedOffer, setSelectedOffer] = useState<Offers | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [documents, setDocuments] = useState<Document[]>([]);
    const { role } = useRole();
    const { setError } = useError();

    useEffect(() => {
        const fetchInitialOffers = async () => {
            try {
                const data = await fetchOffers(role, setError);
                const updatedOffers = await Promise.all(data.map(async (offer: Offers) => {
                    const documentsCount = await fetchDocumentsCount(role, offer.id, setError);
                    const commentsCount = await fetchCommentsCount(role, offer.id, setError);
                    return { ...offer, documentsCount, commentsCount };
                }));
                setOffers(updatedOffers);
            } catch (error) {
                console.error('Error fetching offers:', error);
                setError(String(error));
            }
        };

        fetchInitialOffers();
    }, [role, setError, setOffers]);

    const handleInspect = async (offer: Offers) => {
        setSelectedOffer(offer);
        setIsEditModalOpen(true);
        
    };

    const handleSave = async () => {
        if (selectedOffer) {
            try {
                await updateOffer(role, selectedOffer.id, selectedOffer, setError);
                setIsEditModalOpen(false);
                setSelectedOffer(null);
                // Fetch offers again to update the list
                const data = await fetchOffers(role, setError);
                const updatedOffers = await Promise.all(data.map(async (offer: Offers) => {
                    const documentsCount = await fetchDocumentsCount(role, offer.id, setError);
                    const commentsCount = await fetchCommentsCount(role, offer.id, setError);
                    return { ...offer, documentsCount, commentsCount };
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
        { field: 'documentsCount', headerName: 'Documents', flex: 1 },
        { field: 'commentsCount', headerName: 'Comments', flex: 1 },
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
                <Box sx={{ ...modalStyle, width: '80%', height: '80%' }}>
                    <Typography variant="h6" component="h2">
                        Inspect Offer
                    </Typography>
                    <TextField
                        name="id"
                        label="Offer ID"
                        value={selectedOffer?.id || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        name="customer_name"
                        label="Customer Name"
                        value={selectedOffer?.customer_name || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        name="title"
                        label="Title"
                        value={selectedOffer?.title || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        name="status"
                        label="Status"
                        value={selectedOffer?.status || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        name="documentsCount"
                        label="Documents"
                        value={selectedOffer?.documentsCount || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        name="commentsCount"
                        label="Comments"
                        value={selectedOffer?.commentsCount || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputProps={{ readOnly: true }}
                    />
                    <Typography variant="h6" component="h3" sx={{ mt: 2 }}>
                        Documents
                    </Typography>
                    <List>
                        {documents.map((doc) => (
                            <ListItem key={doc.id}>
                                <ListItemText primary={doc.name} secondary={doc.url} />
                            </ListItem>
                        ))}
                    </List>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button onClick={() => setIsEditModalOpen(false)} sx={{ mr: 2 }}>
                            Close
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

export default OffersList;