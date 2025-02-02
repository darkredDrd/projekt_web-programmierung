export function getDocuments(fastify) {
    const statement = fastify.db.prepare("SELECT * FROM documents");

    try {
        const documents = statement.all();
        return documents;
    } catch (err) {
        fastify.log.error(err);
        return null;
    }
}

export function getDocumentById(fastify, id) {
    const statement = fastify.db.prepare("SELECT * FROM documents WHERE id = ?");

    try {
        const document = statement.get(id);
        return document;
    } catch (err) {
        fastify.log.error(err);
        return null;
    }
}

export function createDocument(fastify, documentProps) {
    // Validate the input to ensure required properties are provided
    if (!documentProps.offer_id || !documentProps.filename || !documentProps.file_url) {
        throw new Error('Missing required document properties.');
    }

    // Create the timestamp in the format YYYY-MM-DD HH:MM:SS to avoid problems with SQLite
    const now = new Date();
    const sqliteTimestamp = now.toISOString().replace('T', ' ').split('.')[0];

    const insertIntostatement = fastify.db.prepare(`
        INSERT INTO documents (offer_id, filename, file_url, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
    `);
    const selectStatement = fastify.db.prepare("SELECT * FROM documents WHERE id = ?");

    const documentToCreate = {
        offer_id: documentProps.offer_id,
        filename: documentProps.filename,
        file_url: documentProps.file_url,
        created_at: sqliteTimestamp,
        updated_at: sqliteTimestamp
    };

    try {
        const { offer_id, filename, file_url, created_at, updated_at } = documentToCreate;
        const info = insertIntostatement.run(offer_id, filename, file_url, created_at, updated_at);

        // Check if the insertion was successful
        if (!info.lastInsertRowid) {
            throw new Error('Failed to insert document.');
        }

        // Retrieve the created document by its ID
        const createdDocument = selectStatement.get(info.lastInsertRowid);
        return createdDocument;
    } catch (err) {
        // Log the error for debugging
        fastify.log.error(err);
        throw err; // Rethrow the error for the caller to handle
    }
}

export function updateDocument(id, documentProps) {
    // Create the timestamp in the format YYYY-MM-DD HH:MM:SS to avoid problems with SQLite
    const now = new Date();
    const sqliteTimestamp = now.toISOString().replace('T', ' ').split('.')[0];

    // Build the dynamic SQL query based on provided properties
    const fields = [];
    const values = [];

    if (documentProps.offer_id) {
        fields.push("offer_id = ?");
        values.push(documentProps.offer_id);
    }
    if (documentProps.filename) {
        fields.push("filename = ?");
        values.push(documentProps.filename);
    }
    if (documentProps.file_url) {
        fields.push("file_url = ?");
        values.push(documentProps.file_url);
    }

    // updated_at is always updated
    fields.push("updated_at = ?");
    values.push(sqliteTimestamp);

    // Add the comment ID to the values array
    values.push(id);

    const updateStatement = fastify.db.prepare(`
        UPDATE documents
        SET ${fields.join(", ")}
        WHERE id = ?
    `);
    const selectStatement = fastify.db.prepare("SELECT * FROM documents WHERE id = ?");

    try {
        const info = updateStatement.run(...values);

        if (info.changes === 0) {
            throw new Error(`Document with ID ${id} not found`);
        }

        // Retrieve the updated document by its ID
        const updatedDocument = selectStatement.get(id);
        return updatedDocument;
    } catch (err) {
        // Log the error for debugging
        fastify.log.error(err);
        throw err; // Rethrow the error for the caller to handle
    }
}

export function deleteDocument(fastify, id) {
    const deleteStatement = fastify.db.prepare("DELETE FROM documents WHERE id = ?");
    const selectStatement = fastify.db.prepare("SELECT * FROM documents WHERE id = ?");

    try {
        // Retrieve the document before deleting it
        const documentToDelete = selectStatement.get(id);

        // Delete the document
        const info = deleteStatement.run(id);

        if (info.changes === 0) {
            throw new Error(`Document with ID ${id} not found`);
        }

        return documentToDelete;
    } catch (err) {
        // Log the error for debugging
        fastify.log.error(err);
        throw err; // Rethrow the error for the caller to handle
    }
}