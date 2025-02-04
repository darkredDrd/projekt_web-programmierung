import { createCustomer } from '../core/customers.js';
import { createOffer } from '../core/offers.js';
import { checkPermission } from '../authorization.js';
import { testGenerateOptions } from '../schemas/test_generate.schemas.js';

/**
 * Includes the routes for the '/test' API endpoint.
 * 
 * With this route the user can:
 * - POST to generate test data
 */
async function testRoutes(fastify, options) {
    fastify.post("/test/generate", testGenerateOptions, async (request, reply) => {
        if (!checkPermission(request.role, 'generateTestData')) {
            reply.code(403).send({ error: 'Forbidden' });
            return;
        }

        try {
            // Generate test customers
            const customer1 = await createCustomer(fastify, {
                name: "Test Customer 1",
                email: "test1@example.com",
                phone: "1234567890",
                address: "123 Test St"
            });

            const customer2 = await createCustomer(fastify, {
                name: "Test Customer 2",
                email: "test2@example.com",
                phone: "0987654321",
                address: "456 Test Ave"
            });

            // Generate test offers
            const offer1 = await createOffer(fastify, {
                customer_id: customer1.id,
                title: "Test Offer 1",
                description: "This is a test offer 1",
                price: 1000,
                currency: "USD",
                status: "draft",
                created_by: "Test User"
            });

            const offer2 = await createOffer(fastify, {
                customer_id: customer2.id,
                title: "Test Offer 2",
                description: "This is a test offer 2",
                price: 2000,
                currency: "EUR",
                status: "active",
                created_by: "Test User"
            });

            reply.code(201).send({ customers: [customer1, customer2], offers: [offer1, offer2] });
        } catch (err) {
            reply.code(500).send({ error: err.message });
        }
    });
}

export { testRoutes };