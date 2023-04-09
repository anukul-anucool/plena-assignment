const { EventEmitter } = require('events');

const eventEmitter = new EventEmitter();

const EVENTS = {
  COMMENT_CREATED: 'comment_created',
  COMMENT_DELETED: 'comment_deleted',
};

const emitCommentCreatedEvent = (postId) => {
  eventEmitter.emit(EVENTS.COMMENT_CREATED, postId);
};

const emitCommentDeletedEvent = (postId) => {
  eventEmitter.emit(EVENTS.COMMENT_DELETED, postId);
};

module.exports = {
  EVENTS,
  eventEmitter,
  emitCommentCreatedEvent,
  emitCommentDeletedEvent,
};
