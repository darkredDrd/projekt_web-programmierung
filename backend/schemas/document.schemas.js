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
                type: "object",
                properties: {
                    documents: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "integer" },
                                filename: { type: "string" },
                                file_url: { type: "string" },
                            },
                        },
                    },
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
                fileId: { type: "string" },
            },
            required: ["fileId"],
        },
        response: {
            200: {
                type: "string",
            },
            404: {
                type: "object",
                properties: {
                    error: { type: "string" },
                },
            },
        },
    },
};

const createDocumentOptions = {
    schema: {
        headers: {
            type: "object",
            properties: {
                offer_id: { type: "integer" },
                uploaded_by: { type: "string" },
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
        headers: {
            type: "object",
            properties: {
                uploaded_by: { type: "string" },
            },
            required: ["uploaded_by"],
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

export { documentSchema, getDocumentsOptions, getDocumentOptions, getDocumentsByOfferIdOptions, getDocumentContentOptions, createDocumentOptions, updateDocumentOptions, deleteDocumentOptions };