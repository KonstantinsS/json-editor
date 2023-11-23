import {Router} from 'express'
import fs from 'fs';
import path from 'path'

export const getAllFilesRouter = Router();

getAllFilesRouter.get("/", (req, res) => {
  try {
    const files = fs.readdirSync('./assets/files').filter(file => path.extname(file) === '.json');
    res.json(files)
  } catch (error) {
    res.status(500).json({ message: "Oops, something went wrong!" });
  }
});
