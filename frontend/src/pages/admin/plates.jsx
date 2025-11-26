import { useEffect, useState } from "react"
import { LuPlus, LuTrash2, LuEdit3 } from "react-icons/lu"
import adminPlatesService from "../../services/adminPlates"
import commonStyles from "./common.module.css"
import styles from "./plates.module.css"

const defaultPlateForm = {
    name: '',
    price: '',
    category: '',
    description: '',
    imgUrl: '',
    available: true
}

export default function AdminPlates() {
    const { plates, platesLoading, fetchPlates, createPlate, updatePlate, deletePlate } = adminPlatesService()
    const [selectedPlate, setSelectedPlate] = useState(null)
    const [mode, setMode] = useState('create')
    const [plateForm, setPlateForm] = useState(defaultPlateForm)
    const [feedback, setFeedback] = useState('')

    useEffect(() => {
        fetchPlates()
    }, [])

    const handleSelectPlate = (plate) => {
        setSelectedPlate(plate)
        setMode('edit')
        setPlateForm({
            name: plate.name || '',
            price: plate.price || '',
            category: plate.category || '',
            description: plate.description || '',
            imgUrl: plate.imgUrl || '',
            available: plate.available ?? true
        })
        setFeedback('')
    }

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target
        setPlateForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleCreateMode = () => {
        setSelectedPlate(null)
        setMode('create')
        setPlateForm(defaultPlateForm)
        setFeedback('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const payload = {
            ...plateForm,
            price: plateForm.price ? Number(plateForm.price) : 0
        }

        let result
        if (mode === 'create') {
            result = await createPlate(payload)
        } else if (selectedPlate?._id) {
            result = await updatePlate(selectedPlate._id, payload)
        }

        if (result?.success) {
            setFeedback(mode === 'create' ? 'Prato criado com sucesso!' : 'Prato atualizado com sucesso!')
            if (mode === 'create') {
                setPlateForm(defaultPlateForm)
            }
        } else {
            setFeedback(result?.message || 'Erro ao salvar prato.')
        }
    }

    const handleDelete = async (plateId) => {
        const result = await deletePlate(plateId)
        if (result.success) {
            setFeedback('Prato removido com sucesso!')
            if (selectedPlate?._id === plateId) {
                handleCreateMode()
            }
        } else {
            setFeedback(result.message || 'Erro ao remover prato.')
        }
    }

    return (
        <div className={commonStyles.section}>
            <div className={commonStyles.tableWrapper}>
                <div className={commonStyles.tableHeader}>
                    <div>
                        <h2>Pratos</h2>
                        <p>{plates.length} registros</p>
                    </div>
                    <div className={styles.actions}>
                        <button className={styles.addButton} onClick={handleCreateMode}>
                            <LuPlus /> Novo prato
                        </button>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Preview</th>
                            <th>Prato</th>
                            <th>Disponível</th>
                            <th>Categoria</th>
                            <th>Preço</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plates.map((plate) => (
                            <tr
                                key={plate._id}
                                onClick={() => handleSelectPlate(plate)}
                                className={selectedPlate?._id === plate._id ? commonStyles.selectedRow : ''}
                            >
                                <td>
                                    <img src={plate.imgUrl} alt={plate.name} className={commonStyles.platePreview} />
                                </td>
                                <td>{plate.name}</td>
                                <td>{plate.available ? 'Sim' : 'Não'}</td>
                                <td>{plate.category}</td>
                                <td>R$ {Number(plate.price).toFixed(2)}</td>
                                <td>
                                    <button
                                        className={commonStyles.iconButton}
                                        type="button"
                                        onClick={(event) => {
                                            event.stopPropagation()
                                            handleSelectPlate(plate)
                                        }}
                                    >
                                        <LuEdit3 />
                                    </button>
                                    <button
                                        className={`${commonStyles.iconButton} ${commonStyles.deleteButton}`}
                                        type="button"
                                        onClick={(event) => {
                                            event.stopPropagation()
                                            handleDelete(plate._id)
                                        }}
                                    >
                                        <LuTrash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {!platesLoading && plates.length === 0 ? (
                    <p className={styles.emptyState}>Nenhum prato cadastrado.</p>
                ) : null}
            </div>

            <div className={commonStyles.formPanel}>
                <h3>{mode === 'create' ? 'Novo prato' : 'Editar prato'}</h3>
                {feedback ? <p className={commonStyles.feedback}>{feedback}</p> : null}
                <form className={commonStyles.form} onSubmit={handleSubmit}>
                    <label>
                        Nome
                        <input name="name" value={plateForm.name} onChange={handleFormChange} required />
                    </label>
                    <label>
                        Preço
                        <input
                            type="number"
                            step="0.01"
                            name="price"
                            value={plateForm.price}
                            onChange={handleFormChange}
                            required
                        />
                    </label>
                    <label>
                        Categoria
                        <input name="category" value={plateForm.category} onChange={handleFormChange} required />
                    </label>
                    <label>
                        Descrição
                        <textarea
                            name="description"
                            value={plateForm.description}
                            onChange={handleFormChange}
                            rows={4}
                            required
                        />
                    </label>
                    <label>
                        URL da imagem
                        <input name="imgUrl" value={plateForm.imgUrl} onChange={handleFormChange} required />
                    </label>
                    <label className={commonStyles.checkboxField}>
                        <input
                            type="checkbox"
                            name="available"
                            checked={plateForm.available}
                            onChange={handleFormChange}
                        />
                        Disponível para os clientes
                    </label>
                    <div className={styles.formActions}>
                        <button type="submit">
                            {mode === 'create' ? <LuPlus /> : <LuEdit3 />}
                            {mode === 'create' ? 'Adicionar prato' : 'Atualizar prato'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}


