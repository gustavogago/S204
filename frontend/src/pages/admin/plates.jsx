import { useEffect, useState } from "react"
import { LuPlus, LuTrash2 } from "react-icons/lu"
import adminPlatesService from "../../services/adminPlates"
import commonStyles from "./common.module.css"
import styles from "./plates.module.css"

const CATEGORY_OPTIONS = ["Entrada", "Prato Principal", "Sobremesa"]

const defaultPlateForm = {
  name: "",
  price: "",
  category: CATEGORY_OPTIONS[0],
  description: "",
  imgUrl: "",
  available: true,
}

export default function AdminPlates() {
  const {
    plates,
    platesLoading,
    fetchPlates,
    createPlate,
    updatePlate,
    deletePlate,
  } = adminPlatesService()

  const [selectedPlate, setSelectedPlate] = useState(null)
  const [plateForm, setPlateForm] = useState(defaultPlateForm)
  const [imageFile, setImageFile] = useState(null)
  const [feedback, setFeedback] = useState("")
  const [mode, setMode] = useState("create") // 'create' | 'edit'

  useEffect(() => {
    fetchPlates()
  }, [])

  const handleSelectPlate = (plate) => {
    setSelectedPlate(plate)
    setMode("edit")
    setPlateForm({
      name: plate.name || "",
      price: plate.price || "",
      category: plate.category || CATEGORY_OPTIONS[0],
      description: plate.description || "",
      imgUrl: plate.imgUrl || "",
      available: plate.available ?? true,
    })
    setImageFile(null)
    setFeedback("")
  }

  const handleCreateMode = () => {
    setSelectedPlate(null)
    setMode("create")
    setPlateForm(defaultPlateForm)
    setImageFile(null)
    setFeedback("")
  }

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setPlateForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      ...plateForm,
      price: plateForm.price ? Number(plateForm.price) : 0,
    }

    let result
    if (mode === "create") {
      result = await createPlate(payload, imageFile)
    } else if (selectedPlate?._id) {
      result = await updatePlate(selectedPlate._id, payload, imageFile)
    }

    if (result?.success) {
      setFeedback(
        mode === "create"
          ? "Prato criado com sucesso!"
          : "Prato atualizado com sucesso!"
      )
      setImageFile(null)
      if (mode === "create") {
        setPlateForm(defaultPlateForm)
      }
    } else {
      setFeedback(result?.message || "Erro ao salvar prato.")
    }
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Deseja realmente remover este prato?")
    if (!confirmDelete) return

    const result = await deletePlate(id)
    if (result?.success) {
      setFeedback("Prato removido com sucesso!")
      if (selectedPlate?._id === id) {
        setSelectedPlate(null)
        setPlateForm(defaultPlateForm)
        setImageFile(null)
        setMode("create")
      }
    } else {
      setFeedback(result?.message || "Erro ao remover prato.")
    }
  }

  return (
    <div className={commonStyles.section}>
      {/* LISTA DE PRATOS */}
      <div className={commonStyles.tableWrapper}>
        <div className={commonStyles.tableHeader}>
          <div>
            <h2>Pratos</h2>
            <p>
              {plates.length} registros
              {platesLoading ? " (carregando...)" : ""}
            </p>
          </div>
          <div className={styles.actions}>
            <button
              className={styles.refreshButton}
              type="button"
              onClick={fetchPlates}
            >
              Atualizar
            </button>
            <button
              className={styles.newButton}
              type="button"
              onClick={handleCreateMode}
            >
              <LuPlus /> Novo prato
            </button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Imagem</th>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Preco</th>
              <th>Disponivel</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {plates.map((plate) => (
              <tr
                key={plate._id}
                onClick={() => handleSelectPlate(plate)}
                className={
                  selectedPlate?._id === plate._id
                    ? commonStyles.selectedRow
                    : ""
                }
              >
                <td>
                  {plate.imgUrl ? (
                    <img
                      src={plate.imgUrl}
                      alt={plate.name}
                      className={styles.plateThumb}
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td>{plate.name}</td>
                <td>{plate.category}</td>
                <td>R$ {Number(plate.price).toFixed(2)}</td>
                <td>{plate.available ? "Sim" : "Nao"}</td>
                <td>
                  <button
                    className={commonStyles.iconButton}
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation()
                        handleSelectPlate(plate)
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className={`${commonStyles.iconButton} ${commonStyles.deleteButton}`}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
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

      {/* FORMULARIO */}
      <div className={commonStyles.formPanel}>
        <h3>{mode === "create" ? "Novo prato" : "Editar prato"}</h3>
        {feedback ? (
          <p className={commonStyles.feedback}>{feedback}</p>
        ) : null}

        <form className={commonStyles.form} onSubmit={handleSubmit}>
          <label>
            Nome
            <input
              name="name"
              value={plateForm.name}
              onChange={handleFormChange}
              required
            />
          </label>

          <label>
            Preco
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
            <select
              name="category"
              value={plateForm.category}
              onChange={handleFormChange}
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label>
            Descricao
            <textarea
              name="description"
              value={plateForm.description}
              onChange={handleFormChange}
              rows={3}
            />
          </label>

          <label>
            Disponivel
            <input
              type="checkbox"
              name="available"
              checked={!!plateForm.available}
              onChange={handleFormChange}
            />
          </label>

          <label>
            Imagem do prato
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                setImageFile(file || null)
              }}
            />
          </label>

          <button type="submit">
            {mode === "create" ? "Adicionar prato" : "Atualizar prato"}
          </button>
        </form>
      </div>
    </div>
  )
}
