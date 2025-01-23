import express from "express";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import {authenticate} from './MyAuth.mjs'

import connectDB from "./conn.mjs";

const router = express.Router();

const db = await connectDB();
let collection = db.collection("characters");


router.get("/", async (req, res) => {
  let results = await collection.find({})
      .sort({order: 1})
      .toArray();
  res.send(results).status(200);
});

// Get a single character based off of ID
router.get("/id/:id",authenticate, async (req, res) => {
  let collection = await db.collection("characters");

  let ID = req.params.id;
  if (ID === '33'  || ID === '34' || ID === '35'){
    ID = '33-35';
  }
  if(ID === '79' || ID === '80'){
    ID = '79-80';
  }
  let query = {order: ID};

  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// Get a single post
router.get("/name/:id", authenticate, async (req, res) => {
  try {
    const collection = await db.collection("characters");

    let triedName = req.params.id;

    const query = { name:  triedName}; // Match name with the ID from URL params
    const result = await collection.findOne(query); // findOne directly returns the document or null

    if (!result) {
      return res.status(200).send(`There is not a character named ${triedName}`);
    }

    res.status(200).send(`Yes there is a character with a name ${result.name}`); // Send the result if found
  } catch (error) {
    console.error("Error fetching character:", error);
    res.status(500).send("Internal Server Error");
  }
});



export default router;
