import { useState } from "react"

const url = 'http://localhost:3000/admin/orders'

export default function adminOrdersService() {
    const [orders, setOrders] = useState([])
    const [ordersLoading, setOrdersLoading] = useState(false)

    const fetchOrders = () => {
        setOrdersLoading(true)

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.success) {
                    setOrders(result.body || [])
                }
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                setOrdersLoading(false)
            })
    }

    const updateOrder = async (orderId, payload) => {
        try {
            const response = await fetch(`${url}/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(payload)
            })

            const result = await response.json()

            if (!result.success) {
                throw new Error(result.body?.text || 'Não foi possível atualizar o pedido.')
            }

            setOrders((prev) =>
                prev.map((order) =>
                    order._id === orderId
                        ? { ...order, ...payload }
                        : order
                )
            )

            return { success: true }
        } catch (error) {
            return { success: false, message: error.message }
        }
    }

    return { orders, ordersLoading, fetchOrders, updateOrder }
}


