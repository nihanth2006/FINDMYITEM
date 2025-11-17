import React, { useState } from "react";

// Pages
import HomePage from "./Pages/HomePage";
import ItemsPage from "./Pages/ItemsPage";
import RaiseTicketPage from "./Pages/rise";
import RemoveItemPage from "./Pages/RemoveItemPage";
import DeliveredItemsPage from "./Pages/DeliveredItemsPage";
import AdminDashboard from "./Pages/AdminDashboard"; // ✅ Admin Page

import "./styles.css";

const App = () => {
  const [currentPage, setCurrentPage] = useState("home");

  // FOUND ITEMS (ItemsPage)
  const [foundItems, setFoundItems] = useState([
    {
      id: 1,
      name: "Blue Backpack",
      placeFound: "Library",
      location: "Security Office - Block A",
    },
    {
      id: 2,
      name: "Student ID Card",
      placeFound: "Cafeteria",
      location: "Admin Office",
    },
  ]);

  // LOST ITEMS (Raise Ticket Page)
  const [lostItems, setLostItems] = useState([
    {
      id: 1,
      name: "Laptop",
      placeLost: "Computer Lab",
      idNo: "2100031234",
      mobile: "9876543210",
      daysAgo: "2 days",
    },
    {
      id: 2,
      name: "Textbook",
      placeLost: "Classroom 305",
      idNo: "2100035678",
      mobile: "9876543211",
      daysAgo: "1 day",
    },
  ]);

  // HANDOVER ITEMS (Remove Item Page)
  const [itemsToHandover, setItemsToHandover] = useState([
    { id: 1, name: "Water Bottle", personName: "Rahul Kumar" },
  ]);

  // DELIVERED ITEMS PAGE
  const [deliveredItems, setDeliveredItems] = useState([
    {
      id: 1,
      name: "Mobile Phone",
      personName: "Priya Sharma",
      mobile: "9876543212",
    },
  ]);

  // DELIVER FUNCTION
  const handleDeliverItem = (id) => {
    const item = itemsToHandover.find((i) => i.id === id);
    setDeliveredItems([...deliveredItems, item]);
    setItemsToHandover(itemsToHandover.filter((i) => i.id !== id));

    setCurrentPage("delivered"); // Go to delivered page
  };

  return (
    <>
      {/* HOME PAGE */}
      {currentPage === "home" && <HomePage onNavigate={setCurrentPage} />}

      {/* ITEMS PAGE */}
      {currentPage === "items" && (
        <ItemsPage
          foundItems={foundItems}
          onRemoveFromFound={(id) =>
            setFoundItems(foundItems.filter((i) => i.id !== id))
          }
          onNavigate={setCurrentPage}
        />
      )}

      {/* RAISE TICKET PAGE */}
      {currentPage === "raise-ticket" && (
        <RaiseTicketPage
          lostItems={lostItems}
          onRemoveFromLost={(id) =>
            setLostItems(lostItems.filter((i) => i.id !== id))
          }
          onNavigate={setCurrentPage}
        />
      )}

      {/* REMOVE ITEM PAGE */}
      {currentPage === "remove-item" && (
        <RemoveItemPage
          itemsToHandover={itemsToHandover}
          onDeliverItem={handleDeliverItem}
          onNavigate={setCurrentPage}
        />
      )}

      {/* DELIVERED ITEMS PAGE */}
      {currentPage === "delivered" && (
        <DeliveredItemsPage
          deliveredItems={deliveredItems}
          onNavigate={setCurrentPage}
        />
      )}

      {/* ⭐ ADMIN DASHBOARD PAGE ⭐ */}
      {currentPage === "admin" && (
        <AdminDashboard onNavigate={setCurrentPage} />
      )}
    </>
  );
};

export default App;
