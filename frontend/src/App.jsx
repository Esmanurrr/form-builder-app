import React, { useState } from "react";
import { ReactFormBuilder, ReactFormGenerator } from "react-form-builder2";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-form-builder2/dist/app.css";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [formId, setFormId] = useState(null);
  const [schema, setSchema] = useState({ fields: [] });
  const [isPreview, setIsPreview] = useState(false);
  const [builderFields, setBuilderFields] = useState([]);

  const SUPPORTED = new Set([
    "Header",
    "Paragraph",
    "LineBreak",
    "Label",
    "TextInput",
    "TextArea",
    "NumberInput",
    "RadioButtons",
    "Checkboxes",
    "Dropdown",
    "DatePicker",
    "Signature",
    "Range",
    "Tags",
    "HyperLink",
    "Download",
    "Camera",
    "Image",
    "TwoColumnRow",
    "ThreeColumnRow",
  ]);

  const normalizeFields = (fields = []) =>
    fields
      .filter((f) => f && typeof f === "object" && SUPPORTED.has(f.element))
      .map((f, i) => {
        const key = f.key ?? `${f.element}_${i}_${Date.now()}`;
        const id = f.id ?? key;
        const field_name = f.field_name ?? `field_${i + 1}`;
        return { ...f, key, id, field_name };
      });

  const onSave = async (data) => {
    const cleanFields = normalizeFields(data);
    const schemaToSave = { fields: cleanFields };
    const body = {
      name: "<form name>",
      description: "<optional description>",
      schema: schemaToSave,
    };
    const res = await fetch(`${API_URL}/forms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error("Form kaydedilirken bir hata oluştu!");
    }
    const json = await res.json();
    console.log(json);
    setFormId(json.id);
    setSchema(schemaToSave);
    setBuilderFields(cleanFields);
  };

  const onLoad = async () => {
    try {
      const res = await fetch(`${API_URL}/forms`);
      if (!res.ok) return [];
      const json = await res.json();
      if (!Array.isArray(json) || json.length === 0) return [];
      const selected = json[json.length - 1];
      const cleanFields = normalizeFields(selected?.schema?.fields || []);
      const cleanSchema = { fields: cleanFields };
      setFormId(selected.id);
      setSchema(cleanSchema);
      setBuilderFields(cleanFields);
      return cleanFields;
    } catch {
      return [];
    }
  };

  const onSubmit = async (data) => {
    if (!formId) {
      console.warn("Önce formu kaydedin");
      return;
    }
    const res = await fetch(`${API_URL}/forms/${formId}/submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ submission_data: data }),
    });
    if (!res.ok) {
      throw new Error("Form gönderilirken bir hata oluştu!");
    }
    const json = await res.json();
    return json;
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Form Builder - Basit Versiyon</h1>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setIsPreview(!isPreview)}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: isPreview ? "#007bff" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {isPreview ? "Düzenle" : "Önizle"}
        </button>
      </div>
      {!isPreview ? (
        <div>
          <p>Sol taraftaki elementleri sürükleyip sağ tarafa bırakın</p>
          <div>
            <ReactFormBuilder
              onChange={(data) => setBuilderFields(data)}
              onLoad={onLoad}
              showDescription={true}
            />
            <div>
              <button
                onClick={() => onSave(builderFields)}
                className="btn btn-primary"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h3>Form Önizleme</h3>
          <div
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              borderRadius: "5px",
              backgroundColor: "#f9f9f9",
            }}
          >
            {(() => {
              const prepared = normalizeFields(schema?.fields);
              return prepared.length > 0 ? (
                <ReactFormGenerator
                  form_action="#"
                  form_method="POST"
                  task_id={12}
                  answer_data={[]}
                  data={prepared}
                  form_data={prepared}
                  back_action="#"
                  back_name="Geri"
                  submit_action="#"
                  submit_name="Gönder"
                  onSubmit={onSubmit}
                />
              ) : (
                <p>Önce bir form oluşturun!</p>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
