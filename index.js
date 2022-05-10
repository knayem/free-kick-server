const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload= require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;

const ObjectId = require("mongodb").ObjectID;

require('dotenv').config();

const app = express();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tn7le.mongodb.net/${process.env.DB_PASS}${process.env.DB_NAME}?retryWrites=true&w=majority`
 console.log(process.env.DB_NAME);
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());
const port=5000;

const client = new MongoClient(uri, { useNewUrlParser: true});
client.connect(err => {
    const productCollection = client.db("Online_Sports_Shop").collection("products");
    const orderCollection = client.db("Online_Sports_Shop").collection("orders");
    const reviewCollection = client.db("Online_Sports_Shop").collection("reviews");
    const adminCollection = client.db("Online_Sports_Shop").collection("admins");
    const preOrderCollection = client.db("Online_Sports_Shop").collection("preOrders");

    console.log('database connected');

 app.get('/products', (req, res) => {
     productCollection.find()
     .toArray((err, items) => {
         res.send(items)
     })
 })

 //cd\web development\git\projects\own-work\free-kick-server


 //////////////////////////////////////////////////////////

 app.get('/products/:id', (req, res) => {
    //console.log(req.params.id);
    productCollection.find({_id: ObjectId(req.params.id)})
  .toArray( (err, documents) => {
    console.log(documents)
      res.send(documents[0]);
  })
  })

 ////////////////////

app.post('/addProduct' , (req, res) => {
    const newProduct = req.body;
    console.log('adding new product:', newProduct);
    productCollection.insertOne(newProduct) 
    .then(result => {
         console.log('inserted count:', result)
         res.send(result.insertedCount >0)
    })
  
    })

    ///////////

        app.patch('/update/:id', (req, res) => {
        console.log(req.body.price)
        productCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: { price: req.body.price, }
            })
            .then(result => {
                res.send(result.modifiedCount > 0)
            })
    })

    ////////order///

    app.post('/order' , (req, res) => {
        const newOrder = req.body;
        console.log(newOrder);
        orderCollection.insertOne(newOrder) 
        .then(result => {
            
             res.send(result.insertedCount >0)
        })
        })
    
    
        app.get('/order/:email', (req, res) => {
         
            orderCollection.find({"email": req.params.email})
        
      
        .toArray((err,documents) =>{
                console.log(documents);
                res.send(documents);
                
               })
        
          })
    

//////////////////////



app.post('/addReview' , (req, res) => {
    const newReview = req.body;
    console.log(newReview);
    reviewCollection.insertOne(newReview) 
    .then(result => {
         //console.log('inserted count:', result)
         res.send(result.insertedCount >0)
    })
    })

  

    app.post('/requestPreOrder' , (req, res) => {
      const newAppointment = req.body;
      console.log(newAppointment);
      appointmentCollection.insertOne(newAppointment) 
      .then(result => {
           //console.log('inserted count:', result)
           res.send(result.insertedCount >0)
      })
      })


      app.get('/preOrder', (req, res) => {
        preOrderCollection.find()
        .toArray((err, items) => {
            res.send(items)
        })
    })





    app.get('/reviews', (req, res) => {
      reviewCollection.find()
      .toArray((err, items) => {
          res.send(items)
      })
  })

///////////admin

       app.post('/makeAdmin' , (req, res) => {
       const newAdmin = req.body;
       console.log(newAdmin);
     adminCollection.insertOne(newAdmin) 
       .then(result => {
            //console.log('inserted count:', result)
            res.send(result.insertedCount >0)
       })
       })


       app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, admins) => {
                res.send(admins.length > 0);
            })
    })
       







/////////
     app.delete('/deleteProduct/:id', (req,res) =>{


productCollection.deleteOne({_id: ObjectId(req.params.id)})

.then(result =>{

     console.log(result.insertedCount >0)

})

})


});


app.get('/',(req,res) =>{

res.send ('Assalamu-walikum')

});


app.listen(process.env.PORT || port);
