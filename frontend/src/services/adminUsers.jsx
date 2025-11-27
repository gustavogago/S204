import { useState } from "react"

const url = 'http://localhost:3000/admin/users'

export default function adminUsersService() {
    const [users, setUsers] = useState([])
    const [usersLoading, setUsersLoading] = useState(false)

    const sanitizeUsers = (list = []) =>
        list.map(({ password, salt, ...rest }) => rest)

    const fetchUsers = () => {
        setUsersLoading(true)

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
                    setUsers(sanitizeUsers(result.body || []))
                }
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                setUsersLoading(false)
            })
    }

    const updateUser = async (userId, payload) => {
        try {
            const response = await fetch(`${url}/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(payload)
            })
            const result = await response.json()

            if (!result.success) {
                throw new Error(result.body?.text || 'Não foi possível atualizar o usuário.')
            }

            setUsers((prev) =>
                prev.map((user) =>
                    user._id === userId
                        ? { ...user, ...payload }
                        : user
                )
            )

            return { success: true }
        } catch (error) {
            return { success: false, message: error.message }
        }
    }

    const deleteUser = async (userId) => {
        try {
            const response = await fetch(`${url}/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            })
            const result = await response.json()

            if (!result.success) {
                throw new Error(result.body?.text || 'Não foi possível remover o usuário.')
            }

            setUsers((prev) => prev.filter((user) => user._id !== userId))
            return { success: true }
        } catch (error) {
            return { success: false, message: error.message }
        }
    }

    return { users, usersLoading, fetchUsers, updateUser, deleteUser }
}


