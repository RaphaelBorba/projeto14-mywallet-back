import { session } from "../Database/db.js";

export async function validateUserAutorization(req, res, next) {

    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send('Token não encontrado')
    }

    const sessionUser = await session.findOne({ token })

    if (!sessionUser) {
        return res.status(401).send('Sessão do usuário não encontrado');
    }

    req.message = sessionUser

    next()
}