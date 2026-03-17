// /v1/menu-items

import axiosInstance from "./axiosInstance";

export const attachMenuItemByCategory = async (payload) => {
  const res = await axiosInstance.post("/v1/menu-items", payload);
  return res.data;
};

export const searchMenuItems = async (restaurantId, query) => {
  const res = await axiosInstance.get(
    `/v1/menu-items/search?restaurantId=${restaurantId}&q=${query}`,
  );
  return res.data.data;
};
