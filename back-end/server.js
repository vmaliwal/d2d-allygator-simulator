const { server } = require('./src/app');
const mongoose = require('mongoose');

const start = async () => {
    const mongooseOpts = {
        useCreateIndex: true,
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }

    await mongoose.connect(`mongodb://mongo:27017/d2d`, mongooseOpts)
    console.log("mongo connection success");
    server.listen(3000);
}
module.exports.init = start();