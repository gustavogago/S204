import styles from './footer.module.css'
import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className={styles.footerContainer}>
            <img src="/imgs/logo.png" alt="" />
            <div>
                <h2>Links importantes</h2>
                <div className={styles.linksContainer}>
                    <Link className={styles.link} to={'/'}>Início</Link>
                    <Link className={styles.link} to={'/plates'}>Pratos</Link>
                    <Link className={styles.link} to={'/profile'}>Perfil</Link>
                </div>
            </div>
        </footer>
    )
}
