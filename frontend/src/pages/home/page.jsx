import styles from './page.module.css'
import Dessert from '../../../public/imgs/homepage/dessert'
import NaturalFood from '../../../public/imgs/homepage/naturalFood'
import Vegetable from '../../../public/imgs/homepage/vegetable'
import { FaMapMarkerAlt, FaFacebookSquare, FaInstagram, FaWhatsapp } from "react-icons/fa"

export default function Home() {
    return (
        <div className={styles.pageContainer}>
            <section>
                <h1>Bem-vindo ao My Gastronomy.</h1>
                <p>
                    Olá e bem-vindo ao nosso canto culinário especial,
                    onde a tradição italiana dança com a criatividade moderna
                    para te entregar uma experiência gastronômica única.
                    Aqui, cada prato é um abraço de sabor,
                    pensado com amor e dedicação para tornar
                    cada dia seu mais especial.
                </p>
            </section>

            <section className={styles.foodSection}>
                <div>
                    <i><NaturalFood /></i>
                    <h4>Excelência no dia a dia</h4>
                    <p>
                        Conheça nossa seleção diária de pratos únicos para levar
                        um toque fresco e refinado à sua mesa.
                    </p>
                </div>
                <div>
                    <i><Vegetable /></i>
                    <h4>Ingredientes de primeira</h4>
                    <p>Selecionamos ingredientes excepcionais para garantir a máxima qualidade nos seus pratos favoritos.</p>
                </div>
                <div>
                    <i><Dessert /></i>
                    <h4>Sabor para todos</h4>
                    <p>Explore um mundo de sabores com nosso cardápio completo, feito para agradar toda a família, das entradas às sobremesas.</p>
                </div>
            </section>

            <section className={styles.contactSection}>
                <h1>Fique por dentro!</h1>
                <p>
                    Entre no mundo My Gastronomy nos seguindo nas redes.
                    Você vai acompanhar nossas criações, eventos especiais
                    e surpresas gourmet. Não perca nenhum sabor!
                </p>
                <div className={styles.socialButtonsContainer}>
                    <button className={styles.socialButton}><FaInstagram /> Instagram</button>
                    <button className={styles.socialButton}><FaFacebookSquare /> Facebook</button>
                    <button className={styles.socialButton}><FaWhatsapp /> Whatsapp</button>
                    <button className={styles.socialButton}><FaMapMarkerAlt />Localização</button>
                </div>
            </section>
        </div>
    )
}
