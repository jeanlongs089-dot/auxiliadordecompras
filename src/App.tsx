import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
const Home = lazy(() => import("@/pages/Home"));
const Landing = lazy(() => import("@/pages/Landing"));
const Products = lazy(() => import("@/pages/Products"));
const StoreMap = lazy(() => import("@/pages/StoreMap"));
const Experience = lazy(() => import("@/pages/Experience"));
const LoyaltyClub = lazy(() => import("@/pages/LoyaltyClub"));
const PrebuiltLists = lazy(() => import("@/pages/PrebuiltLists"));
const Promotions = lazy(() => import("@/pages/Promotions"));
const ShoppingLists = lazy(() => import("@/pages/ShoppingLists"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const Scanner = lazy(() => import("@/pages/Scanner"));

export default function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Suspense fallback={<div className="py-20 text-center text-gray-500">Carregando…</div>}><Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<Home />} />
          <Route path="/produtos" element={<Products />} />
          <Route path="/mapa" element={<StoreMap />} />
          <Route path="/experiencia" element={<Experience />} />
          <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
          <Route path="/fidelidade" element={<LoyaltyClub />} />
          <Route path="/listas-pre-prontas" element={<PrebuiltLists />} />
          <Route path="/listas" element={<ShoppingLists />} />
          <Route path="/promocoes" element={<Promotions />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes></Suspense>
    </Router>
  );
}
