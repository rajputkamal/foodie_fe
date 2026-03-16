import axiosInstance from "./axiosInstance";

/**
 * GET ALL CATEGORIES
 * GET /v1/categories
 */
export const getAllCategories = async () => {
  const res = await axiosInstance.get("/v1/categories");
  return res.data;
};

/**
 * CREATE CATEGORY (Admin)
 * POST /v1/admin/categories
 */
export const createCategory = async (payload) => {
  const res = await axiosInstance.post("/v1/admin/categories", payload);
  return res.data;
};

/**
 * UPDATE CATEGORY (Admin)
 * PATCH /v1/admin/categories/:id
 */
export const updateCategory = async (id, payload) => {
  const res = await axiosInstance.patch(`/v1/admin/categories/${id}`, payload);
  return res.data;
};

/**
 * DELETE CATEGORY (Admin)
 * DELETE /v1/admin/categories/:id
 */
export const deleteCategory = async (id) => {
  const res = await axiosInstance.delete(`/v1/admin/categories/${id}`);
  return res.data;
};
