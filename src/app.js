import express from 'express'
import { MongoClient } from 'mongodb'
import cors from 'cors'
import dotenv from 'dotenv'
import {userSingUp, userSingIn} from './Controllers/usersController.js'
import {getRecipes, postRecipes} from './Controllers/recipesControllers.js'

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

export const users = db.collection('users')

export const session = db.collection('session')

export const recipes = db.collection('recipes')


app.post('/sing_up', userSingUp )

app.post('/sing_in', userSingIn)

app.get('/recipes', getRecipes)

app.post('/recipes', postRecipes)


app.listen(5000, () => console.log('Server on 5000:'))

