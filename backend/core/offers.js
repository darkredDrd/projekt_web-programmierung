export function getOffers(fastify) {
    const statement = fastify.db.prepare("SELECT * FROM offers");

    try {
        const offers = statement.all();
        return offers;
    } catch (err) {
        fastify.log.error(err);
        return null;
    }
}

export function getOfferById(fastify, id) {
    const statement = fastify.db.prepare("SELECT * FROM offers WHERE id = ?");

    try {
        const offer = statement.get(id);
        return offer;
    } catch (err) {
        fastify.log.error(err);
        return null;
    }
}

export function createOffer(fastify, offerProps) {
    // Validate the input to ensure required properties are provided
    if (!offerProps.customer_id || !offerProps.title || !offerProps.description || !offerProps.price || !offerProps.status || !offerProps.created_by) {
        throw new Error('Missing required offer properties.');
    }

    // Create the timestamp in the format YYYY-MM-DD HH:MM:SS to avoid problems with SQLite
    const now = new Date();
    const sqliteTimestamp = now.toISOString().replace('T', ' ').split('.')[0];

    const insertIntostatement = fastify.db.prepare(`
        INSERT INTO offers (customer_id, title, description, price, status, created_by, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
    `);
    const selectStatement = fastify.db.prepare("SELECT * FROM offers WHERE id = ?");

    const offerToCreate = {
        customer_id: offerProps.customer_id,
        title: offerProps.title,
        description: offerProps.description,
        price: offerProps.price,
        status: offerProps.status,
        created_by: offerProps.created_by,
        created_at: sqliteTimestamp,
        updated_at: sqliteTimestamp
    };

    try {
        const { customer_id, title, description, price, status, created_by, created_at, updated_at } = offerToCreate;
        const info = insertIntostatement.run(customer_id, title, description, price, status, created_by, created_at, updated_at);

        // Check if the insertion was successful
        if (!info.lastInsertRowid) {
            throw new Error('Failed to insert offer.');
        }

        // Retrieve the created offer by its ID
        const createdOffer = selectStatement.get(info.lastInsertRowid);
        return createdOffer;
    } catch (err) {
        // Log the error for debugging
        fastify.log.error(err);
        throw err; // Rethrow the error for the caller to handle
    }
}

export function updateOffer(fastify, id, offerProps) {
    // Create the timestamp in the format YYYY-MM-DD HH:MM:SS to avoid problems with SQLite
    const now = new Date();
    const sqliteTimestamp = now.toISOString().replace('T', ' ').split('.')[0];

    // Build the dynamic SQL query based on provided properties
    const fields = [];
    const values = [];

    if (offerProps.customer_id) {
        fields.push("customer_id = ?");
        values.push(offerProps.customer_id);
    }
    if (offerProps.some_other_field) { // Replace with actual offer fields
        fields.push("some_other_field = ?");
        values.push(offerProps.some_other_field);
    }

    // Always update the updated_at field
    fields.push("updated_at = ?");
    values.push(sqliteTimestamp);

    // Add the offer ID to the values array
    values.push(id);

    const updateStatement = fastify.db.prepare(`
        UPDATE offers
        SET ${fields.join(", ")}
        WHERE id = ?
    `);
    const selectStatement = fastify.db.prepare("SELECT * FROM offers WHERE id = ?");

    try {
        const info = updateStatement.run(...values);

        if (info.changes === 0) {
            throw new Error(`Offer with ID ${id} not found`);
        }

        // Retrieve the updated offer by its ID
        const updatedOffer = selectStatement.get(id);
        return updatedOffer;
    } catch (err) {
        // Log the error for debugging
        fastify.log.error(err);
        throw err; // Rethrow the error for the caller to handle
    }
}

export function deleteOffer(fastify, id) {
    const deleteStatement = fastify.db.prepare("DELETE FROM offers WHERE id = ?");
    const selectStatement = fastify.db.prepare("SELECT * FROM offers WHERE id = ?");

    try {
        // Retrieve the offer before deleting it
        const offerToDelete = selectStatement.get(id);

        // Delete the offer
        const info = deleteStatement.run(id);

        if (info.changes === 0) {
            throw new Error(`Offer with ID ${id} not found`);
        }

        return offerToDelete;
    } catch (err) {
        // Log the error for debugging
        fastify.log.error(err);
        throw err; // Rethrow the error for the caller to handle
    }
}