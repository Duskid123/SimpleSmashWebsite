import express from "express";
// import db from "./conn.mjs";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import User from "../Models/Users.js";
import path from 'path';

import { ObjectId }  from "mongodb";

import {authenticate} from './MyAuth.mjs'
import connectDB from "./conn.mjs";


const router = express.Router();
dotenv.config();

const db = await connectDB();

let users = db.collection("Users");

router.get("/", authenticate, async (req, res) => {
    let results = await users.find({})
        .sort({username: 1})
        .toArray();
    res.send(results).status(200);
});

router.get("/users", authenticate, async (req, res) => {
    const currentUserId = new ObjectId(req.user.userId);
    console.log(currentUserId);
    let results = await users.find({ _id: {$ne: currentUserId}})
        .sort({username: 1})
        .toArray();
    res.send(results).status(200);
});


// Add a new document to the collection
router.post("/addUser", async (req, res) => {
    const {username, password, age} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try{
        const user = await createUser(username, age, hashedPassword);

        const token = jwt.sign({ userId: user['insertedId'] }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: "User created successfully, you are now signed in", token: token, username: username, isAdmin: false });
    }catch (error){
        console.log(error.message)
        res.status(401).json({error: error.message});
    }
});

router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const user = await findUserByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: "You are signed in", token: token, username: username, isAdmin: user.isAdmin });
    } else {
        res.status(401).send('Invalid credentials');
    }
});

router.post('/logout', async (req, res) => {
    // Clear the token cookie by setting its maxAge to 0
    res.cookie('token', '', { maxAge: 0 });

    // Respond with a message and a redirection URL
    res.status(200).send('Hello');
});

async function createUser(username, age, passwordHash) {
    if(!username || !age || !passwordHash){
        throw new Error('Please enter some valid data');
    }
    if(age < 18 || age > 100){
        throw new Error('this website is only for users aged 18-100');
    }
    if( await users.findOne({ username })){
        throw new Error('Username already exists');
    }
    const newDoc = new User({username: username, age: age, password: passwordHash});
    return await users.insertOne(newDoc);
}

async function findUserByUsername(username) {
    return await users.findOne({ username });
}

export default router;
