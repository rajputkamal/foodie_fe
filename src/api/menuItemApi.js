// /v1/menu-items

import axiosInstance from "./axiosInstance";

export const attachMenuItemByCategory = async (payload) => {
  const res = await axiosInstance.post("/v1/menu-items", payload);
  return res.data;
};
