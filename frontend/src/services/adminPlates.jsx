import { useState } from "react"

const url = 'http://localhost:3000/admin/plates'

export default function adminPlatesService() {
    const [plates, setPlates] = useState([])
    const [platesLoading, setPlatesLoading] = useState(false)

    const fetchPlates = () => {
        setPlatesLoading(true)

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.success) {
                    setPlates(result.body || [])
                }
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                setPlatesLoading(false)
            })
    }

        const createPlate = async (payload, imageFile) => {
        try {
            const formData = new FormData()
            formData.append('name', payload.name)
            formData.append('price', payload.price)
            formData.append('category', payload.category)
            formData.append('description', payload.description)
            formData.append('available', payload.available)

            
            if (payload.imgUrl) {
                formData.append('imgUrl', payload.imgUrl)
            }

            if (imageFile) {
                formData.append('image', imageFile) 
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    // NÃO coloca 'Content-Type' aqui, o browser define o boundary
                    'Access-Control-Allow-Origin': '*'
                },
                body: formData
            })

            const result = await response.json()

            if (!result.success) {
                throw new Error(result.body?.text || 'Não foi possível criar o prato.')
            }

            fetchPlates()
            return { success: true }
        } catch (error) {
            return { success: false, message: error.message }
        }
    }


    const updatePlate = async (plateId, payload) => {
        try {
            const response = await fetch(`${url}/${plateId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(payload)
            })
            const result = await response.json()

            if (!result.success) {
                throw new Error(result.body?.text || 'Não foi possível atualizar o prato.')
            }

            setPlates((prev) =>
                prev.map((plate) =>
                    plate._id === plateId
                        ? { ...plate, ...payload }
                        : plate
                )
            )

            return { success: true }
        } catch (error) {
            return { success: false, message: error.message }
        }
    }

    const deletePlate = async (plateId) => {
        try {
            const response = await fetch(`${url}/${plateId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            })
            const result = await response.json()

            if (!result.success) {
                throw new Error(result.body?.text || 'Não foi possível remover o prato.')
            }

            setPlates((prev) => prev.filter((plate) => plate._id !== plateId))
            return { success: true }
        } catch (error) {
            return { success: false, message: error.message }
        }
    }

    return { plates, platesLoading, fetchPlates, createPlate, updatePlate, deletePlate }
}


