import {
    getDocuments,
    getDocumentById,
    createDocument,
    updateDocument,
    deleteDocument
} from '../core/documents.js';
import {
    getDocumentsOptions,
    getDocumentOptions,
    createDocumentOptions,
    updateDocumentOptions,
    deleteDocumentOptions
} from '../schemas/document.schemas.js';

/**
 * Includes the routes for the '/documents' API endpoint.
 * 
 * With this route the user can:
 * - GET all documents
 * - GET a single document by ID
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

    fastify.post("/documents", createDocumentOptions, async (request, reply) => {
        const documentProps = request.body;

        const document = createDocument(fastify, documentProps);

        if (!document) {
            reply.code(500);
            return { error: "Could not create document" };
        }

        reply.code(201);
        return { document: document };
    });

    fastify.put("/documents/:id", updateDocumentOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const documentProps = request.body;

        const document = updateDocument(fastify, id, documentProps);

        if (!document) {
            reply.code(500);
            return { error: `Could not update document with ID ${id}` };
        }

        reply.code(200);
        return { document: document };
    });

    fastify.delete("/documents/:id", deleteDocumentOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);

        const document = deleteDocument(fastify, id);

        if (!document) {
            reply.code(400);
            return { error: `Document with ID ${id} not found` };
        }

        reply.code(200);
        return { document: document };
    });
};

export { documentRoutes };