import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Landing from "@/pages/Landing";
import Products from "@/pages/Products";
import StoreMap from "@/pages/StoreMap";
import Experience from "@/pages/Experience";
  import LoyaltyClub from "@/pages/LoyaltyClub";
  import PrebuiltLists from "@/pages/PrebuiltLists";
  import Promotions from "@/pages/Promotions";
  import ShoppingLists from "@/pages/ShoppingLists";
  import Layout from "@/components/Layout";
  import Login from "@/pages/Login";
  import Register from "@/pages/Register";

export default function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </Router>
  );
}
