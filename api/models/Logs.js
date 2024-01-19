const mongoose = require('mongoose')
const {Schema, model} = mongoose;


const LogSchema = new Schema({
    time: Date,
    duration: Number,
    region: String,
    sensorID: String,
    stoppage: String,
    profile: String,
    measure: String,
    comment: String,
    initialCobbleTime: {
        type: Date,
      },
    author: {type:Schema.Types.ObjectId, ref:'User'},
},{timestamps:true,}
);

const LogModel = model('Logs', LogSchema);
module.exports = LogModel;