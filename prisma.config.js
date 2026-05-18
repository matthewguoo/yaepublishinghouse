const path = require('path');

module.exports = {
  earlyAccess: true,
  schema: path.join(__dirname, 'prisma', 'schema.prisma'),
  migrate: {
    url: process.env.DATABASE_URL || '',
  },
};
