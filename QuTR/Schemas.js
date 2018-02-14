const UserSchema = {
  name: 'User',
  primaryKey: 'id',
  properties: {
    id: 'int',
    picture: 'string',
    name: 'string',
    country: 'string',
    language: 'string',
    age: 'int',
    gender: 'string',
    conversations: {type: 'Conversation[]', default: []},
  },
};

const ConversationSchema = {
  name: 'Conversation',
  properties: {
    user: 'User',
    correspondent: 'User',
    messages: {type: 'Message[]', default: []},
  },
}

const MessageSchema = {
  name: 'Message',
  properties: {
    text: 'string',
    owner: 'string',
    date: 'date',
  },
}

export { UserSchema, ConversationSchema, MessageSchema };
