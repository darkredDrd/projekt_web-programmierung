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
        const customers = getCustomers(fastify);

        if (!customers) {
            reply.code(500);
            return { error: "Could not get customers" };
        }
    
        reply.code(200);
        return customers;
    });

    fastify.get("/customers/:id", getCustomerOptions, async (request, reply) => {
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
        const customerProps = request.body;

        const customer = createCustomer(fastify, customerProps);

        if (!customer) {
            reply.code(500);
            return { error: "Could not create customer" };
        }

        reply.code(201);
        return { customer: customer };
    });

    fastify.put("/customers/:id", updateCustomerOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const customerProps = request.body;

        const customer = updateCustomer(fastify, id, customerProps);

        if (!customer) {
            reply.code(500);
            return { error: `Could not update customer with ID ${id}` };
        }

        reply.code(200);
        return { customer: customer };
    });

    fastify.delete("/customers/:id", deleteCustomerOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);

        const customer = deleteCustomer(fastify, id);

        if (!customer) {
            reply.code(400);
            return { error: `Customer with ID ${id} not found` };
        }

        reply.code(200);
        return { customer: customer };
    });
  };

  export { customerRoutes };