const app = require('./src/app');
const mongoose = require('mongoose');

const mongo = async () => {
    await mongoose.connect(`mongodb://mongo:27017/test`, { useNewUrlParser: true, useUnifiedTopology: true})
    console.log("mongo connection success");
}

mongo();
app.listen(3000);