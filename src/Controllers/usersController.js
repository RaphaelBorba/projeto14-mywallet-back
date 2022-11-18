import { vSingUp } from "../schemas.js"
import { users, session } from "../Database/db.js"
import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'

export async function userSingUp(req, res){

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
}


export async function userSingIn(req, res){

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



}