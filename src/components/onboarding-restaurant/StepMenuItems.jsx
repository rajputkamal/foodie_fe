import { useState, useEffect } from "react";
import { useFormik } from "formik";

import { menuItemSchema } from "../../validationSchema";
import Field from "../Field";
import MenuItemRow from "./MenuItemRow";
import Button from "../ui/Button";

import { getRestaurantDetails } from "../../api/restaurantApi";
import { attachMenuItemByCategory } from "../../api/menuItemApi";

const StepMenuItems = ({
  onBack,
  onFinish,
  restaurantId,
  restaurantName,
}) => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [formOpen, setFormOpen] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const getAttachedRestaurantCategories = async () => {
    const data = await getRestaurantDetails(restaurantId);
    setCategories(data.categories);
  };

  useEffect(() => {
    if (restaurantId) {
      getAttachedRestaurantCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formik = useFormik({
    initialValues: {
      categoryId: "",
      name: "",
      description: "",
      price: "",
      vegType: "",
    },
    validationSchema: menuItemSchema,
    onSubmit: async (values, { resetForm }) => {
      setSubmitting(true);
      const payload = {
        restaurantId,
        categoryId: values.categoryId,
        name: values.name,
        description: values.description,
        price: Number(values.price),
        vegType: values.vegType,
      };

      const result = await attachMenuItemByCategory(payload);
      setItems((prev) => [{ id: result.id, ...payload }, ...prev]);
      resetForm();
      setSubmitting(false);
      setFormOpen(false);
    },
  });
  return (
    <div>
      <div style={styles.accordion}>
        <button
          type="button"
          style={styles.accordionHeader}
          onClick={() => setFormOpen((o) => !o)}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={styles.plusIcon}>{formOpen ? "−" : "+"}</span>
            <span
              style={{ fontSize: "14px", fontWeight: 600, color: "#111827" }}
            >
              Add Menu Item
            </span>
          </div>
          <span style={{ fontSize: "12px", color: "#9ca3af" }}>
            {formOpen ? "Collapse" : "Expand"}
          </span>
        </button>

        {formOpen && (
          <div style={styles.accordionBody}>
            <form onSubmit={formik.handleSubmit} noValidate>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Restaurant</label>
                <div style={styles.readonlyField}>
                  <span style={{ fontSize: "13px", color: "#374151" }}>
                    {restaurantName}
                  </span>
                  <span style={styles.lockedBadge}>Auto-filled</span>
                </div>
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="categoryId">
                  Category
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formik.values.categoryId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{
                    ...styles.select,
                    ...(formik.touched.categoryId && formik.errors.categoryId
                      ? styles.selectError
                      : {}),
                  }}
                >
                  <option value="">Select a category...</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <span
                  style={{
                    ...styles.errorText,
                    visibility:
                      formik.touched.categoryId && formik.errors.categoryId
                        ? "visible"
                        : "hidden",
                  }}
                >
                  {formik.errors.categoryId || " "}
                </span>
              </div>

              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <Field
                    name="name"
                    label="Item Name"
                    placeholder="e.g. Cappuccino"
                    formik={formik}
                  />
                </div>
                <div style={{ width: "140px" }}>
                  <Field
                    name="price"
                    label="Price (Rs.)"
                    type="number"
                    placeholder="180"
                    formik={formik}
                  />
                </div>
              </div>

              <Field
                name="description"
                label="Description"
                placeholder="Short description..."
                textarea
                formik={formik}
              />

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Type</label>
                <div style={{ display: "flex", gap: "10px" }}>
                  {[
                    { value: "veg", label: "Veg" },
                    { value: "nonveg", label: "Non-Veg" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => formik.setFieldValue("vegType", opt.value)}
                      style={{
                        ...styles.vegBtn,
                        ...(formik.values.vegType === opt.value
                          ? styles.vegBtnActive
                          : {}),
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <span
                  style={{
                    ...styles.errorText,
                    visibility:
                      formik.touched.vegType && formik.errors.vegType
                        ? "visible"
                        : "hidden",
                  }}
                >
                  {formik.errors.vegType || " "}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "8px",
                }}
              >
                <Button
                  primary
                  title={submitting ? "Adding..." : "+ Add to Menu"}
                  disabled={submitting}
                  type="submit"
                />
              </div>
            </form>
          </div>
        )}
      </div>

      <div style={{ marginTop: "24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <p style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>
            Added Items
          </p>
          <span style={{ fontSize: "12px", color: "#9ca3af" }}>
            {items.length} item{items.length !== 1 ? "s" : ""}
          </span>
        </div>
        {items.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={{ fontSize: "28px" }}>🍽️</span>
            <p style={{ fontSize: "13px", color: "#9ca3af", marginTop: "8px" }}>
              No items added yet. Fill the form above to get started.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {items.map((item) => (
              <MenuItemRow key={item.id} item={item} categories={categories} />
            ))}
          </div>
        )}
      </div>

      <div style={styles.footerRow}>
        <Button title="Back" onClick={onBack} />
        <Button primary title="Finish Setup" onClick={onFinish} />
      </div>
    </div>
  );
};

export default StepMenuItems;

const styles = {
  accordion: {
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    overflow: "hidden",
  },
  accordionHeader: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 18px",
    background: "#fafafa",
    border: "none",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    borderBottom: "1px solid #e5e7eb",
  },
  accordionBody: {
    padding: "20px 18px",
    background: "#ffffff",
  },
  fieldGroup: { marginBottom: "18px" },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "6px",
  },
  select: {
    width: "100%",
    background: "#ffffff",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#111827",
    fontSize: "14px",
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
    appearance: "auto",
  },
  selectError: {
    borderColor: "#ef4444",
    boxShadow: "0 0 0 3px rgba(239,68,68,0.08)",
  },
  errorText: {
    color: "#ef4444",
    fontSize: "12px",
    marginTop: "5px",
    display: "block",
    minHeight: "16px",
  },
  readonlyField: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "10px 14px",
  },
  lockedBadge: {
    fontSize: "11px",
    color: "#9ca3af",
    background: "#f3f4f6",
    borderRadius: "4px",
    padding: "2px 7px",
  },
  plusIcon: {
    width: "22px",
    height: "22px",
    borderRadius: "6px",
    background: "#eff6ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "700",
    flexShrink: 0,
  },
  vegBtn: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "9px 18px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    color: "#374151",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    transition: "all 0.15s",
  },
  vegBtnActive: {
    border: "1.5px solid #2563eb",
    background: "#eff6ff",
    color: "#1d4ed8",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px",
    border: "1.5px dashed #e5e7eb",
    borderRadius: "10px",
    marginBottom: "16px",
  },
  footerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "32px",
    paddingTop: "20px",
    borderTop: "1px solid #f3f4f6",
  },
  ghostBtn: {
    background: "none",
    color: "#6b7280",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "11px 20px",
    fontSize: "14px",
    fontWeight: "500",
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
  },
  primaryBtn: {
    background: "#1d4ed8",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "11px 24px",
    fontSize: "14px",
    fontWeight: "600",
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
    transition: "background 0.15s",
    letterSpacing: "0.01em",
  },
};
