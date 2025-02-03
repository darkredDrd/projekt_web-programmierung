import {
    getComments,
    getCommentById,
    createComment,
    updateComment,
    deleteComment
} from '../core/comments.js';
import {
    getCommentsOptions,
    getCommentOptions,
    createCommentOptions,
    updateCommentOptions,
    deleteCommentOptions
} from '../schemas/comment.schemas.js';

/**
 * Includes the routes for the '/comments' API endpoint.
 * 
 * With this route the user can:
 * - GET all comments
 * - GET a single comment by ID
 * - POST a new comment
 * - PUT (update) a comment by ID
 * - DELETE a comment by ID
 */
async function commentRoutes(fastify, options) {
    fastify.get("/comments", getCommentsOptions, async (request, reply) => {
        const comments = getComments(fastify);

        if (!comments) {
            reply.code(500);
            return { error: "Could not get comments" };
        }
    
        reply.code(200);
        return comments;
    });

    fastify.get("/comments/:id", getCommentOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);

        const comment = getCommentById(fastify, id);
        if (!comment) {
            reply.code(400);
            return { error: `Comment with ID ${id} not found` };
        }

        reply.code(200);
        return { comment: comment };
    });

    fastify.post("/comments", createCommentOptions, async (request, reply) => {
        const commentProps = request.body;

        const comment = createComment(fastify, commentProps);

        if (!comment) {
            reply.code(500);
            return { error: "Could not create comment" };
        }

        reply.code(201);
        return { comment: comment };
    });

    fastify.put("/comments/:id", updateCommentOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const commentProps = request.body;

        const comment = updateComment(fastify, id, commentProps);

        if (!comment) {
            reply.code(400);
            return { error: `Comment with ID ${id} not found` };
        }

        reply.code(200);
        return { comment: comment };
    });

    fastify.delete("/comments/:id", deleteCommentOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);

        const comment = deleteComment(fastify, id);

        if (!comment) {
            reply.code(400);
            return { error: `Comment with ID ${id} not found` };
        }

        reply.code(200);
        return { comment: comment };
    });
};

export { commentRoutes };