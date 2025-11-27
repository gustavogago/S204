import platesServices from "../../services/plates"
import { useEffect, useMemo, useState } from "react"
import Loading from "../loading/page"
import PlateCard from "../../components/plateCard/plateCard"
import styles from './page.module.css'
import PlatePopup from "../../components/platePopup/platePopup"
import { useCartContext } from "../../contexts/useCartContext"

const CATEGORY_GROUPS = [
    { key: 'entradas', label: 'Entradas', match: ['entrada', 'appetizer', 'starter', 'side', 'other'] },
    { key: 'principais', label: 'Pratos principais', match: ['prato principal', 'first', 'second', 'main'] },
    { key: 'sobremesas', label: 'Sobremesas', match: ['sobremesa', 'dessert', 'sweet'] },
]

export default function Plates() {

    const { getAvailablePlates, platesList, platesLoading, refetchPlates } = platesServices()
    const [plateSelected, setPlateSelected] = useState(null)
    const { addToCart } = useCartContext()


    useEffect(() => {
        if(refetchPlates) {
            getAvailablePlates()
        }
    }, [refetchPlates])

    const handlePlateSelected = (plate) => {
        setPlateSelected(plate)
    }

    const handleClosePopup = () => {
        setPlateSelected(null)
    }

    const handleAddToCart = (itemToAdd) => {
        addToCart(itemToAdd)
        handleClosePopup()
    }

    const groupedPlates = useMemo(() => {
        const initialGroups = CATEGORY_GROUPS.reduce((acc, { key }) => {
            acc[key] = []
            return acc
        }, {})

        const resolveCategoryKey = (category) => {
            const normalized = (category || '').toLowerCase().trim()
            const match = CATEGORY_GROUPS.find(group => group.match.some(term => normalized.includes(term)))
            return match ? match.key : 'entradas'
        }

        platesList.forEach((plate) => {
            const key = resolveCategoryKey(plate.category)
            initialGroups[key].push(plate)
        })

        return initialGroups
    }, [platesList])

    if(platesLoading) {
        return( <Loading /> )
    }

    return (
        <div className={styles.page}>
            <div className={styles.sections}>
                {CATEGORY_GROUPS.map((group) => (
                    <section key={group.key} className={styles.section}>
                        <header className={styles.sectionHeader}>
                            <h2>{group.label}</h2>
                            <span className={styles.count}>{groupedPlates[group.key].length} itens</span>
                        </header>
                        <div className={styles.cardsGrid}>
                            {groupedPlates[group.key].length === 0 ? (
                                <p className={styles.emptyText}>Nenhum prato nesta categoria.</p>
                            ) : (
                                groupedPlates[group.key].map((plate) => (
                                    <div key={plate._id} className={styles.cardContainer} onClick={() => { handlePlateSelected(plate) }}>
                                        <PlateCard plateData={plate} />
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                ))}
            </div>

            {plateSelected && (
                <PlatePopup 
                plateData={plateSelected} 
                onClose={handleClosePopup} 
                onAddToCart={handleAddToCart}
                />
            )}
        </div>
    )
}
