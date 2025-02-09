import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchOfferById, fetchDocuments, fetchComments, updateOfferStatus, uploadDocument, createComment } from '../../../services/api';
import { useRole } from '../../../services/RoleContext';
import { useError } from '../../../services/ErrorContext';
import { Box, Typography, TextField, Button, MenuItem } from '@mui/material';

interface Offers {
    id: number;
    customer_id: number;
    customer_name: string;
    status: string;
    document_count: number;
    comment_count: number;
}

const OfferDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [offer, setOffer] = useState<Offers | null>(null);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const { role } = useRole();
    const { setError } = useError();

    useEffect(() => {
        const getOfferDetails = async () => {
            try {
                if (id) {
                    const offerData = await fetchOfferById(role, id, setError);
                    setOffer(offerData);
                    const docs = await fetchDocuments(role, Number(id), setError);
                    setDocuments(docs);
                    const comms = await fetchComments(role, Number(id), setError);
                    setComments(comms);
                } else {
                    console.error('Error: Offer ID is undefined');
                }
            } catch (error) {
                console.error('Error fetching offer details:', error);
            }
        };

        getOfferDetails();
    }, [id, role, setError]);

    const handleStatusChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (offer) {
            const newStatus = event.target.value;
            try {
                await updateOfferStatus(role, offer.id, newStatus, setError);
                setOffer({ ...offer, status: newStatus });
            } catch (error) {
                console.error('Error updating status:', error);
            }
        }
    };

    const handleUploadDocument = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && offer) {
            const file = event.target.files[0];
            try {
                await uploadDocument(role, offer.id, file, setError);
                const data = await fetchDocuments(role, offer.id, setError);
                setDocuments(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error uploading document:', error);
            }
        }
    };

    const handleAddComment = async () => {
        if (offer && newComment) {
            try {
                await createComment(role, offer.id, role, newComment, setError);
                const data = await fetchComments(role, offer.id, setError);
                setComments(Array.isArray(data) ? data : []);
                setNewComment('');
            } catch (error) {
                console.error('Error adding comment:', error);
            }
        }
    };

    if (!offer) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4">Offer Details</Typography>
            <Typography>Customer ID: {offer.customer_id}</Typography>
            <Typography>Customer Name: {offer.customer_name}</Typography>
            <TextField
                select
                label="Status"
                value={offer.status}
                onChange={handleStatusChange}
                fullWidth
                margin='normal'
            >
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="on_ice">On Ice</MenuItem>
            </TextField>
            <Typography>Document Count: {offer.document_count}</Typography>
            <Typography>Comment Count: {offer.comment_count}</Typography>
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
        </Box>
    );
};

export default OfferDetails;