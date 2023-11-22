const mongoose = require("mongoose");
const uriRemota =
  "mongodb+srv://iDannyT:dgrBNobBWy4vIXbR@clustersdmtp.g8faxeg.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uriRemota);
const db = mongoose.connection;

module.exports = mongoose;
