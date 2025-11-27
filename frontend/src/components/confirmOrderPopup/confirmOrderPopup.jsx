import { Dialog } from "@mui/material"
import styles from './confirmOrderPopup.module.css'
import { useState } from "react"
import { TextField } from "@mui/material"
import { useNavigate } from "react-router-dom"

export default function ConfirmOrderPopup({ open, onClose, onConfirm }) {
    const [formData, setFormData] = useState(null)
    let authData = null
    try {
        const stored = localStorage.getItem('auth')
        authData = stored ? JSON.parse(stored) : null
    } catch (e) {
        console.error('Erro ao ler auth do localStorage:', e)
        authData = null
    }

    const navigate = useNavigate()

    const handleConfirm = (e) => {
        e.preventDefault()

        if(!authData?.user?._id) {
            return navigate('/auth')
        } else {
            if(!formData?.pickupTime) {
                return 
            } else {
                const orderData = {
                    userId: authData?.user?._id,
                    pickupTime: formData?.pickupTime
                }

                // console.log(orderData)
                onConfirm(orderData)
            }
        }
    }

    const handleFormDataChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return(
        <Dialog open={open} onClose={onClose}>
            <div className={styles.popupContainer}>
                <div className={styles.header}>
                    <h2>Quase lá...</h2>
                    <span>{(new Date()).toLocaleDateString()}</span>
                </div>
                <p>Escolha o horário de retirada para agendarmos seu pedido.</p>
                <form className={styles.formContainer}>
                    <TextField
                    onChange={handleFormDataChange}
                    required
                    type="time"
                    name='pickupTime'
                    />
                    <div className={styles.confirmBtns}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
                        <button type="button" className={styles.confirmBtn} onClick={handleConfirm}>Confirmar</button>
                    </div>
                </form>
            </div>
        </Dialog>
    )
}
