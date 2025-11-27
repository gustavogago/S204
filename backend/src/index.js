import express from 'express'
import cors from 'cors'
import { Mongo } from './database/mongo.js'
import { config } from 'dotenv' 
import authRouter from './auth/auth.js'
import usersRouter from './routes/users.js'
import platesRouter from './routes/plates.js'
import ordersRouter from './routes/orders.js'
import adminRouter from './routes/admin.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

config()


async function main () {
    const hostname = process.env.HOST || '0.0.0.0'
    const port = process.env.PORT || 3000

    const app = express()

    const mongoConnection = await Mongo.connect({ mongoConnectionString: process.env.MONGO_CS, mongoDbName: process.env.MONGO_DB_NAME })
    console.log(mongoConnection)
    
    app.use(express.json())
    app.use(cors())
    //imagens
    app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))


    app.get('/', (req, res) => {
        res.send({
            success: true, 
            statusCode: 200,
            body: 'Welcome to MyGastronomy!'
        })
    })

    // routes
    app.use('/auth', authRouter)
    app.use('/users', usersRouter)
    app.use('/plates', platesRouter)
    app.use('/orders', ordersRouter)
    app.use('/admin', adminRouter)
    
    app.listen(port, hostname, () => {
        console.log(`Server running on: ${hostname}:${port}`)
    })
}

main()
