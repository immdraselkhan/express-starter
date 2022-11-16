const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

// Middlewares
app.use(cors());
app.use(express.json());

// JWT verify
const verifyJWT = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token && token !== 'null') {
      jwt.verify(token, process.env.ACCESS_API_TOKEN, (error, decoded) => {
        if (error) {
          res.status(401).send({
            success: false,
            error: 'Unauthorized access, token invalid!',
          });
          return;
        } else {
          req.decoded = decoded;
          next();
        };
      });
    } else {
      res.status(401).send({
        success: false,
        error: 'Unauthorized access, token not found!',
      });
      return;
    };
  } catch (error) {
    console.error(error.name, error.message);
    res.send({
      success: false,
      error: error.message,
    });
  };
};

// If MongoDB Atlast, use this server URL (Cluster)
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@practice-cluster.kfbhlaq.mongodb.net/?retryWrites=true&w=majority`;

// If MongoDB Compass, use this server URL
const uri = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.0';

// Creating a new client
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// Connecting the client to the cluster then creating database
const dbConnect = async () => {
  try {
    // Connect client
    await client.connect();

    // Verify If connected, else bellow lines will not execute
    console.log('Database is connected...');

    // [USE IT TO TEST] Creating database and adding a collection then inserting a document
    // const dbTesting = client.db('dbTest').collection('collectionTest');
    // const result = await dbTesting.insertOne({'name': 'Md Rasel Khan'});
    // console.log(result);

  } catch (error) {
    console.error(error.name, error.message);
    res.send({
      success: false,
      error: error.message,
    });
  };
};

// Execute the above function
dbConnect();

/// CREATE DATABASES

// Database name
// const dbVariable = client.db('db_name');

/// CREATE COLLECTIONS

// Collection name
// const collectionVariable = main.collection('collection_name');

/// API ENDPOINTS

// JWT
app.post('/jwt', async (req, res) => {
  try {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_API_TOKEN, {expiresIn : '1d'});
    if (user.userId) {
      res.send({
        success: true,
        token,
      });
    } else {
      res.send({
        success: false,
        error: 'Couldn\'t generate the token',
      });
    };
  } catch (error) {
    console.error(error.name, error.message);
    res.send({
      success: false,
      error: error.message,
    });
  };
});

// JWT verification example
app.get('/jwt', verifyJWT, async (req, res) => {
  try {
    const decoded = req.decoded;
    if (decoded.userId !== req.params.userId) {
      res.status(401).send({
        success: false,
        error: 'Unauthorized access, different user!',
      });
      return;
    };
    res.send({
      success: true,
      message: 'JWT verified',
    });
  } catch (error) {
    console.log(error.name, error.message);
    res.send({
      success: false,
      error: error.message,
    });
  };
});

// Verify the server is running or not
app.get('/', (req, res) => {
  try {
    res.send({
      success: true,
      message: 'Server is running...',
    });
  } catch (error) {
    console.log(error.name, error.message);
    res.send({
      success: false,
      error: error.message,
    });
  };
});

// Listening the app on a particular port
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});