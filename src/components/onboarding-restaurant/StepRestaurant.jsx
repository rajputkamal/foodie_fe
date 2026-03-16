import { useState, useRef } from "react";
import { useFormik } from "formik";

import Field from "../Field";
import { vegTypeOptions } from "../../constants";
import { validationSchema } from "../../validationSchema";
import Button from "../ui/Button";
import {createRestaurant} from "../../api/restaurantApi"

const StepRestaurant = ({ onNext }) => {
  const [loading, setLoading] = useState(false)
  const [logoPreview, setLogoPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      email: "",
      phone: "",
      vegType: "",
      logoFile: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true)
      const result = await createRestaurant(values)
      if(result.message && result.token) {
        onNext({ restaurant: values });
        setLoading(false)
      }
    },
  });

  const handleFileDrop = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    formik.setFieldValue("logoFile", file);
    const reader = new FileReader();
    reader.onload = (e) => setLogoPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    formik.setFieldValue("logoFile", null);
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      <div style={s.section}>
        <p style={s.sectionTitle}>Basic Information</p>
        <Field
          name="name"
          label="Restaurant Name"
          placeholder="e.g. Bloom Coffee"
          formik={formik}
        />
        <div style={s.row}>
          <div style={{ flex: 1 }}>
            <Field
              name="email"
              label="Email"
              type="email"
              placeholder="hello@example.com"
              formik={formik}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Field
              name="phone"
              label="Phone"
              type="tel"
              max={10}
              placeholder="+91 98765 43210"
              formik={formik}
            />
          </div>
        </div>
        <Field
          name="address"
          label="Address"
          placeholder="123 Main St, Koramangala, Bangalore - 560034"
          textarea
          formik={formik}
        />
      </div>

      <div style={s.divider} />

      <div style={s.section}>
        <p style={s.sectionTitle}>Menu Type</p>
        <div style={s.vegRow}>
          {vegTypeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => formik.setFieldValue("vegType", opt.value)}
              style={{
                ...s.vegBtn,
                ...(formik.values.vegType === opt.value ? s.vegBtnActive : {}),
              }}
            >
              <span>{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
        {formik.touched.vegType && formik.errors.vegType && (
          <span style={{ ...s.errorText, display: "block", marginTop: "8px" }}>
            {formik.errors.vegType}
          </span>
        )}
      </div>

      <div style={s.divider} />

      <div style={s.section}>
        <p style={s.sectionTitle}>
          Restaurant Logo <span style={s.optionalTag}>Optional</span>
        </p>
        <p style={s.sectionHint}>
          Square image, at least 256×256px. PNG or JPG.
        </p>

        {logoPreview ? (
          <div style={s.previewRow}>
            <img src={logoPreview} alt="preview" style={s.previewImg} />
            <div>
              <p
                style={{
                  fontSize: "13px",
                  color: "#374151",
                  fontWeight: 500,
                  marginBottom: "4px",
                }}
              >
                {formik.values.logoFile?.name}
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "#9ca3af",
                  marginBottom: "10px",
                }}
              >
                {(formik.values.logoFile?.size / 1024).toFixed(1)} KB
              </p>
              <Button title="Remove" onClick={removeLogo} />
            </div>
          </div>
        ) : (
          <div
            style={{ ...s.dropzone, ...(dragOver ? s.dropzoneActive : {}) }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFileDrop(e.dataTransfer.files[0]);
            }}
          >
            <div style={s.uploadIcon}>↑</div>
            <p style={s.dropzoneText}>
              <span style={{ color: "#2563eb", fontWeight: 500 }}>
                Click to upload
              </span>{" "}
              or drag and drop
            </p>
            <p style={s.dropzoneHint}>PNG, JPG up to 5MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleFileDrop(e.target.files[0])}
            />
          </div>
        )}
      </div>

      <div style={s.footerRow}>
        <Button
          primary
          title=" Save & Continue →"
          type="submit"
          disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
        />
      </div>
    </form>
  );
};

export default StepRestaurant;

const s = {
  section: { marginBottom: "8px" },

  sectionTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "6px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  sectionHint: {
    fontSize: "12px",
    color: "#9ca3af",
    marginBottom: "16px",
  },

  optionalTag: {
    fontSize: "11px",
    fontWeight: "400",
    color: "#9ca3af",
    background: "#f3f4f6",
    borderRadius: "4px",
    padding: "2px 7px",
  },

  divider: {
    height: "1px",
    background: "#f3f4f6",
    margin: "24px 0",
  },

  row: {
    display: "flex",
    gap: "16px",
  },

  vegRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "4px",
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

  errorText: {
    color: "#ef4444",
    fontSize: "12px",
  },

  dropzone: {
    border: "1.5px dashed #d1d5db",
    borderRadius: "10px",
    padding: "36px 24px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.15s",
    background: "#fafafa",
  },

  dropzoneActive: {
    border: "1.5px dashed #2563eb",
    background: "#eff6ff",
  },

  uploadIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    background: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "600",
    color: "#6b7280",
    margin: "0 auto 10px",
  },

  dropzoneText: {
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "4px",
  },

  dropzoneHint: {
    fontSize: "12px",
    color: "#9ca3af",
  },

  previewRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "16px",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    background: "#fafafa",
  },

  previewImg: {
    width: "64px",
    height: "64px",
    objectFit: "cover",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    flexShrink: 0,
  },

  removeBtn: {
    background: "none",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    padding: "5px 12px",
    fontSize: "12px",
    color: "#6b7280",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
  },

  footerRow: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: "20px",
    borderTop: "1px solid #f3f4f6",
  },
};
