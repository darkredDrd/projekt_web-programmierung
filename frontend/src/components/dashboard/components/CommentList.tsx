import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { fetchComments, deleteComment, updateComment } from '../../../services/api';
import { useRole } from '../../../services/RoleContext';
import { useError } from '../../../services/ErrorContext';
import { IconButton, Modal, Box, TextField, Button, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

type Comment = {
    id: number;
    author: string;
    content: string;
    offer_id: number;
    created_at: string;
    updated_at: string;
};

type CommentListProps = {
    offerId: number;
};

const CommentList = forwardRef<{ reloadComments: () => void }, CommentListProps>(({ offerId }, ref) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { role } = useRole();
    const { setError } = useError();

    useImperativeHandle(ref, () => ({
        reloadComments: getComments
    }));

    const getComments = async () => {
        try {
            const data = await fetchComments(role, offerId, setError);
            setComments(data.comments); 
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    useEffect(() => {
        getComments();
    }, [role, offerId, setError]);

    const handleEdit = (comment: Comment) => {
        setSelectedComment(comment);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (comment: Comment) => {
        if (window.confirm(`Do you really want to delete Comment ${comment.id}?`)) {
            try {
                await deleteComment(role, offerId, comment.id, setError);
                setComments(comments.filter((c) => c.id !== comment.id));
            } catch (error) {
                console.error('Error deleting comment:', error);
            }
        }
    };

    const handleSave = async () => {
        if (selectedComment) {
            try {
                await updateComment(role, offerId, selectedComment.id, { author: selectedComment.author, content: selectedComment.content }, setError);
                const updatedComments = await fetchComments(role, offerId, setError);
                setComments(updatedComments.comments); // Adjust to match the response structure
                setIsEditModalOpen(false);
            } catch (error) {
                console.error('Error updating comment:', error);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSelectedComment((prev) => (prev ? { ...prev, [name]: value } : null));
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', flex: 1 },
        { field: 'author', headerName: 'Author', flex: 1 },
        { field: 'content', headerName: 'Content', flex: 2 },
        { field: 'created_at', headerName: 'Created At', flex: 1 },
        { field: 'updated_at', headerName: 'Updated At', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            renderCell: (params) => (
                <>
                    <IconButton onClick={() => handleEdit(params.row as Comment)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(params.row as Comment)}>
                        <DeleteIcon />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <div style={{ height: 600, width: '100%' }}>
            <DataGrid rows={comments} columns={columns} pagination pageSizeOptions={[10]} getRowId={(row) => row.id} />
            <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                <Box sx={{ ...modalStyle }}>
                    <Typography variant="h6" component="h2">
                        Edit Comment
                    </Typography>
                    <TextField
                        label="Author"
                        name="author"
                        value={selectedComment?.author || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Content"
                        name="content"
                        value={selectedComment?.content || ''}
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
});

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

export default CommentList;