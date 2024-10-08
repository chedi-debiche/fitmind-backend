const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();

module.exports = () => {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
     //mongoose.connect("mongodb://localhost:27017/fitmind", connectionParams);
      //  mongoose.connect(process.env.DBURL, connectionParams);
      mongoose.connect('mongodb+srv://chedidebiche1:VaBy9i7gpiq4Mvfe@cluster0.azzzc.mongodb.net/',{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,  // This enables TLS
});

    console.log('Connected to database successfully');
  } catch (error) {
    console.log(error);
    console.log('Could not connect to database!');
  }
};
