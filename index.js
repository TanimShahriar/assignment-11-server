//initializing
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6mxxl.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)


    const assignmentCollection = client.db("assignmentDB").collection("assignment");



    app.get("/assignment", async (req, res) => {
      const cursor = assignmentCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    app.get("/assignment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await assignmentCollection.findOne(query);
      res.send(result);
    })



    app.post("/assignment", async (req, res) => {
      const newAssignment = req.body;
      console.log(newAssignment);
      const result = await assignmentCollection.insertOne(newAssignment);
      res.send(result);
    })


    app.put("/assignment/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedAssignment = req.body;
      const product = {
        $set: {
          description: updatedAssignment.description,
          marks: updatedAssignment.marks,
          name: updatedAssignment.name,
          imgUrl: updatedAssignment.imgUrl,
          difficultyLevel: updatedAssignment.difficultyLevel,
          dueDate: updatedAssignment.dueDate
        }
      }
      const result = await assignmentCollection.updateOne(filter, product, options);
      res.send(result);
    })


    app.put("/news/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedAssignment = req.body;
      const product = {
        $set: {
          pdf: updatedAssignment.pdf,
          note: updatedAssignment.note,
        }
      }
      const result = await assignmentCollection.updateOne(filter, product, options);
      res.send(result);
    })



    // Send a ping to confirm a successful connection

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("Online study group server is running")
})

app.listen(port, () => {
  console.log((`Online study group server is running on port: ${port}`))
})