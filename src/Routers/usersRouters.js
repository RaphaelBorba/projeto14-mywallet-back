import {Router} from 'express'
import { userSingUp, userSingIn } from '../Controllers/usersController.js'


const router = Router()


router.post('/sing_up', userSingUp )

router.post('/sing_in', userSingIn)

export default router