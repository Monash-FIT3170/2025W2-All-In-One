import { Mongo } from "meteor/mongo";
import { ConversationDocument } from "/app/server/database/messaging/models/ConversationDocument";
import { MessageDocument } from "/app/server/database/messaging/models/MessageDocument";

// Client-side collections that mirror the server collections
// These will be automatically synchronized via Meteor's pub/sub system
export const ConversationCollection: Mongo.Collection<ConversationDocument> =
  new Mongo.Collection("conversations");

export const MessageCollection: Mongo.Collection<MessageDocument> =
  new Mongo.Collection("messages");
