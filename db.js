const mongoose = require("mongoose")


const mongoURI = "mongodb://127.0.0.1:27017/mernnotes"


const connectToMongo = ()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected successfully");
    })
}
mongoose.set('strictQuery', false);

module.exports = connectToMongo