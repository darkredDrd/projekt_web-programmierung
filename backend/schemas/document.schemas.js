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

const createDocumentOptions = {
    schema: {
        body: {
            type: "object",
            properties: {
                offer_id: { type: "integer" },
                filename: { type: "string" },
                file_url: { type: "string" },
                uploaded_by: { type: "string" },
            },
            required: ["offer_id", "filename", "file_url", "uploaded_by"],
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
                offer_id: { type: "integer" },
                filename: { type: "string" },
                file_url: { type: "string" },
                uploaded_by: { type: "string" },
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

export {
    documentSchema,
    getDocumentsOptions,
    getDocumentOptions,
    createDocumentOptions,
    updateDocumentOptions,
    deleteDocumentOptions,
}