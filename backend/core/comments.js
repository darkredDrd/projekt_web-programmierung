export function getComents(fastify) {
    const statement = fastify.db.prepare("SELECT * FROM comments");

    try {
        const comments = statement.all();
        return comments;
    } catch (err) {
        fastify.log.error(err);
        return null;
    }
}

export function getCommentById(fastify, id) {
    const statement = fastify.db.prepare("SELECT * FROM comments WHERE id = ?");

    try {
        const comment = statement.get(id);
        return comment;
    } catch (err) {
        fastify.log.error(err);
        return null;
    }
}

export function createComment(fastify, commentProps) {
    // Validate the input to ensure required properties are provided
    if (!commentProps.offer_id || !commentProps.author || !commentProps.content) {
        throw new Error('Missing required comment properties.');
    }

    // Create the timestamp in the format YYYY-MM-DD HH:MM:SS to avoid problems with SQLite
    const now = new Date();
    const sqliteTimestamp = now.toISOString().replace('T', ' ').split('.')[0];

    const insertIntostatement = fastify.db.prepare(`
        INSERT INTO comments (offer_id, author, content, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
    `);
    const selectStatement = fastify.db.prepare("SELECT * FROM comments WHERE id = ?");

    const commentToCreate = {
        offer_id: commentProps.offer_id,
        author: commentProps.author,
        content: commentProps.content,
        created_at: sqliteTimestamp,
        updated_at: sqliteTimestamp
    };

    try {
        const { offer_id, author, content, created_at, updated_at } = commentToCreate;
        const info = insertIntostatement.run(offer_id, author, content, created_at, updated_at);

        // Check if the insertion was successful
        if (!info.lastInsertRowid) {
            throw new Error('Failed to insert comment.');
        }

        // Retrieve the created comment by its ID
        const createdComment = selectStatement.get(info.lastInsertRowid);
        return createdComment;
    } catch (err) {
        // Log the error for debugging
        fastify.log.error(err);
        throw err; // Rethrow the error for the caller to handle
    }
}

export function updateComment(fastify, id, commentProps) {
    // Create the timestamp in the format YYYY-MM-DD HH:MM:SS to avoid problems with SQLite
    const now = new Date();
    const sqliteTimestamp = now.toISOString().replace('T', ' ').split('.')[0];

    // Build the dynamic SQL query based on provided properties
    const fields = [];
    const values = [];

    if (commentProps.offer_id) {
        fields.push("offer_id = ?");
        values.push(commentProps.offer_id);
    }
    if (commentProps.author) {
        fields.push("author = ?");
        values.push(commentProps.author);
    }
    if (commentProps.content) {
        fields.push("content = ?");
        values.push(commentProps.content);
    }

    // updated_at is always updated
    fields.push("updated_at = ?");
    values.push(sqliteTimestamp);

    // Add the comment ID to the values array
    values.push(id);

    const updateStatement = fastify.db.prepare(`
        UPDATE comments
        SET ${fields.join(", ")}
        WHERE id = ?
    `);
    const selectStatement = fastify.db.prepare("SELECT * FROM comments WHERE id = ?");

    try {
        const info = updateStatement.run(...values);

        if (info.changes === 0) {
            throw new Error(`Comment with ID ${id} not found`);
        }

        // Retrieve the updated comment by its ID
        const updatedComment = selectStatement.get(id);
        return updatedComment;
    } catch (err) {
        // Log the error for debugging
        fastify.log.error(err);
        throw err; // Rethrow the error for the caller to handle
    }
}

export function deleteComment(fastify, id) {
    const deleteStatement = fastify.db.prepare("DELETE FROM comments WHERE id = ?");
    const selectStatement = fastify.db.prepare("SELECT * FROM comments WHERE id = ?");

    try {
        // Retrieve the comment before deleting it
        const commentToDelete = selectStatement.get(id);

        // Delete the comment
        const info = deleteStatement.run(id);

        if (info.changes === 0) {
            throw new Error(`Comment with ID ${id} not found`);
        }

        return commentToDelete;
    } catch (err) {
        // Log the error for debugging
        fastify.log.error(err);
        throw err; // Rethrow the error for the caller to handle
    }
}