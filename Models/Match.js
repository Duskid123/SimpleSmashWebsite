const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const matchSchema = new Schema({
    player_1: { type: Schema.Types.ObjectId, ref: 'Users', db: 'Users', index: true, required: true},
    player_2: { type: Schema.Types.ObjectId, ref: 'Users', db: 'Users', index: true , required: true},
    character_1: { type: Schema.Types.ObjectId, ref: 'characters', db: 'characters', index: true, required: true },
    character_2: { type: Schema.Types.ObjectId, ref: 'characters', db: 'characters', index: true, required: true },
    Winner: { type: Schema.Types.ObjectId, ref: 'Users', db: 'Users', index: true, required: true },
    createdAt: { type: Date, default: Date.now },
    Confirmed: { type: Boolean, default: false },
});

// // Compound Index for player combination and sorting by date
// matchSchema.index({ player_1: 1, player_2: 1, createdAt: -1 });
//
// // Partial Index for confirmed matches
// matchSchema.index({ Confirmed: 1 }, { partialFilterExpression: { Confirmed: true } });

// // Validation to ensure Winner is one of the players
// matchSchema.pre('save', function (next) {
//     if (this.Winner && ![this.player_1?.toString(), this.player_2?.toString()].includes(this.Winner.toString())) {
//         return next(new Error('Winner must be either player_1 or player_2.'));
//     }
//     next();
// });

// matchSchema.pre("save", function (next){
//     if (this.character_1 == null || this.character_2 == null){
//         return next(new Error('You must have both characters selected'))
//     }
//     next();
// });

// Create a Mongoose model from the schema
const Match = mongoose.model('Matches', matchSchema);

module.exports = Match;
