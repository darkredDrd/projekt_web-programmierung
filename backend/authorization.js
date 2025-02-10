export function checkPermission(role, operation) {
    const permissions = {
        'Account-Manager': [
            'createOffer', 'updateOffer', 'deleteOffer', 'updateOfferStatus', 'getOffers', 'getOfferById', 'getOffersByCustomerId',
            'createComment', 'updateComment', 'deleteComment', 'getComments', 'getCommentById', 'getCommentsByOfferId',
            'createDocument', 'updateDocument', 'deleteDocument', 'getDocumentContent', 'getDocuments', 'getDocumentById', 'getDocumentsByOfferId',
            'createCustomer', 'updateCustomer', 'deleteCustomer', 'getCustomers', 'getCustomerById'
        ],
        'Developer': [
            'getOffers', 'getOfferById', 'getOffersByCustomerId', 'updateOffer', 
            'createComment', 'updateComment', 'deleteComment', 'getCommentsByOfferId', 'getComments', 'getCommentById',
            'createDocument', 'updateDocument', 'deleteDocument', 'getDocumentContent', 'getDocuments', 'getDocumentById', 'getDocumentsByOfferId',
            'getCustomers', 'getCustomerById',
            'importLegacyOffer', 'generateTestData'
        ],
        'User': [
            'getOffers', 'getOfferById', 'getOffersByCustomerId',
            'getComments', 'getCommentById', 'getCommentsByOfferId',
            'getDocuments', 'getDocumentById', 'getDocumentsByOfferId', 'getDocumentContent',  
            'getCustomers', 'getCustomerById'
        ]
    };

    return permissions[role].includes(operation);
}
