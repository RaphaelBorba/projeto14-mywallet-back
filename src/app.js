import express from 'express'
import { MongoClient } from 'mongodb'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import { vSingUp } from './schemas.js'

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

const users = db.collection('users')


app.post('/sing_up', async (req, res)=>{

    const body = req.body

    const validate = vSingUp.validate(body, {abortEarly: false})

    if(validate.error){
        const errors = validate.error.details.map((detail) => detail.message)
        return res.status(400).send(errors)
    }

    try {
        const existUser= await users.findOne({email: body.email})

        if(existUser){
            return res.status(409).send({message: 'Esse email já está cadastrado!'})
        }

        const hashPassword = bcrypt.hashSync(body.password, 10)

        await users.insertOne({...body, password: hashPassword})
        
        res.sendStatus(201)


    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})



app.listen(5000, ()=>console.log('Server on 5000:'))

