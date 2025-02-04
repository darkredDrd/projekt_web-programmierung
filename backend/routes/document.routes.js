import {
    getDocuments,
    getDocumentById,
    getDocumentsByOfferId,
    createDocument,
    updateDocument,
    deleteDocument
} from '../core/documents.js';
import {
    getDocumentsOptions,
    getDocumentOptions,
    getDocumentsByOfferIdOptions,
    getDocumentContentOptions,
    createDocumentOptions,
    updateDocumentOptions,
    deleteDocumentOptions
} from '../schemas/document.schemas.js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __filename and __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Includes the routes for the '/documents' API endpoint.
 * 
 * With this route the user can:
 * - GET all documents
 * - GET a single document by ID
 * - GET all documents for a specific offer
 * - GET the content of a document by URL
 * - POST a new document
 * - PUT (update) a document by ID
 * - DELETE a document by ID
 */
async function documentRoutes(fastify, options) {
    fastify.get("/documents", getDocumentsOptions, async (request, reply) => {
        const documents = getDocuments(fastify);

        if (!documents) {
            reply.code(500);
            return { error: "Could not get documents" };
        }

        reply.code(200);
        return documents;
    });

    fastify.get("/documents/:id", getDocumentOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);

        const document = getDocumentById(fastify, id);
        if (!document) {
            reply.code(400);
            return { error: `Document with ID ${id} not found` };
        }

        reply.code(200);
        return { document: document };
    });

    fastify.get("/offers/:offerId/documents", getDocumentsByOfferIdOptions, async (request, reply) => {
        const offerId = parseInt(request.params.offerId, 10);

        const documents = getDocumentsByOfferId(fastify, offerId);
        if (!documents) {
            reply.code(500);
            return { error: `Could not get documents for offer with ID ${offerId}` };
        }

        reply.code(200);
        return { documents: documents };
    });

    fastify.get("/documents/content/:fileId", getDocumentContentOptions, async (request, reply) => {
        const fileId = parseInt(request.params.fileId, 10);

        // Fetch the document from the database to get the file URL
        const document = getDocumentById(fastify, fileId);
        if (!document) {
            reply.code(404).send({ error: `Document with ID ${fileId} not found` });
            return;
        }

        const filePath = path.join(__dirname, '..', document.file_url);

        try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            reply.code(200).send(fileContent);
        } catch (err) {
            fastify.log.error(err);
            reply.code(404).send({ error: `File with ID ${fileId} not found` });
        }
    });

    fastify.post("/documents", createDocumentOptions, async (request, reply) => {
        const data = await request.file();
        const { offer_id, uploaded_by } = request.headers;
        const file = data;

        const documentProps = { offer_id, uploaded_by };

        try {
            const document = await createDocument(fastify, documentProps, file);

            if (!document) {
                reply.code(500);
                return { error: "Could not create document" };
            }

            reply.code(201);
            return { document: document };
        } catch (err) {
            reply.code(400);
            return { error: err.message };
        }
    });

    fastify.put("/documents/:id", updateDocumentOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const data = await request.file();
        const { uploaded_by } = request.headers;
        const file = data;

        const documentProps = { uploaded_by };

        try {
            const document = await updateDocument(fastify, id, documentProps, file);

            if (!document) {
                reply.code(400);
                return { error: `Document with ID ${id} not found` };
            }

            reply.code(200);
            return { document: document };
        } catch (err) {
            reply.code(400);
            return { error: err.message };
        }
    });

    fastify.delete("/documents/:id", deleteDocumentOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);

        const document = deleteDocument(fastify, id);

        if (!document) {
            reply.code(400);
            return { error: `Document with ID ${id} not found` };
        }

        reply.code(200);
        return { message: `Document with ID ${id} successfully deleted` };
    });
}

export { documentRoutes };