import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useEffect, useMemo } from "react"
import {
    LuClipboardList,
    LuUtensils,
    LuUsers,
    LuUserCog
} from "react-icons/lu"
import styles from "./layout.module.css"

const navItems = [
    { to: '/admin/orders', label: 'Orders', icon: <LuClipboardList /> },
    { to: '/admin/plates', label: 'Plates', icon: <LuUtensils /> },
    { to: '/admin/users', label: 'Users', icon: <LuUsers /> },
    { to: '/profile', label: 'Profile', icon: <LuUserCog /> },
]

export default function AdminLayout() {
    const navigate = useNavigate()
    const authData = useMemo(() => {
    try {
        const stored = localStorage.getItem('auth')
        return stored ? JSON.parse(stored) : null
        } catch (e) {
        console.error('Erro ao ler auth do localStorage:', e)
        return null
        }
    }, [])


    useEffect(() => {
        if (!authData) {
            navigate('/auth')
            return
        }

        if (authData?.user?.role !== 'admin') {
            navigate('/')
        }
    }, [authData, navigate])

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <img src="/imgs/logo.png" alt="My Gastronomy" className={styles.logo} />
                <nav className={styles.nav}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>

            <section className={styles.content}>
                <header className={styles.header}>
                    <div>
                        <p>Olá, {authData?.user?.fullname || 'admin'}!</p>
                        <h1>Painel Administrativo</h1>
                    </div>
                </header>
                <Outlet context={{ authData }} />
            </section>
        </div>
    )
}

