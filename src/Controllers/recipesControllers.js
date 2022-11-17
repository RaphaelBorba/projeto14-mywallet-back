import { ObjectId } from "mongodb";
import { session, recipes } from "../app.js";
import { vRecipes } from '../schemas.js'


export async function getRecipes(req, res){

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

    try {

        const recipesUser = await recipes.find({userId: ObjectId(sessionUser.userId) }).toArray()

        res.status(200).send(recipesUser)

    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }

}

export async function postRecipes(req,res){

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

    var date = new Date();

    try {
        
        await recipes.insertOne({...body, userId: sessionUser.userId, date: date.toLocaleDateString()})

        res.sendStatus(201)

    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }

}