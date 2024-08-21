const express = require('express');
require('dotenv').config()
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.madtkr7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
        await client.connect();

        const tourCollection = client.db("tourDB").collection("tours");
        const countryCollection = client.db("tourDB").collection("countries");
        app.get('/tours', async (req, res) => {
            const tours = tourCollection.find();
            const result = await tours.toArray();
            res.send(result)
        })
        app.get('/tours/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await tourCollection.findOne(query)
            res.send(result)
        })
        app.get('/tours/:countryname', async (req, res) => {
            const countryname = req.params.countryname;
            console.log(countryname)
            // const query = { countryname: countryname };
            const result = await tourCollection.find(countryname).toArray();
            // res.send(result);
            console.log(result)
        });
        app.post('/tours', async (req, res) => {
            const tour = req.body;
            const result = await tourCollection.insertOne(tour);
            res.send(result)
            console.log(result)
        })
        // countries
        app.get('/countries', async (req, res) => {
            const countries = countryCollection.find();
            const result = await countries.toArray();
            res.send(result)
        })
        app.post('/countries', async (req, res) => {
            const country = req.body;
            const result = await countryCollection.insertOne(country);
            res.send(result)
            console.log(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})