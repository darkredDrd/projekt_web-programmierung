export function checkPermission(role, operation) {
    const permissions = {
        'Account-Manager': [
            'createOffer', 'updateOffer', 'deleteOffer', 'updateOfferStatus', 'getOffers', 'getOfferById',
            'createComment', 'updateComment', 'deleteComment', 'getComments', 'getCommentById',
            'createDocument', 'updateDocument', 'deleteDocument', 'getDocumentContent', 'getDocuments', 'getDocumentById', 'getDocumentsByOfferId',
            'createCustomer', 'updateCustomer', 'deleteCustomer', 'getCustomers', 'getCustomerById'
        ],
        'Developer': ['createDocument', 'updateDocument', 'deleteDocument', 'getDocumentContent', 'importLegacyOffer', 'generateTestData'],
        'User': ['getOffers', 'getOfferById', 'getDocuments', 'getDocumentById', 'getDocumentContent', 'getComments', 'getCommentById', 'getCustomers', 'getCustomerById']
    };

    return permissions[role] && permissions[role].includes(operation);
}