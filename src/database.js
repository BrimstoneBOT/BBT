const { MongoClient } = require('mongodb');

// Connect to MongoDB
const client = new MongoClient(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

(async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB.');
  } catch (error) {
    console.error(error);
  }
})();

module.exports = client;
