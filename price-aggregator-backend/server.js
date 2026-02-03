//Path variable first
const path = require('path');
//Load dotenv
require('dotenv').config({path : path.join(__dirname,'.env')});

//Everything else
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')



//Initialize app and db
const app = express();
connectDB();

//Middleware
app.use(express.json());
app.use(cors());
//Under cors
app.use('/api/products', require('./routes/productRoutes'));

//Routes
app.get('/', (req,res) => res.send('API Running...'));

//Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));