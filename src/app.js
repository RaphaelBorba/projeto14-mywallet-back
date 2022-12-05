import express from 'express'
import cors from 'cors'

import recipesRouters from './Routers/recipesRouters.js'
import usersRouters from './Routers/usersRouters.js'


const app = express()
app.use(cors())
app.use(express.json())
app.use(recipesRouters)
app.use(usersRouters)


const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server on ${port}:`))

