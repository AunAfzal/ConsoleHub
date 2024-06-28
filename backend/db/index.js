const mongoose = require('mongoose');
require('dotenv').config();
const db_conn= ()=>{
    mongoose.connect(process.env.DB)
  .then(() => console.log('Connected to db'));
  
}

module.exports = db_conn;