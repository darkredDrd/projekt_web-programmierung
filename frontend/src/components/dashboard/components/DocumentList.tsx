import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { fetchDocuments, deleteDocument, updateDocument } from '../../../services/api';
import { useRole } from '../../../services/RoleContext';
import { useError } from '../../../services/ErrorContext';
import { IconButton, Modal, Box, TextField, Button, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

type Document = {
    id: number;
    filename: string;
    file_url: string;
    uploaded_by: string;
};

type DocumentListProps = {
    offerId: number;
};

const DocumentList = forwardRef<{ reloadDocuments: () => void }, DocumentListProps>(({ offerId }, ref) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const { role } = useRole();
    const { setError } = useError();

    useImperativeHandle(ref, () => ({
        reloadDocuments: getDocuments
    }));

    const getDocuments = async () => {
        try {
            const data = await fetchDocuments(role, offerId, setError);
            setDocuments(data.documents); 
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    useEffect(() => {
        getDocuments();
    }, [role, offerId, setError]);

    const handleEdit = (document: Document) => {
        setSelectedDocument(document);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (document: Document) => {
        if (window.confirm(`Do you really want to delete Document ${document.id}?`)) {
            try {
                await deleteDocument(role, offerId, document.id, setError);
                setDocuments(documents.filter((d) => d.id !== document.id));
            } catch (error) {
                console.error('Error deleting document:', error);
            }
        }
    };

    const handleSave = async () => {
        if (selectedDocument) {
            try {
                const updateData: { uploaded_by: string; file?: File } = {
                    uploaded_by: selectedDocument.uploaded_by,
                };
                if (file) {
                    updateData.file = file;
                }
                await updateDocument(role, offerId, selectedDocument.id, updateData, setError);
                const updatedDocuments = await fetchDocuments(role, offerId, setError);
                setDocuments(updatedDocuments.documents); 
                setIsEditModalOpen(false);
                setFile(null); 
            } catch (error) {
                console.error('Error updating document:', error);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSelectedDocument((prev) => (prev ? { ...prev, [name]: value } : null));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', flex: 1 },
        { field: 'filename', headerName: 'Filename', flex: 1 },
        { field: 'uploaded_by', headerName: 'Uploaded By', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            renderCell: (params) => (
                <>
                    <IconButton onClick={() => handleEdit(params.row as Document)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(params.row as Document)}>
                        <DeleteIcon />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <div style={{ height: 600, width: '100%' }}>
            <DataGrid rows={documents} columns={columns} pagination pageSizeOptions={[10]} getRowId={(row) => row.id} />
            <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                <Box sx={{ ...modalStyle }}>
                    <Typography variant="h6" component="h2">
                        Edit Document
                    </Typography>
                    <TextField
                        label="Uploaded By"
                        name="uploaded_by"
                        value={selectedDocument?.uploaded_by || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
                        Upload File
                        <input type="file" hidden onChange={handleFileChange} />
                    </Button>
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

export default DocumentList;