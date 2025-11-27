import { Dialog } from "@mui/material"
import styles from './platePopup.module.css'

export default function PlatePopup({ plateData, onClose, onAddToCart }) {

    return(
        <Dialog open={true} onClose={onClose}>
            <div className={styles.popupContainer}>
                <img src={plateData.imgUrl} alt="" />
                <div className={styles.popupContent}>
                    <h2>{plateData.name}</h2>
                    <p className={styles.categoryBadge}>{plateData.category || 'Categoria indisponivel'}</p>
                    <p>{plateData.description}</p>
                    <h2>$ {plateData.price}</h2>
                    <button onClick={() => { onAddToCart(plateData) }}>Adicionar ao carrinho</button>
                </div>
            </div>
        </Dialog>
    )
}
