export function getComments(fastify, filters = {}) {
    let query = "SELECT * FROM comments WHERE 1=1";
    const params = [];

    if (filters.author) {
        query += " AND author LIKE ?";
        params.push(`%${filters.author}%`);
    }

    if (filters.content) {
        query += " AND content LIKE ?";
        params.push(`%${filters.content}%`);
    }

    const statement = fastify.db.prepare(query);

    try {
        const comments = statement.all(...params);
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

export function getCommentsByOfferId(fastify, offerId) {
    const statement = fastify.db.prepare(`
        SELECT * FROM comments
        WHERE offer_id = ?
    `);

    try {
        const comments = statement.all(offerId);
        return comments;
    } catch (err) {
        fastify.log.error(err);
        return null;
    }
}

async function getOfferStatus(fastify, offerId) {
    const statement = fastify.db.prepare("SELECT status FROM offers WHERE id = ?");
    try {
        const offer = statement.get(offerId);
        return offer ? offer.status : null;
    } catch (err) {
        fastify.log.error(err);
        throw err;
    }
}

export async function createComment(fastify, commentProps) {
    if (!commentProps.offer_id || !commentProps.author || !commentProps.content) {
        throw new Error('Missing required comment properties.');
    }

    const offerStatus = await getOfferStatus(fastify, commentProps.offer_id);
    if (offerStatus === 'Draft') {
        throw new Error('Cannot add comments to an offer in Draft status.');
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

        if (!info.lastInsertRowid) {
            throw new Error('Failed to insert comment.');
        }

        return selectStatement.get(info.lastInsertRowid);
    } catch (err) {
        fastify.log.error(err);
        throw err;
    }
}

export function updateComment(fastify, id, commentProps) {
    // Create the timestamp in the format YYYY-MM-DD HH:MM:SS to avoid problems with SQLite
    const now = new Date();
    const sqliteTimestamp = now.toISOString().replace('T', ' ').split('.')[0];

    // Dynamically build the SQL Query based on the provided properties
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

    fields.push("updated_at = ?");
    values.push(sqliteTimestamp);

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

        const updatedComment = selectStatement.get(id);
        return updatedComment;
    } catch (err) {
        fastify.log.error(err);
        throw err; 
    }
}

export function deleteComment(fastify, id) {
    const deleteStatement = fastify.db.prepare("DELETE FROM comments WHERE id = ?");
    const selectStatement = fastify.db.prepare("SELECT * FROM comments WHERE id = ?");

    try {
        const commentToDelete = selectStatement.get(id);

        const info = deleteStatement.run(id);

        if (info.changes === 0) {
            throw new Error(`Comment with ID ${id} not found`);
        }

        return commentToDelete;
    } catch (err) {
        fastify.log.error(err);
        throw err; 
    }
}