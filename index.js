const express=require("express");
const cors=require("cors");
const app=express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port =process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.ENV_USER}:${process.env.ENV_PASS}@cluster0.tju8r4h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    
    await client.connect();
    const spotCollection=client.db('spotDB').collection('spot')

    app.get('/spot', async (req,res)=>{
        const cursor=spotCollection.find();
        const result=await cursor.toArray();
        res.send(result);
    })
    
    app.get('/spot/:id',async (req,res)=>{
       const id=req.params.id;
       const query= {_id: new ObjectId(id)};
       const result=await spotCollection.findOne(query);
       res.send(result)
    })
    app.delete('/spot/:id',async (req,res)=>{
         const id=req.params.id
         const query={_id: new ObjectId(id)}
         const result=await spotCollection.deleteOne(query)
    })
    app.post('/spot', async (req,res)=>{
            const spot=req.body;
            const result= await spotCollection.insertOne(spot);
             res.send(result);
    })
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   

    
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('Tvlearn is running');
})
app.listen(port,()=>{
    console.log(`it is running on port ${port}`)
})