import React, { useState } from "react";
import "../../styles/HomePage.css";

const DynamicForm = ({ service, onClose }) => {
  const [formData, setFormData] = useState({});

  // Обработчик изменения полей формы
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Данные формы:", formData);
    alert("Форма успешно отправлена!");
    onClose();
  };

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>Заполните данные для услуги: {service.name}</h2>
        <form className="formmod" onSubmit={handleSubmit}>
          {service.fields.map((field) => (
            <div key={field} className="formField">
              <label>{field}:</label>
              <input
                type="text"
                value={formData[field] || ""}
                onChange={(e) => handleInputChange(field, e.target.value)}
                required
              />
            </div>
          ))}
          <div className="formActions">
            <button type="submit">Отправить</button>
            <button type="button" onClick={onClose}>
              Закрыть
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DynamicForm;