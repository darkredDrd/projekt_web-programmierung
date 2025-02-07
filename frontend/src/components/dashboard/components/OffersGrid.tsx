import * as React from 'react';
import { useState, useEffect } from 'react';
// import Grid from '@mui/material/Grid';
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
    title: string;
    description: string;
    price: number;
    currency: string;
    status: string;
    created_by: string;
    created_at: string;
    updated_at: string;
}
//neu
type Customer = {
    id: number;
    name: string;
}

export default function MainGrid() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newOffers, setNewOffers] = useState<Omit<Offers, 'id' | 'created_at' | 'updated_at'>>({
        customer_id: 0,
        title: '',
        description: '',
        price: 0,
        currency: '',
        status: '',
        created_by: ''
    });
    const [offers, setOffers] = useState<Offers[]>([]);
    const [expiredOffers, setExpiredOffers] = useState<Offers[]>([]);//neu
    const [inProgressOffers, setInProgressOffers] = useState<Offers[]>([]);
    const [activeOffers, setActiveOffers] = useState<Offers[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]); //neu
    const { role } = useRole();
    const { setError } = useError();

    useEffect(() => {
        const getOffers = async () => {
            try {
                const data = await fetchOffers(role, setError);
                setOffers(data.filter((offer: Offers) => offer.status !== 'on_ice' && offer.status !== 'in_progress' && offer.status !== 'active'));
                setExpiredOffers(data.filter((offer: Offers) => offer.status === 'on_ice'));
                setInProgressOffers(data.filter((offer: Offers) => offer.status === 'in_progress'));
                setActiveOffers(data.filter((offer: Offers) => offer.status === 'active'));
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
        };//neu

        getOffers();
        getCustomers(); //neu
    }, [role, setError]);

    
    const handleAdd = async () => {
        try {
            await createOffer(role, newOffers, setError);
            setIsAddModalOpen(false);
            setNewOffers({ customer_id: 0, title: '', description: '', price: 0, currency: '', status: '', created_by: '' }); // Reset new customer fields
            // Fetch Offers again to update the list
            const data = await fetchOffers(role, setError);
            setOffers(data.filter((offer: Offers) => offer.status !== 'on_ice'));
            setExpiredOffers(data.filter((offer: Offers) => offer.status === 'on_ice'));
        } catch (error) {
            console.error('Error creating offer:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewOffers((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <Box sx={{ width: '100%', maxWith: { sm: '100%', md: '1700px'}, p: 2 }}>
            <Typography component={'h2'} variant={'h6'} sx={{ mb: 2 }}>
                Offers
            </Typography>
            <OffersList offers={offers} setOffers={setOffers} expiredOffers={expiredOffers} setExpiredOffers={setExpiredOffers} />
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Offers on ice</Typography>
                </AccordionSummary>
                <AccordionDetails>
            <OffersList offers={expiredOffers} setOffers={setOffers} expiredOffers={expiredOffers} setExpiredOffers={setExpiredOffers} />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Offers in Progress</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <OffersList offers={inProgressOffers} setOffers={setOffers} expiredOffers={expiredOffers} setExpiredOffers={setExpiredOffers} />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Active Offers</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <OffersList offers={activeOffers} setOffers={setOffers} expiredOffers={expiredOffers} setExpiredOffers={setExpiredOffers} />
                </AccordionDetails>
            </Accordion>
            <Button variant="contained" color='primary' onClick={() => setIsAddModalOpen(true)} sx={{ mt: 2 }}>
                Add Offer
            </Button>
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
                    </TextField>//neu
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

           