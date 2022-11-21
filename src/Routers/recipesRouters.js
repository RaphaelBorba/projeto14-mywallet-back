import {Router} from 'express'
import { deleteRecipes, getRecipes, postRecipes } from '../Controllers/recipesControllers.js'
import { validateRecipe } from '../Middlewares/validateRecipeMiddleware.js'
import { validateUserAutorization } from '../Middlewares/validateUserMiddleware.js'

const router = Router()

router.get('/recipes',validateUserAutorization, getRecipes)

router.post('/recipes',validateUserAutorization, postRecipes)

router.delete('/recipes/:id', validateUserAutorization, validateRecipe, deleteRecipes)

export default router