import {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
} from '../core/customers.js';
import {
    getCustomersOptions,
    getCustomerOptions,
    createCustomerOptions,
    updateCustomerOptions,
    deleteCustomerOptions
} from '../schemas/customer.schemas.js';
import { checkPermission } from '../authorization.js';

/**
 * Includes the routes for the '/customers' API endpoint.
 * 
 * With this route the user can:
 * - GET all customers
 * - GET a single customer by ID
 * - POST a new customer
 * - PUT (update) a customer by ID
 * - DELETE a customer by ID
 */
async function customerRoutes(fastify, options) {
    fastify.get("/customers", getCustomersOptions, async (request, reply) => {
        if (!checkPermission(request.role, 'getCustomers')) {
            reply.code(403).send({ error: 'Forbidden' });
            return;
        }

        const { name, email } = request.query;
        const customers = getCustomers(fastify, { name, email });

        if (!customers) {
            reply.code(500);
            return { error: "Could not get customers" };
        }

        reply.code(200);
        return customers;
    });

    fastify.get("/customers/:id", getCustomerOptions, async (request, reply) => {
        if (!checkPermission(request.role, 'getCustomerById')) {
            reply.code(403).send({ error: 'Forbidden' });
            return;
        }

        const id = parseInt(request.params.id, 10);

        const customer = getCustomerById(fastify, id);
        if (!customer) {
            reply.code(400);
            return { error: `Customer with ID ${id} not found` };
        }

        reply.code(200);
        return { customer: customer };
    });

    fastify.post("/customers", createCustomerOptions, async (request, reply) => {
        if (!checkPermission(request.role, 'createCustomer')) {
            reply.code(403).send({ error: 'Forbidden' });
            return;
        }

        const customerProps = request.body;

        try {
            const customer = await createCustomer(fastify, customerProps);

            if (!customer) {
                reply.code(500);
                return { error: "Could not create customer" };
            }

            reply.code(201);
            return { customer: customer };
        } catch (err) {
            reply.code(400).send({ error: err.message });
        }
    });

    fastify.put("/customers/:id", updateCustomerOptions, async (request, reply) => {
        if (!checkPermission(request.role, 'updateCustomer')) {
            reply.code(403).send({ error: 'Forbidden' });
            return;
        }

        const id = parseInt(request.params.id, 10);
        const customerProps = request.body;

        try {
            const customer = await updateCustomer(fastify, id, customerProps);

            if (!customer) {
                reply.code(400).send({ error: `Customer with ID ${id} not found` });
            } else {
                reply.code(200).send({ customer: customer });
            }
        } catch (err) {
            reply.code(400).send({ error: err.message });
        }
    });

    fastify.delete("/customers/:id", deleteCustomerOptions, async (request, reply) => {
        if (!checkPermission(request.role, 'deleteCustomer')) {
            reply.code(403).send({ error: 'Forbidden' });
            return;
        }

        const id = parseInt(request.params.id, 10);

        const customer = deleteCustomer(fastify, id);

        if (!customer) {
            reply.code(400).send({ error: `Customer with ID ${id} not found` });
        } else {
            reply.code(200).send({ message: `Customer with ID ${id} successfully deleted` });
        }
    });
}

export { customerRoutes };