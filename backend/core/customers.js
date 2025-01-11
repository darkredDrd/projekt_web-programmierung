export function getCustomers(fastify) {
    const statement = fastify.db.prepare("SELECT * FROM customers");

    try {
        const customers = statement.all();
        return customers;
    } catch (err) {
        fastify.log.error(err);
        return null;
    }
}

export function getCustomerById(fastify, id) {
    const statement = fastify.db.prepare("SELECT * FROM customers WHERE id = ?");

    try {
        const customer = statement.get(id);
        return customer;
    } catch (err) {
        fastify.log.error(err);
        return null;
    }
}

export function createCustomer(fastify, customerProps) {
    // Validate the input to ensure required properties are provided
    if (!customerProps.name || !customerProps.email || !customerProps.phone || !customerProps.address) {
        throw new Error('Missing required customer properties.');
    }

    // Create the timestamp in the format YYYY-MM-DD HH:MM:SS to avoid problems with SQLite
    const now = new Date();
    const sqliteTimestamp = now.toISOString().replace('T', ' ').split('.')[0];

    const insertIntostatement = fastify.db.prepare(`
        INSERT INTO customers (name, email, phone, address, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
    `);
    const selectStatement = fastify.db.prepare("SELECT * FROM customers WHERE id = ?");

    const customerToCreate = {
        name: customerProps.name,
        email: customerProps.email,
        phone: customerProps.phone,
        address: customerProps.address,
        created_at: sqliteTimestamp,
        updated_at: sqliteTimestamp
    };

    try {
        const { name, email, phone, address, created_at, updated_at } = customerToCreate;
        const info = insertIntostatement.run(name, email, phone, address, created_at, updated_at);

        // Check if the insertion was successful
        if (!info.lastInsertRowid) {
            throw new Error('Failed to insert customer.');
        }

        // Retrieve the created customer by its ID
        const createdCustomer = selectStatement.get(info.lastInsertRowid);
        return createdCustomer;
    } catch (err) {
        // Log the error for debugging
        fastify.log.error(err);
        throw err; // Rethrow the error for the caller to handle
    }
}
