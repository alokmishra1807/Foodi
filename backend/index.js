const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb'); // Ensure ObjectId is imported
require('dotenv').config(); 

const app = express();
const port = process.env.PORT || 6001;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uh2i8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let menuCollections;
let cartCollections;

async function run() {
  try {
    await client.connect();

    // Database and collections
    menuCollections = client.db("demo-foodi-client").collection("menus");
    cartCollections = client.db("demo-foodi-client").collection("cartItems");

    // Test connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // Define routes
    app.get('/', async (req, res) => {
      try {
        const result = await menuCollections.find().toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: 'Failed to fetch data' });
      }
    });

    app.post('/carts', async (req, res) => {
      try {
        const cartItem = req.body;
        const menuItem = cartItem.menuItem;
    
      
        const existingCartItem = await cartCollections.findOne({ menuItem });
    
        if (existingCartItem) {
        
          res.status(409).send({ message: 'Item already exists in the cart' });

        } else {
        
          const result = await cartCollections.insertOne(cartItem);
          res.send(result);
        }
      } catch (error) {
        res.status(500).send({ error: 'Failed to add cart item' });
      }
    });
    app.get('/carts', async (req, res) => {
      try {
        const email = req.query.email;

        const filter = { email: email };
        const result = await cartCollections.find(filter).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: 'Failed to fetch cart items' });
      }
    });

    app.get('/carts/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const filter = { _id: new ObjectId(id) };
        const result = await cartCollections.findOne(filter);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: 'Failed to fetch cart item' });
      }
    });

    app.delete('/carts/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const filter = { _id: new ObjectId(id) };
        const result = await cartCollections.deleteOne(filter);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: 'Failed to delete cart item' });
      }
    });

    app.put('/carts/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const { quantity } = req.body;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            quantity: parseInt(quantity, 10),
          },
        };
        const result = await cartCollections.updateOne(filter, updateDoc);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: 'Failed to update cart item' });
      }
    });

    // Start server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
  }
}

run().catch(console.dir);
