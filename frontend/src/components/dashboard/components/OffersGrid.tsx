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
import { createOffer, fetchOffers, fetchCustomers } from '../../../services/api';
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
}

type Customer = {
    id: number;
    name: string;
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
        created_by: ''
    });
    const [offers, setOffers] = useState<Offers[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const { role } = useRole();
    const { setError } = useError();
    const [expanded, setExpanded] = useState<string | false>('draft');

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

    const handleAdd = async () => {
        try {
            await createOffer(role, newOffers, setError);
            setIsAddModalOpen(false);
            setNewOffers({ customer_id: 0, customer_name: '', title: '', description: '', price: 0, currency: '', status: '', created_by: '' });
            const data = await fetchOffers(role, setError);
            setOffers(data);
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

    return (
        <Box sx={{ width: '100%', maxWith: { sm: '100%', md: '1700px'}, p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography component={'h2'} variant={'h6'} sx={{ flexGrow: 1, textAlign: 'center' }}>
                    Offers
                </Typography>
                <Button variant="contained" color='primary' onClick={() => setIsAddModalOpen(true)} sx={{ ml: 'auto' }}>
                    Add Offer
                </Button>
            </Box>
            <Accordion expanded={expanded === 'draft'} onChange={handleAccordionChange('draft')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Offers on Draft</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <OffersList offers={offers.filter((offer) => offer.status === 'draft')} setOffers={setOffers} />
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'on_ice'} onChange={handleAccordionChange('on_ice')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Offers on Ice</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <OffersList offers={offers.filter((offer) => offer.status === 'on_ice')} setOffers={setOffers} />
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'in_progress'} onChange={handleAccordionChange('in_progress')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Offers in Progress</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <OffersList offers={offers.filter((offer) => offer.status === 'in_progress')} setOffers={setOffers} />
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'active'} onChange={handleAccordionChange('active')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Active Offers</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <OffersList offers={offers.filter((offer) => offer.status === 'active')} setOffers={setOffers} />
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