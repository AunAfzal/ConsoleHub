const express = require('express');
const fileUpload = require('express-fileupload');
const port = 4000;
const db_conn = require('./db/index');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/' 
}));

// Routes
const userRoutes = require('./routes/users');
const itemRoutes = require('./routes/items');
const cartRoutes = require('./routes/carts');
const orderRoutes = require('./routes/orders');

app.use('/users', userRoutes);
app.use('/items', itemRoutes);
app.use('/carts', cartRoutes);
app.use('/orders', orderRoutes);


db_conn();


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
