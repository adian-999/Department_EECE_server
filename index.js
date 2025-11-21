const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;


// const allowedOrigins = [
//   "https://department-cc5bf.web.app",
//   "https://department-cc5bf.firebaseapp.com",
//   "http://localhost:5173",
// ];

// app.use(cors({
//   origin: allowedOrigins,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
// }));

// app.use(cors({
//   origin: [
  //   "https://department-cc5bf.web.app",
  // "https://department-cc5bf.firebaseapp.com",
  // "http://localhost:5173",
  // "https://department-server-k42vzvkss-adian999s-projects.vercel.app"
//   ],
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],

// }))

const corsOptions = {
  origin: ["https://department-cc5bf.web.app",
  "https://department-cc5bf.firebaseapp.com",
  "http://localhost:5173",
  "https://department-server-k42vzvkss-adian999s-projects.vercel.app"],

  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.inukn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // alumni realted api------
    const alumniCollection = client.db('Department').collection('alumni');

    // notice related APi-------

    const noticeCollection = client.db('Department').collection('notice');

    app.get('/notice',async(req,res)=>{
      const cursor = noticeCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    // post notice-----
    app.post('/notice',async(req,res)=>{
      const newNotice = req.body;
      const result = await noticeCollection.insertOne(newNotice);
      res.send(result);
      console.log(newNotice)
    })



    // alumni....


    app.get('/alumni',(async(req,res)=>{
      const cursor = alumniCollection.find().sort({createdAt:-1});
      const result = await cursor.toArray();
      res.send(result)
    }))

    // for single alumni details

    app.get('/alumni/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await alumniCollection.findOne(query);
      res.send(result)
    })

    // alumni post

    app.post('/alumni',async(req,res)=>{
      const newAlumni = {...req.body, createdAt: new Date()};
      const result = await alumniCollection.insertOne(newAlumni);
      res.send(result);
      console.log(newAlumni)
    })



  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/',(req,res)=>{
  res.send('alumni is falling from the sky')
})

app.listen(port,()=>{
  console.log(`alumni is waiting at : ${port}`)
})
