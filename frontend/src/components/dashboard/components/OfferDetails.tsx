import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchOfferById,
  updateOffer,
  deleteOffer,
  fetchCustomers,
  updateOfferStatus,
  addComment,
  uploadDocument,
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Modal,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import DocumentList from "./DocumentList";
import CommentList from "./CommentList";

type Offer = {
  id: number;
  customer_id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  status: string;
  created_by: string;
};

type Customer = {
  id: number;
  name: string;
};

const OfferDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerName, setCustomerName] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isAddCommentModalOpen, setIsAddCommentModalOpen] = useState(false);
  const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState(false);
  const [newComment, setNewComment] = useState({ author: "", content: "" });
  const [newDocument, setNewDocument] = useState<File | null>(null);
  const [uploadedBy, setUploadedBy] = useState<string>("");
  const { role } = useRole();
  const { setError } = useError();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffer = async () => {
      if (id) {
        try {
          const response = await fetchOfferById(role, id, setError);
          const data = response.offer; 
          setOffer(data);
          if (data.customer_id) {
            const customersData = await fetchCustomers(role, setError);
            setCustomers(customersData);
            const customer = customersData.find(
              (customer: Customer) => customer.id === data.customer_id
            );
            setCustomerName(customer ? customer.name : "Unknown");
          }
        } catch (error) {
          console.error("Error fetching offer:", error);
          setError(String(error));
        }
      }
    };

    fetchOffer();
  }, [id, role, setError]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (offer) {
      try {
        await updateOffer(role, offer.id, offer, setError);
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating offer:", error);
        setError(String(error));
      }
    }
  };

  const handleDelete = async () => {
    if (offer) {
      try {
        await deleteOffer(role, offer.id, setError);
        navigate("/offers");
      } catch (error) {
        console.error("Error deleting offer:", error);
        setError(String(error));
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setOffer((prev) => (prev ? { ...prev, [name as string]: value } : null));

    if (name === "customer_id") {
      const customer = customers.find(
        (customer: Customer) => customer.id === Number(value)
      );
      setCustomerName(customer ? customer.name : "Unknown");
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setOffer((prev) => (prev ? { ...prev, [name as string]: value } : null));
  };

  const handleStatusChange = async (e: SelectChangeEvent<string>) => {
    if (offer) {
      try {
        await updateOfferStatus(
          role,
          offer.id,
          e.target.value as string,
          setError
        );
        setOffer((prev) =>
          prev ? { ...prev, status: e.target.value as string } : null
        );
        setIsStatusDialogOpen(false);
      } catch (error) {
        console.error("Error updating offer status:", error);
        setError(String(error));
      }
    }
  };

  const handleAddComment = async () => {
    if (offer) {
        try {
            await addComment(role, offer.id, newComment.author, newComment.content, setError);
            setIsAddCommentModalOpen(false);
            setNewComment({ author: "", content: "" });
            if (commentListRef.current) {
                commentListRef.current.reloadComments();
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    }
};

const handleAddDocument = async () => {
    if (offer && newDocument) {
        try {
            await uploadDocument(role, offer.id, newDocument, uploadedBy, setError);
            setIsAddDocumentModalOpen(false);
            setNewDocument(null);
            setUploadedBy("");
            if (documentListRef.current) {
                documentListRef.current.reloadDocuments();
            }
        } catch (error) {
            console.error("Error adding document:", error);
        }
    }
};

const documentListRef = useRef<{ reloadDocuments: () => void }>(null);
const commentListRef = useRef<{ reloadComments: () => void }>(null);

if (!offer) {
    return <Typography>Loading...</Typography>;
}

return (
  <Box sx={{ p: 2 }}>
    <Typography variant="h4" component="h1" gutterBottom>
      Offer Details
    </Typography>
    <Paper elevation={3} sx={{ p: 3, maxWidth: "800px", margin: "auto" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", width: "150px" }}
            >
              Offer ID:
            </Typography>
            {isEditing ? (
              <TextField
                name="id"
                value={offer.id}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
            ) : (
              <Typography variant="body1">{offer.id}</Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", width: "150px" }}
            >
              Customer ID:
            </Typography>
            {isEditing ? (
              <FormControl fullWidth margin="normal">
                <InputLabel>Customer</InputLabel>
                <Select
                  name="customer_id"
                  value={offer.customer_id}
                  onChange={
                    handleSelectChange as (
                      e: SelectChangeEvent<number>
                    ) => void
                  }
                >
                  {customers.map((customer) => (
                    <MenuItem key={customer.id} value={customer.id}>
                      {customer.id} - {customer.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Typography variant="body1">{offer.customer_id}</Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", width: "150px" }}
            >
              Customer Name:
            </Typography>
            <Typography variant="body1">{customerName}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", width: "150px" }}
            >
              Title:
            </Typography>
            {isEditing ? (
              <TextField
                name="title"
                value={offer.title}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            ) : (
              <Typography variant="body1">{offer.title}</Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", width: "150px" }}
            >
              Price:
            </Typography>
            {isEditing ? (
              <TextField
                name="price"
                value={offer.price}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            ) : (
              <Typography variant="body1">{offer.price}</Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", width: "150px" }}
            >
              Currency:
            </Typography>
            {isEditing ? (
              <FormControl fullWidth margin="normal">
                <InputLabel>Currency</InputLabel>
                <Select
                  name="currency"
                  value={offer.currency}
                  onChange={handleSelectChange}
                >
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="GBP">GBP</MenuItem>
                </Select>
              </FormControl>
            ) : (
              <Typography variant="body1">{offer.currency}</Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", width: "150px" }}
            >
              Status:
            </Typography>
            <Typography variant="body1">{offer.status}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", width: "150px" }}
            >
              Created By:
            </Typography>
            {isEditing ? (
              <TextField
                name="created_by"
                value={offer.created_by}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            ) : (
              <Typography variant="body1">{offer.created_by}</Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", width: "150px" }}
            >
              Description:
            </Typography>
            {isEditing ? (
              <TextField
                name="description"
                value={offer.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                margin="normal"
              />
            ) : (
              <TextField
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={offer.description}
                InputProps={{
                  readOnly: true,
                }}
              />
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
                : "Current role isn't authorized to edit offer"}
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={role !== "Basic Account-Manager"}
            >
              {role === "Basic Account-Manager"
                ? "Delete"
                : "Current role isn't authorized to delete offer"}
            </Button>
            <Button
              variant="contained"
              onClick={() => setIsStatusDialogOpen(true)}
              sx={{ ml: 2 }}
              disabled={role !== "Basic Account-Manager"}
            >
              {role === "Basic Account-Manager"
                ? "Change Status"
                : "Current role isn't authorized to change status"}
            </Button>
          </>
        )}
      </Box>
    </Paper>
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Documents</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsAddDocumentModalOpen(true)}
          >
            Add Document
          </Button>
        </Box>
        <DocumentList ref={documentListRef} offerId={offer.id} />
      </AccordionDetails>
    </Accordion>
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Comments</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsAddCommentModalOpen(true)}
          >
            Add Comment
          </Button>
        </Box>
        <CommentList ref={commentListRef} offerId={offer.id} />
      </AccordionDetails>
    </Accordion>
    <Dialog
      open={isDeleteDialogOpen}
      onClose={() => setIsDeleteDialogOpen(false)}
    >
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this offer?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
        <Button onClick={handleDelete} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
    <Dialog
      open={isStatusDialogOpen}
      onClose={() => setIsStatusDialogOpen(false)}
    >
      <DialogTitle>Change Status</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select value={offer.status} onChange={handleStatusChange}>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="on_ice">On Ice</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsStatusDialogOpen(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
    <Modal
      open={isAddCommentModalOpen}
      onClose={() => setIsAddCommentModalOpen(false)}
    >
      <Box sx={{ ...modalStyle }}>
        <Typography variant="h6" component="h2">
          Add Comment
        </Typography>
        <TextField
          label="Author"
          name="author"
          value={newComment.author}
          onChange={(e) =>
            setNewComment({ ...newComment, author: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Content"
          name="content"
          value={newComment.content}
          onChange={(e) =>
            setNewComment({ ...newComment, content: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            onClick={() => setIsAddCommentModalOpen(false)}
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAddComment}>
            Add
          </Button>
        </Box>
      </Box>
    </Modal>
    <Modal
      open={isAddDocumentModalOpen}
      onClose={() => setIsAddDocumentModalOpen(false)}
    >
      <Box sx={{ ...modalStyle }}>
        <Typography variant="h6" component="h2">
          Add Document
        </Typography>
        <TextField
          label="Uploaded By"
          name="uploaded_by"
          value={uploadedBy}
          onChange={(e) => setUploadedBy(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
          Upload File
          <input
            type="file"
            hidden
            onChange={(e) =>
              setNewDocument(e.target.files ? e.target.files[0] : null)
            }
          />
        </Button>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            onClick={() => setIsAddDocumentModalOpen(false)}
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAddDocument}>
            Add
          </Button>
        </Box>
      </Box>
    </Modal>
  </Box>
);
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default OfferDetails;
