import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import simklRoutes from "./routes/simkl.routes";
import simklAuthRoutes from "./routes/simkl.auth.routes"
import connectDB from "./config/mongodb.config";
// import anilistRoutes from "./routes/anilist.routes";
// import mediaRoutes from "./routes/media.routes";

const app = express()
// Connect to MongoDB
connectDB();

app.use(cors())
app.use(bodyParser.json())

app.use("/sync/simkl", simklRoutes);
app.use("/auth/simkl", simklAuthRoutes)
// app.use("/sync/anilist", anilistRoutes);
// app.use("/media", mediaRoutes);

export default app;

