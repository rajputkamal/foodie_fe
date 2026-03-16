import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";

import Table from "../components/Table";
import { getAllRestaurants } from "../api/restaurantApi";

const RESTAURANT_TABLE_HEADER = [
  { label: "Name", field: "name" },
  { label: "Address", field: "address" },
  { label: "Email", field: "email" },
  { label: "Phone", field: "phone" },
  { label: "Type", field: "vegType" },
  { label: "Status", field: "isActive", type: "status" },
  { label: "Actions", field: "actions" },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);

  const fetchRestaurants = async () => {
    try {
      const res = await getAllRestaurants();
      setRestaurants(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRestaurants();
  }, []);

  const tableData = restaurants.map((res) => ({
    ...res,
    actions: (
      <div style={{ display: "flex", gap: "10px" }}>
        <Eye
          size={16}
          color="rgb(37, 99, 235)"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(`/restaurant/${res._id}`)}
        />
      </div>
    ),
  }));

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Restaurants</h2>

      <Table tableHead={RESTAURANT_TABLE_HEADER} tableBody={tableData} />
    </div>
  );
};

export default HomePage;

const styles = {
  container: {
    padding: "24px",
    fontFamily: "'Inter', sans-serif",
  },
  title: {
    fontSize: "20px",
    fontWeight: 600,
    marginBottom: "20px",
    color: "#111827",
  },
};
