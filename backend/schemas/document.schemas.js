const documentSchema = {
    $id: "documentSchema",
    type: "object",
    properties: {
        id: { type: "integer" },
        offer_id: { type: "integer" },
        filename: { type: "string" },
        file_url: { type: "string" },
        uploaded_by: { type: "string" },
        uploaded_at: { type: "string" },
        updated_at: { type: "string" },
    },
};

const getDocumentsOptions = {
    schema: {
        querystring: {
            type: "object",
            properties: {
                filename: { type: "string" },
                uploaded_by: { type: "string" }
            }
        },
        response: {
            200: {
                type: "array",
                items: { $ref: "documentSchema#" },
            },
        },
    },
};

const getDocumentOptions = {
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
                    document: { $ref: "documentSchema#" },
                },
            },
        },
    },
};

const getDocumentsByOfferIdOptions = {
    schema: {
        params: {
            type: "object",
            properties: {
                offerId: { type: "integer" },
            },
            required: ["offerId"],
        },
        response: {
            200: {
                type: "array",
                items: { $ref: "documentSchema#" },
            },
        },
    },
};

const createDocumentOptions = {
    schema: {
        body: {
            type: "object",
            properties: {
                offer_id: { type: "integer" },
                uploaded_by: { type: "string" }
            },
            required: ["offer_id", "uploaded_by"],
        },
        response: {
            201: {
                type: "object",
                properties: {
                    document: { $ref: "documentSchema#" },
                },
            },
        },
    },
};

const updateDocumentOptions = {
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
                uploaded_by: { type: "string" }
            },
        },
        response: {
            200: {
                type: "object",
                properties: {
                    document: { $ref: "documentSchema#" },
                },
            },
        },
    },
};

const deleteDocumentOptions = {
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

const getDocumentContentOptions = {
    schema: {
        params: {
            type: "object",
            properties: {
                fileId: { type: "integer" },
            },
            required: ["fileId"],
        },
        response: {
            200: {
                type: "string"
            },
        },
    },
};

export {
    documentSchema,
    getDocumentsOptions,
    getDocumentOptions,
    createDocumentOptions,
    updateDocumentOptions,
    deleteDocumentOptions,
    getDocumentsByOfferIdOptions,
    getDocumentContentOptions
};