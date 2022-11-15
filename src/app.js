import express from 'express'
import { MongoClient } from 'mongodb'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const mongoClient = new MongoClient(process.env.MONGO_URI)

try {
    await mongoClient.connect()
} catch (error) {
    console.log(error)
}

const db = mongoClient.db('my_wallet')





app.listen(5000, ()=>console.log('Server on 5000:'))

