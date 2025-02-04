import {
    getDocuments,
    getDocumentById,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocumentsByOfferId
} from '../core/documents.js';
import {
    getDocumentsOptions,
    getDocumentOptions,
    createDocumentOptions,
    updateDocumentOptions,
    deleteDocumentOptions,
    getDocumentsByOfferIdOptions,
    getDocumentContentOptions
} from '../schemas/document.schemas.js';
import { checkPermission } from '../authorization.js';
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
 * - POST a new document
 * - PUT (update) a document by ID
 * - DELETE a document by ID
 * - GET all documents for a specific offer
 * - GET the content of a document by URL
 */
async function documentRoutes(fastify, options) {
    fastify.get("/documents", getDocumentsOptions, async (request, reply) => {
        if (!checkPermission(request.role, 'getDocuments')) {
            reply.code(403).send({ error: 'Forbidden' });
            return;
        }

        const { filename, uploaded_by } = request.query;
        const documents = getDocuments(fastify, { filename, uploaded_by });

        if (!documents) {
            reply.code(500);
            return { error: "Could not get documents" };
        }

        reply.code(200);
        return documents;
    });

    fastify.get("/documents/:id", getDocumentOptions, async (request, reply) => {
        if (!checkPermission(request.role, 'getDocumentById')) {
            reply.code(403).send({ error: 'Forbidden' });
            return;
        }

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
        if (!checkPermission(request.role, 'getDocumentsByOfferId')) {
            reply.code(403).send({ error: 'Forbidden' });
            return;
        }

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
        if (!checkPermission(request.role, 'getDocumentContent')) {
            reply.code(403).send({ error: 'Forbidden' });
            return;
        }

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
        if (!checkPermission(request.role, 'createDocument')) {
            reply.code(403).send({ error: 'Forbidden' });
            return;
        }

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
        if (!checkPermission(request.role, 'updateDocument')) {
            reply.code(403).send({ error: 'Forbidden' });
            return;
        }

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
        if (!checkPermission(request.role, 'deleteDocument')) {
            reply.code(403).send({ error: 'Forbidden' });
            return;
        }

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