import { useEffect, useState } from "react";

import Table from "../components/Table";
import { getAllRestaurants } from "../api/restaurantApi";

const RESTAURANT_TABLE_HEADER = [
  { label: "Name", field: "name" },
  { label: "Address", field: "address" },
  { label: "Email", field: "email" },
  { label: "Phone", field: "phone" },
  { label: "Type", field: "vegType" },
  { label: "Status", field: "isActive", type: "status" },
];

const HomePage = () => {
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

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Restaurants</h2>

      <Table tableHead={RESTAURANT_TABLE_HEADER} tableBody={restaurants} />
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
