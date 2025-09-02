import { Mongo } from "meteor/mongo";
import { ConversationDocument } from "./models/ConversationDocument";
import { MessageDocument } from "./models/MessageDocument";

export const ConversationCollection: Mongo.Collection<ConversationDocument> =
  new Mongo.Collection("conversations");

export const MessageCollection: Mongo.Collection<MessageDocument> =
  new Mongo.Collection("messages");
