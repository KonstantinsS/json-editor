import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { getAllFilesRouter } from "./routes/getAllFiles.route.js";
import { options } from "./configs/socket.config.js";
import { onConnection } from "./socket/onConnection.js";

const PORT = 5000;
const app = express();

app.use(cors());
app.use(express.json({ extended: true }));
app.use("/api/files", getAllFilesRouter);

function start() {
  try {
    const server = app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
    let users = new Map();
    const io = new Server(server, options);
    io.on("connection", (socket) => onConnection(socket, users, io));
  } catch (error) {
    console.log("Server error", error);
    process.exit(1);
  }
}

start();
