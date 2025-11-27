import { useState } from "react"

const url = 'https://s204mgbackend.azurewebsites.net/admin/plates'

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
                    // Nao coloca Content-Type aqui; o browser define o boundary
                    'Access-Control-Allow-Origin': '*'
                },
                body: formData
            })

            const result = await response.json()

            if (!result.success) {
                throw new Error(result.body?.text || 'Nao foi possivel criar o prato.')
            }

            fetchPlates()
            return { success: true }
        } catch (error) {
            return { success: false, message: error.message }
        }
    }

    const updatePlate = async (plateId, payload, imageFile) => {
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

            const response = await fetch(`${url}/${plateId}`, {
                method: 'PUT',
                headers: {
                    // multipart: deixe o browser definir o boundary
                    'Access-Control-Allow-Origin': '*'
                },
                body: formData
            })
            const result = await response.json()

            if (!result.success) {
                throw new Error(result.body?.text || 'Nao foi possivel atualizar o prato.')
            }

            // recarrega para refletir imagem nova e demais campos
            fetchPlates()

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
                throw new Error(result.body?.text || 'Nao foi possivel remover o prato.')
            }

            setPlates((prev) => prev.filter((plate) => plate._id !== plateId))
            return { success: true }
        } catch (error) {
            return { success: false, message: error.message }
        }
    }

    return { plates, platesLoading, fetchPlates, createPlate, updatePlate, deletePlate }
}
