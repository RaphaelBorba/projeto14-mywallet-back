import express from 'express'
import { MongoClient } from 'mongodb'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import { vRecipes, vSingUp } from './schemas.js'
import { v4 as uuid } from 'uuid'

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

const session = db.collection('session')

const recipes = db.collection('recipes')


app.post('/sing_up', async (req, res) => {

    const body = req.body

    const validate = vSingUp.validate(body, { abortEarly: false })

    if (validate.error) {
        const errors = validate.error.details.map((detail) => detail.message)
        return res.status(400).send(errors)
    }

    try {
        const existUser = await users.findOne({ email: body.email })

        if (existUser) {
            return res.status(409).send({ message: 'Esse email já está cadastrado!' })
        }

        const hashPassword = bcrypt.hashSync(body.password, 10)

        await users.insertOne({ ...body, password: hashPassword })

        res.sendStatus(201)


    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

app.post('/sing_in', async (req, res) => {

    const body = req.body

    const user = await users.findOne({ email: body.email })

    if (!user) {
        return res.status(400).send({ message: 'Email não encontrado' })
    }

    try {
        if (user && bcrypt.compareSync(body.password, user.password)) {

            const token = uuid()

            await session.insertOne({
                userId: user._id,
                token
            })

            res.status(200).send({ token, name: user.name })
        } else {
            res.status(400).send({ message: 'Senha errada' })
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }



})
// TROCAR PARA ACHAR COM userID
app.get('/home', async (req, res) => {

    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send('Token não encontrado')
    }

    const sessionUser = await session.findOne({ token })

    if (!sessionUser) {
        return res.status(401).send('Sessão do usuário não encontrado');
    }

    console.log(sessionUser)

    const user = await users.findOne({_id: sessionUser.userId})

    if (!user) return res.status(401).send('Usuário não encontrado');

    console.log(user)

    try {

        const recipesUser = await recipes.find({name: user.name}).toArray()

        res.status(200).send(sessionUser)

    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }

})

// COlOCAR DATA E userID

app.post('/recipes', async (req,res)=>{

    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    const body = req.body

    const validate = vRecipes.validate(body)

    if (validate.error) {
        const errors = validate.error.details.map((detail) => detail.message)
        return res.status(400).send(errors)
    }

    if (!token) {
        return res.status(401).send('Token não encontrado')
    }

    const sessionUser = await session.findOne({ token })

    if (!sessionUser) {
        return res.status(401).send('Sessão do usuário não encontrado');
    }

    console.log(sessionUser)

    try {
        
        await recipes.insertOne({...body, userId: sessionUser.userId})

        res.sendStatus(201)

    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }

})


app.listen(5000, () => console.log('Server on 5000:'))

