import React, { useState, useEffect, useCallback } from "react";

// Pages
import HomePage from "./Pages/HomePage";
import ItemsPage from "./Pages/ItemsPage";
import RaiseTicketPage from "./Pages/rise";
import RemoveItemPage from "./Pages/RemoveItemPage";
import DeliveredItemsPage from "./Pages/DeliveredItemsPage";
import AdminDashboard from "./Pages/AdminDashboard";
import AboutPage from "./Pages/AboutPage";
import LoginPage from "./Pages/LoginPage";
import AddFoundItemForm from "./Pages/AddFoundItemForm";
import RaiseTicketForm from "./Pages/RaiseTicketForm";
import AddHandoverForm from "./Pages/AddHandoverForm";

// API
import {
  authAPI,
  foundItemsAPI,
  lostItemsAPI,
  handoverAPI,
  deliveredAPI,
} from "./api";

import "./styles.css";

const App = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [loading, setLoading] = useState(false);

  // DATA STATE
  const [foundItems, setFoundItems] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [itemsToHandover, setItemsToHandover] = useState([]);
  const [deliveredItems, setDeliveredItems] = useState([]);

  // AUTH STATE
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminInfo, setAdminInfo] = useState(null);

  // ==================== FETCH DATA FROM API ====================
  const fetchFoundItems = useCallback(async () => {
    try {
      const data = await foundItemsAPI.getAll();
      setFoundItems(data);
    } catch {
      setFoundItems([]);
    }
  }, []);

  const fetchLostItems = useCallback(async () => {
    try {
      const data = await lostItemsAPI.getAll();
      setLostItems(data);
    } catch {
      setLostItems([]);
    }
  }, []);

  const fetchHandoverItems = useCallback(async () => {
    try {
      const data = await handoverAPI.getAll();
      setItemsToHandover(data);
    } catch {
      setItemsToHandover([]);
    }
  }, []);

  const fetchDeliveredItems = useCallback(async () => {
    try {
      const data = await deliveredAPI.getAll();
      setDeliveredItems(data);
    } catch {
      setDeliveredItems([]);
    }
  }, []);

  // Load all data on mount
  useEffect(() => {
    fetchFoundItems();
    fetchLostItems();
    fetchHandoverItems();
    fetchDeliveredItems();
  }, [fetchFoundItems, fetchLostItems, fetchHandoverItems, fetchDeliveredItems]);

  // Check for existing auth token
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      authAPI
        .verify()
        .then((data) => {
          setIsLoggedIn(true);
          setAdminInfo(data.admin);
        })
        .catch(() => {
          localStorage.removeItem("adminToken");
        });
    }
  }, []);

  // Refresh data when navigating to a page
  useEffect(() => {
    if (currentPage === "items") fetchFoundItems();
    if (currentPage === "raise-ticket") fetchLostItems();
    if (currentPage === "remove-item") fetchHandoverItems();
    if (currentPage === "delivered") fetchDeliveredItems();
    if (currentPage === "admin") {
      fetchFoundItems();
      fetchLostItems();
      fetchHandoverItems();
      fetchDeliveredItems();
    }
  }, [currentPage, fetchFoundItems, fetchLostItems, fetchHandoverItems, fetchDeliveredItems]);

  // ==================== AUTH HANDLERS ====================
  const handleLogin = async (username, password) => {
    const data = await authAPI.login(username, password);
    localStorage.setItem("adminToken", data.token);
    setIsLoggedIn(true);
    setAdminInfo(data.admin);
    setCurrentPage("admin");
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsLoggedIn(false);
    setAdminInfo(null);
    setCurrentPage("home");
  };

  // ==================== FOUND ITEMS HANDLERS ====================
  const handleAddFoundItem = async (formData) => {
    await foundItemsAPI.create(formData);
    await fetchFoundItems();
  };

  const handleRemoveFoundItem = async (id) => {
    await foundItemsAPI.delete(id);
    await fetchFoundItems();
  };

  // ==================== LOST ITEMS HANDLERS ====================
  const handleRaiseTicket = async (formData) => {
    await lostItemsAPI.create(formData);
    await fetchLostItems();
  };

  const handleRemoveLostItem = async (id) => {
    await lostItemsAPI.delete(id);
    await fetchLostItems();
  };

  // ==================== HANDOVER HANDLERS ====================
  const handleAddHandover = async (data) => {
    await handoverAPI.create(data);
    await fetchHandoverItems();
  };

  const handleDeliverItem = async (id) => {
    await handoverAPI.deliver(id);
    await fetchHandoverItems();
    await fetchDeliveredItems();
    setCurrentPage("delivered");
  };

  // ==================== NAVIGATION HANDLER ====================
  const handleNavigate = (page) => {
    // Redirect to login if accessing admin without auth
    if (page === "admin" && !isLoggedIn) {
      setCurrentPage("login");
      return;
    }
    setCurrentPage(page);
  };

  return (
    <>
      {/* HOME PAGE */}
      {currentPage === "home" && <HomePage onNavigate={handleNavigate} />}

      {/* ITEMS PAGE */}
      {currentPage === "items" && (
        <ItemsPage
          foundItems={foundItems}
          onRemoveFromFound={handleRemoveFoundItem}
          onNavigate={handleNavigate}
          loading={loading}
        />
      )}

      {/* ADD FOUND ITEM FORM */}
      {currentPage === "add-found-item" && (
        <AddFoundItemForm
          onNavigate={handleNavigate}
          onItemAdded={handleAddFoundItem}
        />
      )}

      {/* RAISE TICKET PAGE */}
      {currentPage === "raise-ticket" && (
        <RaiseTicketPage
          lostItems={lostItems}
          onRemoveFromLost={handleRemoveLostItem}
          onNavigate={handleNavigate}
          loading={loading}
        />
      )}

      {/* RAISE TICKET FORM */}
      {currentPage === "raise-ticket-form" && (
        <RaiseTicketForm
          onNavigate={handleNavigate}
          onTicketRaised={handleRaiseTicket}
        />
      )}

      {/* REMOVE ITEM PAGE */}
      {currentPage === "remove-item" && (
        <RemoveItemPage
          itemsToHandover={itemsToHandover}
          onDeliverItem={handleDeliverItem}
          onNavigate={handleNavigate}
          loading={loading}
        />
      )}

      {/* ADD HANDOVER FORM */}
      {currentPage === "add-handover" && (
        <AddHandoverForm
          onNavigate={handleNavigate}
          onHandoverAdded={handleAddHandover}
        />
      )}

      {/* DELIVERED ITEMS PAGE */}
      {currentPage === "delivered" && (
        <DeliveredItemsPage
          deliveredItems={deliveredItems}
          onNavigate={handleNavigate}
          loading={loading}
        />
      )}

      {/* LOGIN PAGE */}
      {currentPage === "login" && (
        <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />
      )}

      {/* ADMIN DASHBOARD */}
      {currentPage === "admin" && (
        <AdminDashboard
          onNavigate={handleNavigate}
          adminInfo={adminInfo}
          onLogout={handleLogout}
        />
      )}

      {/* ABOUT PAGE */}
      {currentPage === "about" && <AboutPage onNavigate={handleNavigate} />}
    </>
  );
};

export default App;
