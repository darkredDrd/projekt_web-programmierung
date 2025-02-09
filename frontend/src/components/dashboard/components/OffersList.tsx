import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { updateOffer, fetchOffers, fetchDocumentsCount, fetchCommentsCount, fetchDocuments } from '../../../services/api';
import { useRole } from '../../../services/RoleContext';
import { useError } from '../../../services/ErrorContext';
import { IconButton, Modal, Box, TextField, Button, Typography, MenuItem, List, ListItem, } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

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

type OffersListProps = {
    offers: Offers[];
    setOffers: React.Dispatch<React.SetStateAction<Offers[]>>;
};

const OffersList: React.FC<OffersListProps> = ({ offers, setOffers }) => {
    const navigate = useNavigate();
    const [selectedOffer, setSelectedOffer] = useState<Offers | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { role } = useRole();
    const { setError } = useError();
    const [documents, setDocuments] = useState([]);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

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

    const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setSelectedOffer((prev) => (prev ? { ...prev, status: value } : null));
    }

    const handleUploadDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // Implement document upload logic here
    }

    const handleAddComment = async () => {
        // Implement add comment logic here
    }

    const handleCloseDetailModal = () => {
        setIsEditModalOpen(false);
        setSelectedOffer(null);
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
            {selectedOffer && (
                <Modal open={!!selectedOffer} onClose={handleCloseDetailModal}>
                    <Box sx={{ ...modalStyle }}>
                        <Typography variant="h6" component="h2">
                            Offer Details
                        </Typography>
                        <Typography>Customer ID: {selectedOffer.customer_id}</Typography>
                        <Typography>Customer Name: {selectedOffer.customer_name}</Typography>
                        <TextField
                            select
                            label="Status"
                            value={selectedOffer.status}
                            onChange={handleStatusChange}
                            fullWidth
                            margin='normal'
                        >
                            <MenuItem value="draft">Draft</MenuItem>
                            <MenuItem value="in_progress">In Progress</MenuItem>
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="on_ice">On Ice</MenuItem>
                        </TextField>
                        <Typography>Document Count: {selectedOffer.documentsCount}</Typography>
                        <Typography>Comment Count: {selectedOffer.commentsCount}</Typography>
                        <Box>
                            <Typography variant="h6">Documents</Typography>
                            <input type="file" onChange={handleUploadDocument} />
                            <ul>
                                {Array.isArray(documents) && documents.map((doc) => (
                                    <li key={doc.id}><a href={doc.file_url} target="_blank" rel="noopener noreferrer">{doc.filename}</a></li>
                                ))}
                            </ul>
                        </Box>
                        <Box>
                            <Typography variant="h6">Comments</Typography>
                            <TextField
                                label="Add Comment"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                fullWidth
                                margin='normal'
                            />
                            <Button onClick={handleAddComment} variant="contained">Add Comment</Button>
                            <ul>
                                {Array.isArray(comments) && comments.map((comment) => (
                                    <li key={comment.id}>{comment.content} - <i>{comment.author}</i></li>
                                ))}
                            </ul>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button onClick={handleCloseDetailModal} sx={{ mr: 2 }}>
                                Close
                            </Button>
                            <Button variant="contained" onClick={handleSave}>
                                Save
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            )}
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