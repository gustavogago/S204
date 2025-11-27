import { useEffect, useState } from "react"
import { LuRefreshCw } from "react-icons/lu"
import adminOrdersService from "../../services/adminOrders"
import commonStyles from "./common.module.css"
import styles from "./orders.module.css"

const ORDER_STATUS = [
    { value: 'Pending', label: 'Pendente' },
    { value: 'Completed', label: 'Concluido' },
    { value: 'Canceled', label: 'Cancelado' },
    { value: 'Not picked up', label: 'Nao retirado' },
]

export default function AdminOrders() {
    const { orders, ordersLoading, fetchOrders, updateOrder } = adminOrdersService()
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [orderForm, setOrderForm] = useState({ pickupStatus: 'Pending', pickupTime: '' })
    const [feedback, setFeedback] = useState('')

    useEffect(() => {
        fetchOrders()
    }, [])

    const handleSelectOrder = (order) => {
        setSelectedOrder(order)
        setOrderForm({
            pickupStatus: order.pickupStatus || 'Pending',
            pickupTime: order.pickupTime || ''
        })
        setFeedback('')
    }

    const handleFormChange = (e) => {
        const { name, value } = e.target
        setOrderForm((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!selectedOrder) return

        const result = await updateOrder(selectedOrder._id, orderForm)
        if (result.success) {
            setFeedback('Pedido atualizado com sucesso!')
        } else {
            setFeedback(result.message || 'Erro ao atualizar pedido.')
        }
    }

    const formatDate = (value) => {
        if (!value) return '-'
        const date = new Date(value)
        return date.toLocaleDateString('pt-BR')
    }

    const orderItemsToString = (order) => {
        const summary = order.orderItems
            ?.map((item) => `${item.itemDetails?.[0]?.name || 'Item'} x${item.quantity}`)
            .join(', ')

        return summary?.length ? summary : '-'
    }

    return (
        <div className={commonStyles.section}>
            <div className={commonStyles.tableWrapper}>
                <div className={commonStyles.tableHeader}>
                    <div>
                        <h2>Pedidos</h2>
                        <p>{orders.length} registros</p>
                    </div>
                    <div className={styles.actions}>
                        <button className={styles.refreshButton} onClick={fetchOrders}>
                            <LuRefreshCw /> Atualizar
                        </button>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Data</th>
                            <th>Horario</th>
                            <th>Cliente</th>
                            <th>Itens</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => {
                            const customer = order.userDetails?.[0]
                            return (
                                <tr
                                    key={order._id}
                                    onClick={() => handleSelectOrder(order)}
                                    className={selectedOrder?._id === order._id ? commonStyles.selectedRow : ''}
                                >
                                    <td>
                                        <span className={`${commonStyles.statusBadge} ${commonStyles[order.pickupStatus?.toLowerCase()?.replace(/\s/g, '') || 'pending']}`}>
                                            {ORDER_STATUS.find((s) => s.value === order.pickupStatus)?.label || order.pickupStatus}
                                        </span>
                                    </td>
                                    <td>{formatDate(order.createdAt)}</td>
                                    <td>{order.pickupTime || '-'}</td>
                                    <td>{customer?.fullname || customer?.email || 'Cliente'}</td>
                                    <td>{orderItemsToString(order)}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                {!ordersLoading && orders.length === 0 ? (
                    <p className={styles.emptyState}>Nenhum pedido cadastrado.</p>
                ) : null}
            </div>

            <div className={commonStyles.formPanel}>
                <h3>Editar pedido</h3>
                {feedback ? <p className={commonStyles.feedback}>{feedback}</p> : null}
                {selectedOrder ? (
                    <form className={commonStyles.form} onSubmit={handleSubmit}>
                        <label>
                            Status
                            <select name="pickupStatus" value={orderForm.pickupStatus} onChange={handleFormChange}>
                                {ORDER_STATUS.map((status) => (
                                    <option key={status.value} value={status.value}>{status.label}</option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Horario de retirada
                            <input
                                type="time"
                                name="pickupTime"
                                value={orderForm.pickupTime}
                                onChange={handleFormChange}
                                required
                            />
                        </label>

                        <button type="submit">
                            Atualizar pedido
                        </button>
                    </form>
                ) : (
                    <p>Selecione um pedido para editar.</p>
                )}
            </div>
        </div>
    )
}
