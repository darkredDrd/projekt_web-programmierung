export function getCustomers(fastify, filters = {}) {
    let query = "SELECT * FROM customers WHERE 1=1";
    const params = [];

    if (filters.name) {
        query += " AND name LIKE ?";
        params.push(`%${filters.name}%`);
    }

    if (filters.email) {
        query += " AND email LIKE ?";
        params.push(`%${filters.email}%`);
    }

    const statement = fastify.db.prepare(query);

    try {
        const customers = statement.all(...params);
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

        if (!info.lastInsertRowid) {
            throw new Error('Failed to insert customer.');
        }

        const createdCustomer = selectStatement.get(info.lastInsertRowid);
        return createdCustomer;
    } catch (err) {
        fastify.log.error(err);
        throw err; 
    }
}

export function updateCustomer(fastify, id, customerProps) {
    // Create the timestamp in the format YYYY-MM-DD HH:MM:SS to avoid problems with SQLite
    const now = new Date();
    const sqliteTimestamp = now.toISOString().replace('T', ' ').split('.')[0];

    // Dynamically build the SQL Query based on the provided properties
    const fields = [];
    const values = [];

    if (customerProps.name) {
        fields.push("name = ?");
        values.push(customerProps.name);
    }
    if (customerProps.email) {
        fields.push("email = ?");
        values.push(customerProps.email);
    }
    if (customerProps.phone) {
        fields.push("phone = ?");
        values.push(customerProps.phone);
    }
    if (customerProps.address) {
        fields.push("address = ?");
        values.push(customerProps.address);
    }

    fields.push("updated_at = ?");
    values.push(sqliteTimestamp);

    values.push(id);

    const updateStatement = fastify.db.prepare(`
        UPDATE customers
        SET ${fields.join(", ")}
        WHERE id = ?
    `);
    const selectStatement = fastify.db.prepare("SELECT * FROM customers WHERE id = ?");

    try {
        const info = updateStatement.run(...values);

        if (info.changes === 0) {
            throw new Error(`Customer with ID ${id} not found`);
        }

        const updatedCustomer = selectStatement.get(id);
        return updatedCustomer;
    } catch (err) {
        fastify.log.error(err);
        throw err; 
    }
}

export function deleteCustomer(fastify, id) {
    const deleteStatement = fastify.db.prepare("DELETE FROM customers WHERE id = ?");
    const selectStatement = fastify.db.prepare("SELECT * FROM customers WHERE id = ?");

    try {
        const customerToDelete = selectStatement.get(id);

        const info = deleteStatement.run(id);

        if (info.changes === 0) {
            throw new Error(`Customer with ID ${id} not found`);
        }

        return customerToDelete;
    } catch (err) {
        fastify.log.error(err);
        throw err; 
    }
}