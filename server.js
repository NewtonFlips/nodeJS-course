const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({
  path: './config.env',
});
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
// Connecting to Database
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() =>
    console.log('Database connection established!')
  );

// console.log(app.get('env')); // These are global variables. This tells us in which environment we are currently in.
// console.log(process.env); // Lis of all environments set by Express

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port} ...`);
});
