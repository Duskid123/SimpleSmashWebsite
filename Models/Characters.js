const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const characterSchema = new Schema({
    name: { type: String, required: true },
    order: { type: String },
    availability: { type: String },
    images: {
        icon: [{ type: String }],
        portrait: { type: String }
    },
    series: {
        icon: { type: String },
        name: { type: String }
    },
    alsoAppearsIn: [{ type: String }],
});

characterSchema.index({_id:1});


// Create a model based on the schema
const Character = mongoose.model('characters', characterSchema);

module.exports = Character;
