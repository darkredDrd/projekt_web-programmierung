import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useRole } from '../../../services/RoleContext';
import { useError } from '../../../services/ErrorContext';
import { createOffer, fetchOffers, fetchCustomers, fetchDocuments, uploadDocument, fetchComments, addComment, updateOfferStatus } from '../../../services/api';
import OffersList from './OffersList';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

type Customer = {
    id: number;
    name: string;
}

type Document = {
    id: number;
    filename: string;
    file_url: string;
}

type Comment = {
    id: number;
    author: string;
    content: string;
    created_at: string;
}

export default function OffersGrid() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newOffers, setNewOffers] = useState<Omit<Offers, 'id' | 'created_at' | 'updated_at'>>({
        customer_id: 0,
        customer_name: '',
        title: '',
        description: '',
        price: 0,
        currency: '',
        status: '',
        created_by: '',
        document_count: 0,
        comment_count: 0
    });
    const [offers, setOffers] = useState<Offers[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const { role } = useRole();
    const { setError } = useError();
    const [expanded, setExpanded] = useState<string | false>('draft');
    const [selectedOffer, setSelectedOffer] = useState<Offers | null>(null);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const getOffers = async () => {
            try {
                const data = await fetchOffers(role, setError);
                setOffers(data);
            } catch (error) {
                console.error('Error fetching offers:', error);
            }
        };
        const getCustomers = async () => {
            try {
                const data = await fetchCustomers(role, setError);
                setCustomers(data);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };

        getOffers();
        getCustomers();
    }, [role, setError]);

    useEffect(() => {
        if (selectedOffer) {
            const getDocuments = async () => {
                try {
                    const data = await fetchDocuments(role, selectedOffer.id, setError);
                    setDocuments(Array.isArray(data) ? data : []);
                } catch (error) {
                    console.error('Error fetching documents:', error);
                }
            };

            const getComments = async () => {
                try {
                    const data = await fetchComments(role, selectedOffer.id, setError);
                    setComments(Array.isArray(data) ? data : []);
                } catch (error) {
                    console.error('Error fetching comments:', error);
                }
            };

            getDocuments();
            getComments();
        }
    }, [selectedOffer, role, setError]);

    const handleAdd = async () => {
        try {
            await createOffer(role, newOffers, setError);
            setIsAddModalOpen(false);
            setNewOffers({ customer_id: 0, customer_name: '', title: '', description: '', price: 0, currency: '', status: '', created_by: '', document_count: 0, comment_count: 0 });
            const data = await fetchOffers(role, setError);
            setOffers(data);
            const newOffer = data.find((offer: Offers) => offer.title === newOffers.title && offer.description === newOffers.description);
            if (newOffer) {
                setSelectedOffer(newOffer);
            }
        } catch (error) {
            console.error('Error creating offer:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewOffers((prev) => ({ ...prev, [name]: value }));
    };

    const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleCloseDetailModal = () => {
        setSelectedOffer(null);
    };
    
    const handleUploadDocument = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (selectedOffer && event.target.files && event.target.files[0]) {
            const newDocument = event.target.files[0];
            try {
                await uploadDocument(role, selectedOffer.id, newDocument, selectedOffer.created_by, setError);
                const updatedDocuments = await fetchDocuments(role, selectedOffer.id, setError);
                setDocuments(Array.isArray(updatedDocuments) ? updatedDocuments : []);
            } catch (error) {
                console.error('Error adding document:', error);
            }
        }
    };

    const handleAddComment = async () => {
        if (selectedOffer && newComment) {
            try {
                await addComment(role, selectedOffer.id, role, newComment, setError);
                const data = await fetchComments(role, selectedOffer.id, setError);
                setComments(Array.isArray(data) ? data : []);
                setNewComment('');
            } catch (error) {
                console.error('Error adding comment:', error);
            }
        }
    };

    const handleStatusChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (selectedOffer) {
            const newStatus = event.target.value;
            try {
                await updateOfferStatus(role, selectedOffer.id, newStatus, setError);
                setSelectedOffer({ ...selectedOffer, status: newStatus });
            } catch (error) {
                console.error('Error updating status:', error);
            }
        }
    };

    return (
        <Box sx={{ width: '100%', maxWith: { sm: '100%', md: '1700px'}, p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography component={'h2'} variant={'h6'} sx={{ flexGrow: 1, textAlign: 'center' }}>
                    Offers
                </Typography>
                <Button
                    variant="contained"
                    color='primary'
                    onClick={() => setIsAddModalOpen(true)}
                    sx={{ ml: 'auto' }}
                    disabled={role !== 'Basic Account-Manager'}
                >
                    {role === 'Basic Account-Manager' ? 'Add Offer' : 'Current role isn\'t authorized to add offer'}
                </Button>
            </Box>
            <Accordion expanded={expanded === 'draft'} onChange={handleAccordionChange('draft')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Offers on Draft</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <OffersList offers={offers.filter((offer: Offers) => offer.status === 'draft')} setOffers={setOffers} />
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'on_ice'} onChange={handleAccordionChange('on_ice')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Offers on Ice</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <OffersList offers={offers.filter((offer: Offers) => offer.status === 'on_ice')} setOffers={setOffers} />
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'in_progress'} onChange={handleAccordionChange('in_progress')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Offers in Progress</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <OffersList offers={offers.filter((offer: Offers) => offer.status === 'in_progress')} setOffers={setOffers} />
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'active'} onChange={handleAccordionChange('active')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Active Offers</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <OffersList offers={offers.filter((offer: Offers) => offer.status === 'active')} setOffers={setOffers} />
                </AccordionDetails>
            </Accordion>
            <Modal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                <Box sx={{ ...modalStyle }}>  
                    <Typography variant="h6" component="h2">
                        Add Offer  
                    </Typography>
                    <TextField
                        label="Customer ID"
                        name="customer_id"
                        value={newOffers.customer_id}
                        onChange={handleChange}
                        fullWidth
                        margin='normal'
                    />
                    <TextField
                        select
                        label="Select Existing Customer"
                        name="customer_id"
                        value={newOffers.customer_id}
                        onChange={handleChange}
                        fullWidth
                        margin='normal'
                    >
                        {customers.map((customer) => (
                            <MenuItem key={customer.id} value={customer.id}>
                                {customer.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Title"
                        name="title"
                        value={newOffers.title}
                        onChange={handleChange}
                        fullWidth
                        margin='normal'
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={newOffers.description}
                        onChange={handleChange}
                        fullWidth
                        margin='normal'
                    />
                    <TextField
                        label="Price"
                        name="price"
                        value={newOffers.price}
                        onChange={handleChange}
                        fullWidth
                        margin='normal'
                    />
                    <TextField
                        select 
                        label="Currency"
                        name="currency"
                        value={newOffers.currency}
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
                        value={newOffers?.status || ''}
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
                        label="Created By"
                        name="created_by"
                        value={newOffers.created_by}
                        onChange={handleChange}
                        fullWidth
                        margin='normal'
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
                        <Typography>Document Count: {selectedOffer.document_count}</Typography>
                        <Typography>Comment Count: {selectedOffer.comment_count}</Typography>
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
                        </Box>
                    </Box>
                </Modal>
            )}
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
