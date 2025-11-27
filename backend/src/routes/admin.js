import express from 'express'
import OrdersControllers from '../controllers/orders.js'
import PlatesControllers from '../controllers/plates.js'
import UsersControllers from '../controllers/users.js'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'plates')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        const ext = path.extname(file.originalname)
        cb(null, uniqueSuffix + ext)
    },
})

const upload = multer({ storage })

const adminRouter = express.Router()
const ordersControllers = new OrdersControllers()
const platesControllers = new PlatesControllers()
const usersControllers = new UsersControllers()


// Orders
adminRouter.get('/orders', async (req, res) => {
    const { body, success, statusCode } = await ordersControllers.getOrders()
    res.status(statusCode).send({ body, success, statusCode })
})

adminRouter.put('/orders/:id', async (req, res) => {
    const { body, success, statusCode } = await ordersControllers.updateOrder(req.params.id, req.body)
    res.status(statusCode).send({ body, success, statusCode })
})

// Plates
adminRouter.get('/plates', async (req, res) => {
    const { body, success, statusCode } = await platesControllers.getPlates()
    res.status(statusCode).send({ body, success, statusCode })
})

adminRouter.post('/plates', upload.single('image'), async (req, res) => {
    // converte campos vindos do multipart (são strings)
    const plateData = {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price ? Number(req.body.price) : 0,
        available: req.body.available === 'true' || req.body.available === true,
    }

    // se vier URL manual (futuro), mantém
    if (req.body.imgUrl) {
        plateData.imgUrl = req.body.imgUrl
    }

    // se veio arquivo, monta a URL da imagem
    if (req.file) {
        const protocol = req.protocol   // http
        const host = req.get('host')    // localhost:3000
        plateData.imgUrl = `${protocol}://${host}/uploads/plates/${req.file.filename}`
    }

    const { body, success, statusCode } = await platesControllers.addPlate(plateData)
    res.status(statusCode).send({ body, success, statusCode })
})


adminRouter.put('/plates/:id', upload.single('image'), async (req, res) => {
    // converte campos vindos do multipart (são strings)
    const plateData = {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price ? Number(req.body.price) : 0,
        available: req.body.available === 'true' || req.body.available === true,
    }

    // se vier URL manual, mantém
    if (req.body.imgUrl) {
        plateData.imgUrl = req.body.imgUrl
    }

    // se veio arquivo novo, sobrescreve a imagem do prato
    if (req.file) {
        const protocol = req.protocol
        const host = req.get('host')
        plateData.imgUrl = `${protocol}://${host}/uploads/plates/${req.file.filename}`
    }

    const { body, success, statusCode } = await platesControllers.updatePlate(req.params.id, plateData)
    res.status(statusCode).send({ body, success, statusCode })
})

adminRouter.delete('/plates/:id', async (req, res) => {
    const { body, success, statusCode } = await platesControllers.deletePlate(req.params.id)
    res.status(statusCode).send({ body, success, statusCode })
})

// Users
adminRouter.get('/users', async (req, res) => {
    const { body, success, statusCode } = await usersControllers.getUsers()
    res.status(statusCode).send({ body, success, statusCode })
})

adminRouter.put('/users/:id', async (req, res) => {
    const { body, success, statusCode } = await usersControllers.updateUser(req.params.id, req.body)
    res.status(statusCode).send({ body, success, statusCode })
})

adminRouter.delete('/users/:id', async (req, res) => {
    const { body, success, statusCode } = await usersControllers.deleteUser(req.params.id)
    res.status(statusCode).send({ body, success, statusCode })
})

export default adminRouter


