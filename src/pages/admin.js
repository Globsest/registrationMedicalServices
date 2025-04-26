"use client"

import Header from "../components/shared/Header"
import Footer from "../components/shared/Footer"
import "../styles/admin.css"

export default function AdminFormsPage() {
  return (
    <div className="admin-page">
      <Header />
      <main className="admin-main">
        <h1 className="admin-title">Админка</h1>
        <div className="admin-wrapper">
          {/* Левая панель: список форм */}
          <div className="forms-list">
            <h2 className="section-title">Список форм</h2>
            <ul className="form-items">
              <li className="form-item active">Форма записи к врачу</li>
              <li className="form-item">Форма получения справки</li>
              <li className="form-item">Форма обратной связи</li>
              {/* Здесь будут генерироваться остальные формы */}
            </ul>
          </div>

          {/* Правая панель: редактирование выбранной формы */}
          <div className="form-editor">
            <h2 className="section-title">Редактирование формы</h2>

            <div className="form-field">
              <label className="field-label">Название формы</label>
              <input 
                type="text" 
                className="field-input" 
                value="Форма записи к врачу" 
              />
            </div>

            <div className="form-fields-list">
              <h3 className="fields-title">Поля формы:</h3>

              <div className="form-field">
                <label className="field-label">Кто дал сваги</label>
                <input 
                  type="text" 
                  className="field-input" 
                  value="артём" 
                />
              </div>

              <div className="form-field">
                <label className="field-label">Что нужно ракать в 2к25</label>
                <input 
                  type="text" 
                  className="field-input" 
                  value="демикс" 
                />
              </div>

              <div className="form-field">
                <label className="field-label">Индекс</label>
                <input 
                  type="text" 
                  className="field-input" 
                  value="Индекс" 
                />
              </div>

              <div className="form-field">
                <label className="field-label">Номер телефона</label>
                <input 
                  type="text" 
                  className="field-input" 
                  value="Номер телефона" 
                />
              </div>

              <div className="form-field">
                <label className="field-label">Дата визита</label>
                <input 
                  type="text" 
                  className="field-input" 
                  value="Дата визита" 
                />
              </div>
            </div>

            <button className="save-button">Сохранить изменения</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
