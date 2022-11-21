import { ObjectId } from "mongodb";
import { recipes } from "../Database/db.js";

export async function validateRecipe(req, res, next){

    const {id} = req.params

    const recipe = await recipes.findOne({_id:ObjectId(id)})

    if(!recipe){
        res.status(404).send('Receita não encontrada!')
        return;
    }

    next()
}