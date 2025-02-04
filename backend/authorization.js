export function checkPermission(role, operation) {
    const permissions = {
        'Account-Manager': ['createOffer', 'updateOffer', 'deleteOffer', 'updateOfferStatus', 'createComment', 'updateComment', 'deleteComment'],
        'Developer': ['createDocument', 'updateDocument', 'deleteDocument', 'getDocumentContent'],
        'User': ['getOffers', 'getOfferById', 'getDocuments', 'getDocumentById', 'getComments', 'getCommentById']
    };

    return permissions[role] && permissions[role].includes(operation);
}