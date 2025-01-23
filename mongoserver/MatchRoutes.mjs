import express from "express";
import connectDB from "./conn.mjs";
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import Match from "../Models/Match.js";
import { ObjectId } from "mongodb";
import { authenticate } from "./MyAuth.mjs";
import mongoose from 'mongoose';


const router = express.Router();
dotenv.config();

const db = await connectDB();
let matches = db.collection("Matches");

// Add a new document to the collection
router.post("/AddMatch", authenticate, async (req, res) => {
    const { player_2, char_1, char_2, Won } = req.body;

    // Get player_1 from the authenticated user (assuming the auth middleware sets req.user)
    const player_1 = req.user.userId; // Make sure your auth middleware sets req.user to the authenticated user

    try {
        await createMatch(player_1, player_2, char_1, char_2, Won);
        res.json({ message: 'Match result added successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// Function to create and save the match
async function createMatch(user_1, user_2, character_1, character_2, Won) {
    if (!user_1 || !user_2 || character_1 == null || !character_2 == null) {
        throw new Error('All players and characters must be provided.');
    }

    const Winner = Won ? user_1 : user_2;


    const newMatch = new Match({
        player_1: user_1,
        player_2: user_2,
        character_1: character_1,
        character_2: character_2,
        Winner: Winner,
    });

    await matches.insertOne(newMatch);
}


router.get("/", authenticate, async (req, res) => {
    let results = await matches.find({})
        .toArray();
    res.send(results).status(200);
});

router.get("/matches", async (req, res) => {
    try {
        const result = await db.collection("Matches").aggregate([
            {
                $lookup: {
                    from: 'Users',       // Lookup player_1 from Users
                    localField: 'player_1',
                    foreignField: '_id',
                    as: 'player1Data'
                }
            },
            {
                $unwind: '$player1Data' // Deconstruct player_1 data
            },
            {
                $lookup: {
                    from: 'Users',       // Lookup player_2 from Users
                    localField: 'player_2',
                    foreignField: '_id',
                    as: 'player2Data'
                }
            },
            {
                $unwind: '$player2Data' // Deconstruct player_2 data
            },
            {
                $lookup: {
                    from: 'characters',  // Lookup character_1 from characters
                    localField: 'character_1',
                    foreignField: '_id',
                    as: 'character1Data'
                }
            },
            {
                $unwind: '$character1Data' // Deconstruct character_1 data
            },
            {
                $lookup: {
                    from: 'characters',  // Lookup character_2 from characters
                    localField: 'character_2',
                    foreignField: '_id',
                    as: 'character2Data'
                }
            },
            {
                $unwind: '$character2Data' // Deconstruct character_2 data
            },
            {
                $lookup: {
                    from: 'Users',       // Lookup Winner from Users
                    localField: 'Winner',
                    foreignField: '_id',
                    as: 'winnerData'
                }
            },
            {
                $unwind: '$winnerData' // Deconstruct Winner data
            },
            {
                $match: {
                    Confirmed: true // Filter for confirmed matches
                }
            },
            {
                $addFields: {
                    formattedDate: {
                        $dateToString: {
                            format: "%Y-%m-%d %H:%M:%S", // Format as "YYYY-MM-DD HH:mm:SS"
                            date: "$createdAt"
                        }
                    }
                }
            },
            {
                $project: {
                    player_1: '$player1Data.username',     // Include username of player_1
                    player_2: '$player2Data.username',     // Include username of player_2
                    character_1: '$character1Data',  // Include name of character_1
                    character_2: '$character2Data',  // Include name of character_2
                    Winner: '$winnerData.username',      // Include username of Winner
                    Confirmed: 1,                           // Retain status field from Matches
                    formattedDate: 1,                        // Retain createdAt field from Matches
                    _id: 0                               // Exclude the _id field
                }
            }
        ]).toArray();



        res.json(result); // Send the populated matches as response
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching matches" });
    }
});

router.get("/unconfirmedMatches", authenticate, async (req, res) => {

    try {
        const result = await db.collection("Matches").aggregate([
            {
                $lookup: {
                    from: 'Users',       // Lookup player_1 from Users
                    localField: 'player_1',
                    foreignField: '_id',
                    as: 'player1Data'
                }
            },
            {
                $unwind: '$player1Data' // Deconstruct player_1 data
            },
            {
                $lookup: {
                    from: 'Users',       // Lookup player_2 from Users
                    localField: 'player_2',
                    foreignField: '_id',
                    as: 'player2Data'
                }
            },
            {
                $unwind: '$player2Data' // Deconstruct player_2 data
            },
            {
                $lookup: {
                    from: 'characters',  // Lookup character_1 from characters
                    localField: 'character_1',
                    foreignField: '_id',
                    as: 'character1Data'
                }
            },
            {
                $unwind: '$character1Data' // Deconstruct character_1 data
            },
            {
                $lookup: {
                    from: 'characters',  // Lookup character_2 from characters
                    localField: 'character_2',
                    foreignField: '_id',
                    as: 'character2Data'
                }
            },
            {
                $unwind: '$character2Data' // Deconstruct character_2 data
            },
            {
                $lookup: {
                    from: 'Users',       // Lookup Winner from Users
                    localField: 'Winner',
                    foreignField: '_id',
                    as: 'winnerData'
                }
            },
            {
                $unwind: '$winnerData' // Deconstruct Winner data
            },
            {
                $match: {
                    Confirmed: false // Filter for confirmed matches
                }
            },
            {
                $project: {
                    Id_1: '$player1Data._id',
                    Id_2: '$player2Data._id',
                    player_1: '$player1Data.username',     // Include username of player_1
                    player_2: '$player2Data.username',     // Include username of player_2
                    character_1: '$character1Data',  // Include name of character_1
                    character_2: '$character2Data',  // Include name of character_2
                    Winner: '$winnerData.username',      // Include username of Winner
                    Confirmed: 1,                           // Retain status field from Matches
                    createdAt: 1,                        // Retain createdAt field from Matches
                                         // Exclude the _id field
                }
            }
        ]).toArray();

        const player1Matches = result.filter(match => match.Id_1.equals(req.user.userId));
        const player2Matches = result.filter(match => match.Id_2.equals(req.user.userId));

        const response = {
            asPlayer1: player1Matches,
            asPlayer2: player2Matches
        };

        res.json(response);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching matches" });
    }
});

router.post("/confirmMatch/:id", authenticate, async (req, res) => {
    try {

        const currentMatchId = new ObjectId(req.params.id);
        const currentUserId = new ObjectId(req.user.userId);
        const query = { _id: currentMatchId, player_2: currentUserId };

        // Use findOne to fetch the match
        const match = await db.collection("Matches").findOne(query);

        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }


        // Confirm the match (set Confirmed to true)
        const updateResult = await db.collection("Matches").updateOne(
            { _id: currentMatchId },
            { $set: { Confirmed: true } }
        );

        if (updateResult.modifiedCount === 1) {
            res.status(200).json({ message: "Match confirmed successfully" });
        } else {
            res.status(500).json({ message: "Failed to confirm match" });
        }
    } catch (error) {
        console.error("Error confirming match:", error);
        res.status(500).json({ message: "An error occurred" });
    }
});

const formatDateClient = (mongoDate) => {
    const date = new Date(mongoDate);
    return date.toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    });
};

export default router;
