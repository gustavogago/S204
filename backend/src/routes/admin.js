import express from 'express'
import OrdersControllers from '../controllers/orders.js'
import PlatesControllers from '../controllers/plates.js'
import UsersControllers from '../controllers/users.js'

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

adminRouter.post('/plates', async (req, res) => {
    const { body, success, statusCode } = await platesControllers.addPlate(req.body)
    res.status(statusCode).send({ body, success, statusCode })
})

adminRouter.put('/plates/:id', async (req, res) => {
    const { body, success, statusCode } = await platesControllers.updatePlate(req.params.id, req.body)
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


