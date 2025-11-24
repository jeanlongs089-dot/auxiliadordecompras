import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ShoppingLists from './pages/ShoppingLists'
import Products from './pages/Products'
import StoreMap from './pages/StoreMap'
import Admin from './pages/Admin'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/listas" element={<ShoppingLists />} />
              <Route path="/produtos" element={<Products />} />
              <Route path="/mapa" element={<StoreMap />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </Layout>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App