import {Router} from 'express'
import { getRecipes, postRecipes } from '../Controllers/recipesControllers.js'

const router = Router()

router.get('/recipes', getRecipes)

router.post('/recipes', postRecipes)

export default router