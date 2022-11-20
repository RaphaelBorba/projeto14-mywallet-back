import {Router} from 'express'
import { getRecipes, postRecipes } from '../Controllers/recipesControllers.js'
import { validateUserAutorization } from '../Middlewares/validateUserMiddleware.js'

const router = Router()

router.get('/recipes',validateUserAutorization, getRecipes)

router.post('/recipes',validateUserAutorization, postRecipes)

export default router