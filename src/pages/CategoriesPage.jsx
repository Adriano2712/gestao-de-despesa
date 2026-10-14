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
      <div className="page-header">
        <h1>Categorias</h1>
        <p>Organize suas despesas e personalize a cor de cada categoria.</p>
      </div>
      {error && <p className="auth-error">{error}</p>}

      <form onSubmit={handleSubmit} className="card">
        <span className="card-title">Nova categoria</span>
        <div className="input-group">
          <div className="field">
            <label htmlFor="category-name">Nome</label>
            <input
              id="category-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="field" style={{ flex: '0 0 auto' }}>
            <label htmlFor="category-color">Cor</label>
            <input
              id="category-color"
              type="color"
              value={form.color}
              onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value }))}
            />
          </div>
        </div>
        <div className="button-group">
          <button type="submit" className="btn btn-primary">
            <i className="fas fa-plus"></i> Adicionar categoria
          </button>
        </div>
      </form>

      <div className="card">
        <span className="card-title">Suas categorias</span>
        <div className="expense-list">
          {categories.length === 0 ? (
            <p className="chart-empty">Nenhuma categoria cadastrada.</p>
          ) : (
            categories.map((category) => (
              <div className="expense-item" key={category.id}>
                <span
                  className="expense-category-dot"
                  style={{ backgroundColor: category.color }}
                />
                <span className="expense-title">{category.name}</span>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="btn btn-danger btn-icon"
                  title="Excluir"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoriesPage;
