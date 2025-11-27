import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createHashRouter, RouterProvider } from 'react-router-dom'

import Home from './pages/home/page.jsx'
import Cart from './pages/cart/page.jsx'
import Profile from './pages/profile/page.jsx'
import Plates from './pages/plates/page.jsx'
import Auth from './pages/auth/page.jsx'
import AdminLayout from './pages/admin/layout.jsx'
import AdminHome from './pages/admin/home.jsx'
import AdminOrders from './pages/admin/orders.jsx'
import AdminPlates from './pages/admin/plates.jsx'
import AdminUsers from './pages/admin/users.jsx'

const pages = createHashRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: '/', element: <Home /> },
            { path: '/cart', element: <Cart /> },
            { path: '/profile', element: <Profile /> },
            { path: '/plates', element: <Plates /> },
            { path: '/auth', element: <Auth /> },
            {
                path: '/admin',
                element: <AdminLayout />,
                children: [
                    { index: true, element: <AdminHome /> },
                    { path: 'orders', element: <AdminOrders /> },
                    { path: 'plates', element: <AdminPlates /> },
                    { path: 'users', element: <AdminUsers /> },
                ]
            },
        ]
    }
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={pages}></RouterProvider>
    </React.StrictMode>,
)
