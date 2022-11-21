import { ObjectId } from "mongodb";
import { recipes } from "../Database/db.js";
import { vRecipes } from '../schemas.js'


export async function getRecipes(req, res){

    const sessionUser= req.message

    try {

        const recipesUser = await recipes.find({userId: ObjectId(sessionUser.userId) }).toArray()

        res.status(200).send(recipesUser)

    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }

}

export async function postRecipes(req,res){

    const body = req.body
    const sessionUser= req.message

    const validate = vRecipes.validate(body)

    if (validate.error) {
        const errors = validate.error.details.map((detail) => detail.message)
        return res.status(400).send(errors)
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

export async function deleteRecipes(req, res){

    const {id} = req.params

    try {

        await recipes.deleteOne({_id: ObjectId(id)})

        res.send('deletou')
        
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export async function putRecipe(req, res){

    const {id} = req.params
    const body = req.body

    try {

        await recipes.updateOne({_id: ObjectId(id)}, {$set: {
            description: body.description,
            value: body.value
        }})

        res.sendStatus(200)
        
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}