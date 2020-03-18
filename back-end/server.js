const { server } = require('./src/app');
const mongoose = require('mongoose');

const start = async () => {
    await mongoose.connect(`mongodb://mongo:27017/test`, { useNewUrlParser: true, useUnifiedTopology: true})
    console.log("mongo connection success");
    server.listen(3000);
}
start();