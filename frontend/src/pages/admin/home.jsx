import { useEffect } from "react"
import { Link } from "react-router-dom"
import { LuArrowRight, LuClipboardList, LuUtensils, LuUsers } from "react-icons/lu"
import adminOrdersService from "../../services/adminOrders"
import adminPlatesService from "../../services/adminPlates"
import adminUsersService from "../../services/adminUsers"
import layoutStyles from "./layout.module.css"
import styles from "./home.module.css"

export default function AdminHome() {
    const { orders, fetchOrders } = adminOrdersService()
    const { plates, fetchPlates } = adminPlatesService()
    const { users, fetchUsers } = adminUsersService()

    useEffect(() => {
        fetchOrders()
        fetchPlates()
        fetchUsers()
    }, [])

    const summaryCards = [
        { label: 'Pedidos', value: orders.length, to: '/admin/orders', icon: <LuClipboardList /> },
        { label: 'Pratos', value: plates.length, to: '/admin/plates', icon: <LuUtensils /> },
        { label: 'Usuários', value: users.length, to: '/admin/users', icon: <LuUsers /> },
    ]

    const latestOrders = orders.slice(0, 5)
    const featuredPlates = plates.slice(0, 5)
    const latestUsers = users.slice(0, 5)

    return (
        <div className={styles.homeContainer}>
            <div className={layoutStyles.cardsGrid}>
                {summaryCards.map((card) => (
                    <Link key={card.label} to={card.to} className={layoutStyles.card}>
                        <span className={layoutStyles.cardIcon}>{card.icon}</span>
                        <div>
                            <p>{card.label}</p>
                            <h2>{card.value}</h2>
                        </div>
                    </Link>
                ))}
            </div>

            <div className={styles.previewGrid}>
                <div className={styles.previewCard}>
                    <h3>Últimos pedidos</h3>
                    <ul className={styles.previewList}>
                        {latestOrders.map((order) => {
                            const customer = order.userDetails?.[0]
                            return (
                                <li key={order._id} className={styles.previewItem}>
                                    <span>{customer?.fullname || customer?.email}</span>
                                    <span>{order.pickupStatus}</span>
                                </li>
                            )
                        })}
                    </ul>
                    <Link to="/admin/orders" className={styles.seeMore}>
                        Ver todos <LuArrowRight />
                    </Link>
                </div>

                <div className={styles.previewCard}>
                    <h3>Pratos em destaque</h3>
                    <ul className={styles.previewList}>
                        {featuredPlates.map((plate) => (
                            <li key={plate._id} className={styles.previewItem}>
                                <span>{plate.name}</span>
                                <span>R$ {Number(plate.price).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <Link to="/admin/plates" className={styles.seeMore}>
                        Gerenciar pratos <LuArrowRight />
                    </Link>
                </div>

                <div className={styles.previewCard}>
                    <h3>Novos usuários</h3>
                    <ul className={styles.previewList}>
                        {latestUsers.map((user) => (
                            <li key={user._id} className={styles.previewItem}>
                                <span>{user.fullname}</span>
                                <span>{user.role || 'user'}</span>
                            </li>
                        ))}
                    </ul>
                    <Link to="/admin/users" className={styles.seeMore}>
                        Gerenciar usuários <LuArrowRight />
                    </Link>
                </div>
            </div>
        </div>
    )
}

