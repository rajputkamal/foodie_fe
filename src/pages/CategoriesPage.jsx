import { useEffect, useState } from "react";
import { CirclePlus, Pencil, Trash2 } from "lucide-react";

import Table from "../components/Table";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/categoryApi";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchCategories = async () => {
    const data = await getAllCategories();
    setCategories(data);
  };

  const handleCreate = async (name) => {
    await createCategory({ name });
    fetchCategories();
  };

  const handleUpdate = async () => {
    await updateCategory(editingId, { name });
    setEditingId(null);
    setName("");
    setShowForm(false);
    fetchCategories();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    await deleteCategory(id);
    fetchCategories();
  };

  const handleEdit = (category) => {
    setName(category.name);
    setEditingId(category._id);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      handleUpdate();
    } else {
      handleCreate(name);
    }

    setName("");
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories();
  }, []);

  const tableData = categories.map((cat) => ({
    ...cat,
    actions: (
      <div style={{ display: "flex", gap: "10px" }}>
        <Pencil
          size={16}
          style={{ cursor: "pointer" }}
          onClick={() => handleEdit(cat)}
        />

        <Trash2
          size={16}
          style={{ cursor: "pointer", color: "red" }}
          onClick={() => handleDelete(cat._id)}
        />
      </div>
    ),
  }));

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Categories</h2>

        <button style={styles.button} onClick={() => setShowForm((s) => !s)}>
          <CirclePlus size={14} />
          Insert New Category
        </button>
      </div>

      {showForm && (
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Category Name</label>
            <input
              type="text"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <button style={styles.submit}>
            {editingId ? "Update Category" : "Save Category"}
          </button>
        </form>
      )}

      <Table
        tableHead={[
            { label: "Category ID", field: "_id" },
          { label: "Category Name", field: "name" },
          { label: "Created At", field: "createdAt", type: "date" },
          { label: "Actions", field: "actions" },
        ]}
        tableBody={tableData}
      />
    </div>
  );
};

export default CategoriesPage;

const styles = {
  container: {
    padding: "24px",
    fontFamily: "'Inter', sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  title: {
    fontSize: "20px",
    fontWeight: 600,
  },

  button: {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
    alignItems: "center",
   background:
      "linear-gradient(135deg, rgb(37, 99, 235) 0%, rgb(79, 70, 229) 100%)",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "100px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
  },

  form: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "20px",
    maxWidth: "400px",
  },

  formGroup: {
    marginBottom: "12px",
  },

  label: {
    display: "block",
    fontSize: "13px",
    marginBottom: "4px",
    color: "#374151",
  },

  input: {
    width: "100%",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    background: "rgb(255, 255, 255)",
    color: "#374151",
  },

  submit: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
