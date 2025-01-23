import express from "express";
import cors from "cors";
import "express-async-errors";
import characterRoute from "./characterRoute.mjs";
import contactroutes from "./contactroutes.mjs";
import userRoutes from "./UserRoute.mjs";
import match from "./MatchRoutes.mjs";
import path from "path";

const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());

// Load the /recipes routes
app.use("/char", characterRoute);
app.use("/contact", contactroutes);
app.use("/user", userRoutes);
app.use("/match", match);


// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Uh oh! An unexpected error occured.")
})

// Serve static files from the "public" folder
app.use(express.static(path.join(process.cwd(), "public")));

// Route to explicitly serve the login page
app.get("/login", (req, res) => {
  console.log("Rendering login page");
  res.sendFile(path.join(process.cwd(), 'public/pages/SignUp.html'));
});


// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
