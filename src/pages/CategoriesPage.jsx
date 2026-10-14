import { useEffect, useState } from 'react';
import {
  listCategoriesRequest,
  createCategoryRequest,
  deleteCategoryRequest,
} from '../api/categories';
import { extractErrorMessage } from '../api/client';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', color: '#6c757d' });
  const [error, setError] = useState('');

  useEffect(() => {
    listCategoriesRequest().then(setCategories).catch((err) => setError(extractErrorMessage(err)));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const category = await createCategoryRequest(form);
      setCategories((prev) => [...prev, category].sort((a, b) => a.name.localeCompare(b.name)));
      setForm({ name: '', color: '#6c757d' });
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategoryRequest(id);
      setCategories((prev) => prev.filter((category) => category.id !== id));
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  return (
    <div className="container">
      <h1>Categorias</h1>
      {error && <p className="auth-error">{error}</p>}

      <form onSubmit={handleSubmit} className="input-group">
        <input
          type="text"
          placeholder="Nome da categoria"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
        <input
          type="color"
          value={form.color}
          onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value }))}
        />
        <button type="submit" className="btn-add-expense">
          <i className="fas fa-plus"></i> Adicionar Categoria
        </button>
      </form>

      <div className="expense-list">
        {categories.map((category) => (
          <div className="expense-item" key={category.id}>
            <span
              className="expense-category-dot"
              style={{ backgroundColor: category.color }}
            />
            <span className="expense-title">{category.name}</span>
            <button
              onClick={() => handleDelete(category.id)}
              className="btn-delete-expense"
              title="Excluir"
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoriesPage;
