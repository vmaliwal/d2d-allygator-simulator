const app = require('./src/app');
const mongoose = require('mongoose');
const http = require('http').Server(app)

const start = async () => {
    await mongoose.connect(`mongodb://mongo:27017/test`, { useNewUrlParser: true, useUnifiedTopology: true})
    console.log("mongo connection success");
    http.listen(3000);
}
start();