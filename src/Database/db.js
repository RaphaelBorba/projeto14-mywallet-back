import { MongoClient } from "mongodb";
import dotenv from 'dotenv'
dotenv.config()

const mongoClient = new MongoClient(process.env.MONGO_URI)

try {
    await mongoClient.connect()
} catch (error) {
    console.log(error)
}

const db = mongoClient.db('my_wallet')

export const users = db.collection('users')

export const session = db.collection('session')

export const recipes = db.collection('recipes')
