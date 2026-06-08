import { useState } from "react";
import { MenuItemsTable } from "./MenuItemsTable";

const getMenuItems = async () => {
  return [
    { _id: "m1", name: "Cappuccino", price: 120 },
    { _id: "m2", name: "Latte", price: 150 },
  ];
};

export const CategoryRow = ({ category }) => {
  const [expanded, setExpanded] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const toggle = async () => {
    if (!expanded && !loaded) {
      const items = await getMenuItems(category._id);
      setMenuItems(items);
      setLoaded(true);
    }

    setExpanded(!expanded);
  };

  return (
    <div style={{ border: "1px solid #ddd", marginBottom: 10 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: 12,
          cursor: "pointer",
          background: "#f9fafb",
        }}
      >
        <div onClick={toggle}>
          {expanded ? "▼" : "▶"} {category.name}
        </div>

        <div>
          <button>Edit</button>
          <button style={{ marginLeft: 10, color: "red" }}>Delete</button>
        </div>
      </div>

      {expanded && <MenuItemsTable items={menuItems} />}
    </div>
  );
};
