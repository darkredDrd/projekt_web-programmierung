import {
    getOffers,
    getOfferById,
    createOffer,
    updateOffer,
    deleteOffer
} from '../core/offers.js';
import {
    getOffersOptions,
    getOfferOptions,
    createOfferOptions,
    updateOfferOptions,
    deleteOfferOptions
} from '../schemas/offer.schemas.js';

/**
 * Includes the routes for the '/offers' API endpoint.
 * 
 * With this route the user can:
 * - GET all offers
 * - GET a single offer by ID
 * - POST a new offer
 * - PUT (update) an offer by ID
 * - DELETE an offer by ID
 */
async function offerRoutes(fastify, options) {
    fastify.get("/offers", getOffersOptions, async (request, reply) => {
        const offers = getOffers(fastify);

        if (!offers) {
            reply.code(500);
            return { error: "Could not get offers" };
        }
    
        reply.code(200);
        return offers;
    });

    fastify.get("/offers/:id", getOfferOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);

        const offer = getOfferById(fastify, id);
        if (!offer) {
            reply.code(400);
            return { error: `Offer with ID ${id} not found` };
        }

        reply.code(200);
        return { offer: offer };
    });

    fastify.post("/offers", createOfferOptions, async (request, reply) => {
        const offerProps = request.body;

        const offer = createOffer(fastify, offerProps);

        if (!offer) {
            reply.code(500);
            return { error: "Could not create offer" };
        }

        reply.code(201);
        return { offer: offer };
    });

    fastify.put("/offers/:id", updateOfferOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const offerProps = request.body;

        const updatedOffer = updateOffer(fastify, id, offerProps);

        if (!updatedOffer) {
            reply.code(500);
            return { error: `Could not update offer with ID ${id}` };
        }

        reply.code(200);
        return { offer: updatedOffer };
    });

    fastify.delete("/offers/:id", deleteOfferOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);

        const deletedOffer = deleteOffer(fastify, id);

        if (!deletedOffer) {
            reply.code(400);
            return { error: `Offer with ID ${id} not found` };
        }

        reply.code(200);
        return { offer: deletedOffer };
    });
};

export { offerRoutes };