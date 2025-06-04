import express from "express"
import startScheduler from "./scheduler.js";
export const app = express();
app.use("/", startScheduler);