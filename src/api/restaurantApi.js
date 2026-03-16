import axiosInstance from "./axiosInstance";

/**
 * GET ALL RESTAURANTS
 * GET /restaurants
 */
export const getAllRestaurants = async () => {
  const res = await axiosInstance.get("/restaurants");
  return res.data;
};

/**
 * CREATE RESTAURANT
 * POST /v1/restaurants
 */
export const createRestaurant = async (payload) => {
  const res = await axiosInstance.post("/v1/restaurants", payload);
  return res.data;
};

/**
 * GET RESTAURANT DETAILS
 * GET /v1/restaurants/:restaurantId
 */
export const getRestaurantDetails = async (restaurantId, table) => {
  const res = await axiosInstance.get(`/v1/restaurants/${restaurantId}`, {
    params: { table },
  });
  return res.data;
};

/**
 * GET MENU ITEMS BY CATEGORY
 * GET /v1/restaurants/:restaurantId/:categoryId
 */
export const getMenuItemsByCategory = async (restaurantId, categoryId) => {
  const res = await axiosInstance.get(
    `/v1/restaurants/${restaurantId}/${categoryId}`
  );
  return res.data;
};

/**
 * ATTACH CATEGORIES TO RESTAURANT
 * POST /v1/restaurants/:restaurantId/categories
 */
export const attachCategories = async (restaurantId, categoryIds) => {
  const res = await axiosInstance.post(
    `/v1/restaurants/${restaurantId}/categories`,
    {
      categoryIds,
    }
  );

  return res.data;
};
