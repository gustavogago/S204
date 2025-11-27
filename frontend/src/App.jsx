import Navbar from "./components/navbar/navbar"
import { Outlet, useLocation } from "react-router-dom"
import Footer from "./components/footer/footer"
import { CartProvider } from "./contexts/useCartContext"

export default function App() {
	const location = useLocation()
	const isFullWidthLayout = location.pathname.startsWith('/admin')

	return (
		<CartProvider>
			<Navbar />
			<main className={isFullWidthLayout ? 'fullWidth' : ''}>
				<Outlet />
			</main>
			<Footer />
		</CartProvider>
	)
}
