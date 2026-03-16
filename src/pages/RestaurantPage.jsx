import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CategoryRow } from "../components/restaurant-detail/CategoryRow";

const getCategories = async (restaurantId) => {
  return [
    { _id: "1", name: "Coffee" },
    { _id: "2", name: "Desserts" },
    { _id: "3", name: "Sandwiches" },
  ];
};

const RestaurantPage = () => {
  const { restaurantId } = useParams();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCategories(restaurantId);
      setCategories(data);
    };

    fetchData();
  }, [restaurantId]);

  return (
    <div style={{ padding: 20, color: "black" }}>
      <h2>Restaurant Categories</h2>

      {categories.map((cat) => (
        <CategoryRow key={cat._id} category={cat} />
      ))}
    </div>
  );
};

export default RestaurantPage;
