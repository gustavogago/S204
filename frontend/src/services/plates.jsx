import { useState } from "react"

export default function platesServices() {
    const [platesLoading, setPlatesLoading] = useState(false)
    const [refetchPlates, setRefetchPlates] = useState(true)
    const [platesList, setPlatesList] = useState([])

    const url = 'https://s204mgbackend.azurewebsites.net/plates'

    const getAvailablePlates = (userId) => {
        setPlatesLoading(true)
        
        fetch(`${url}/availables`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        })
        .then((response) => response.json())
        .then((result) => {
            if(result.success) {
                const sanitized = (result.body || []).map((plate) => ({
                    ...plate,
                    imgUrl: plate.imgUrl?.replace('http://localhost:3000', 'https://s204mgbackend.azurewebsites.net')
                }))
                setPlatesList(sanitized)
            } else {
                console.log(result)
            }
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
            setPlatesLoading(false)
            setRefetchPlates(false)
        })
    }

    return { getAvailablePlates, platesLoading, refetchPlates, platesList }
}
