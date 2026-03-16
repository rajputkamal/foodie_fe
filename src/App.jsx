import { Routes, Route } from "react-router-dom";

import RestaurantOnboarding from "./pages/RestaurantOnboarding";
import AdminLayout from "./pages/AdminLayout";
import HomePage from "./pages/HomePage";
import CategoriesPage from "./pages/CategoriesPage";
import RestaurantChatPage from "./pages/RestaurantChatPage";

function App() {
  return (
    <Routes>

      {/* Admin Dashboard Routes */}
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/onboard" element={<RestaurantOnboarding />} />
        <Route path="/category" element={<CategoriesPage />} />
      </Route>

      {/* Public Restaurant Page (NO ADMIN LAYOUT) */}
      <Route path="/restaurant/:restaurantId/:tableNo" element={<RestaurantChatPage />} />

    </Routes>
  );
}

export default App;
