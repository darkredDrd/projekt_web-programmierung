import { createOffer } from "../core/offers";

const offerSchema = {
    $id: "offerSchema",
    type: "object",
    properties: {
        id: { type: "integer" },
        customer_id: { type: "integer" },
        title: { type: "string" },
        desciption: { type: "string" },
        price: { type: "number" },
        status: { type: "string", enum: ["draft", "active", "on_ice"] },
        created_by: { type: "string" },
        created_at: { type: "string" },
        updated_at: { type: "string" },
    },
};

const getOffersOptions = {
    schema: {
        response: {
            200: {
                type: "array",
                items: { $ref: "offerSchema#" },
            },
        },
    },
};

const getOfferOptions = {
    schema: {
        params: {
            type: "object",
            properties: {
                id: { type: "integer" },
            },
            required: ["id"],
        },
        response: {
            200: {
                type: "object",
                properties: {
                    offer: { $ref: "offerSchema#" },
                },
            },
        },
    },
};

const createOfferOptions = {
    schema: {
        body: {
            type: "object",
            properties: {
                customer_id: { type: "integer" },
                title: { type: "string" },
                description: { type: "string" },
                price: { type: "number" },
                status: { type: "string" },
                created_by: { type: "string" },
            },
            required: ["customer_id", "title", "description", "price", "status", "created_by"],
        },
        response: {
            200: {
                type: "object",
                properties: {
                    offer: { $ref: "offerSchema#" },
                },
            },
        },
    },
};

const updateOfferOptions = {
    schema: {
        params: {
            type: "object",
            properties: {
                id: { type: "integer" },
            },
            required: ["id"],
        },
        body: {
            type: "object",
            properties: {
                customer_id: { type: "integer" },
                title: { type: "string" },
                description: { type: "string" },
                price: { type: "number" },
                status: { type: "string" },
                created_by: { type: "string" },
            },
        },
        response: {
            200: {
                type: "object",
                properties: {
                    offer: { $ref: "offerSchema#" },
                },
            },
        },
    },
};

const deleteOfferOptions = {
    schema: {
        params: {
            type: "object",
            properties: {
                id: { type: "integer" },
            },
            required: ["id"],
        },
        response: {
            200: {
                type: "object",
                properties: {
                    message: { type: "string" },
                },
            },
        },
    },
};

export {
    offerSchema,
    getOffersOptions,
    getOfferOptions,
    createOfferOptions,
    updateOfferOptions,
    deleteOfferOptions,
}