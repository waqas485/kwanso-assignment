
import { MongoClient } from "mongodb";
const uri = `mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000`;
let mongoClient = new MongoClient(uri);
export const DB = mongoClient.db('KwansoAssignment');
