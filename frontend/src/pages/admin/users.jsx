import { useEffect, useState } from "react"
import { LuRefreshCw, LuEdit3, LuTrash2 } from "react-icons/lu"
import adminUsersService from "../../services/adminUsers"
import commonStyles from "./common.module.css"
import styles from "./users.module.css"

const defaultUserForm = {
    fullname: '',
    email: '',
    role: 'user',
    phoneNumber: ''
}

export default function AdminUsers() {
    const { users, usersLoading, fetchUsers, updateUser, deleteUser } = adminUsersService()
    const [selectedUser, setSelectedUser] = useState(null)
    const [userForm, setUserForm] = useState(defaultUserForm)
    const [feedback, setFeedback] = useState('')

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleSelectUser = (user) => {
        setSelectedUser(user)
        setUserForm({
            fullname: user.fullname || '',
            email: user.email || '',
            role: user.role || 'user',
            phoneNumber: user.phoneNumber || ''
        })
        setFeedback('')
    }

    const handleFormChange = (e) => {
        const { name, value } = e.target
        setUserForm((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!selectedUser) return

        const result = await updateUser(selectedUser._id, userForm)
        if (result.success) {
            setFeedback('Usuário atualizado com sucesso!')
        } else {
            setFeedback(result.message || 'Erro ao atualizar usuário.')
        }
    }

    const handleDelete = async (userId) => {
        const result = await deleteUser(userId)
        if (result.success) {
            setFeedback('Usuário removido com sucesso!')
            if (selectedUser?._id === userId) {
                setSelectedUser(null)
                setUserForm(defaultUserForm)
            }
        } else {
            setFeedback(result.message || 'Erro ao remover usuário.')
        }
    }

    return (
        <div className={commonStyles.section}>
            <div className={commonStyles.tableWrapper}>
                <div className={commonStyles.tableHeader}>
                    <div>
                        <h2>Usuários</h2>
                        <p>{users.length} registros</p>
                    </div>
                    <div className={styles.actions}>
                        <button className={styles.refreshButton} onClick={fetchUsers}>
                            <LuRefreshCw /> Atualizar
                        </button>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Função</th>
                            <th>Email</th>
                            <th>Telefone</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr
                                key={user._id}
                                onClick={() => handleSelectUser(user)}
                                className={selectedUser?._id === user._id ? commonStyles.selectedRow : ''}
                            >
                                <td>{user.fullname}</td>
                                <td>{user.role || 'user'}</td>
                                <td>{user.email}</td>
                                <td>{user.phoneNumber || '-'}</td>
                                <td>
                                    <button
                                        className={commonStyles.iconButton}
                                        type="button"
                                        onClick={(event) => {
                                            event.stopPropagation()
                                            handleSelectUser(user)
                                        }}
                                    >
                                        <LuEdit3 />
                                    </button>
                                    <button
                                        className={`${commonStyles.iconButton} ${commonStyles.deleteButton}`}
                                        type="button"
                                        onClick={(event) => {
                                            event.stopPropagation()
                                            handleDelete(user._id)
                                        }}
                                    >
                                        <LuTrash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {!usersLoading && users.length === 0 ? (
                    <p className={styles.emptyState}>Nenhum usuário cadastrado.</p>
                ) : null}
            </div>

            <div className={commonStyles.formPanel}>
                <h3>Editar usuário</h3>
                {feedback ? <p className={commonStyles.feedback}>{feedback}</p> : null}
                {selectedUser ? (
                    <form className={commonStyles.form} onSubmit={handleSubmit}>
                        <label>
                            Nome
                            <input
                                name="fullname"
                                value={userForm.fullname}
                                onChange={handleFormChange}
                                required
                            />
                        </label>
                        <label>
                            Email
                            <input
                                type="email"
                                name="email"
                                value={userForm.email}
                                onChange={handleFormChange}
                                required
                            />
                        </label>
                        <label>
                            Função
                            <select name="role" value={userForm.role} onChange={handleFormChange}>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                        </label>
                        <label>
                            Telefone
                            <input
                                name="phoneNumber"
                                value={userForm.phoneNumber}
                                onChange={handleFormChange}
                            />
                        </label>
                        <button type="submit">
                            <LuEdit3 /> Atualizar usuário
                        </button>
                    </form>
                ) : (
                    <p>Selecione um usuário para editar.</p>
                )}
            </div>
        </div>
    )
}


