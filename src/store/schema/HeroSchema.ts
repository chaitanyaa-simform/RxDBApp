const heroSchema = {
  title: 'hero schema',
  version: 0,
  description: 'describes a simple hero',
  primaryKey: 'name',
  type: 'object',
  properties: {
    secret: {
      type: 'string',
      encrypted: true,
    },
  },
  encrypted: ['secret'],
  required: ['color'],
};

export default heroSchema;
