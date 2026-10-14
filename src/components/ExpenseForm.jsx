import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const emptyForm = { title: '', amount: '', date: '', categoryId: '' };

function toFormValues(expense) {
  if (!expense) return emptyForm;
  return {
    title: expense.title,
    amount: String(expense.amount),
    date: expense.date,
    categoryId: expense.categoryId || '',
  };
}

function ExpenseForm({ categories, initialValues = null, onSubmit, onCancel = null }) {
  const [form, setForm] = useState(() => toFormValues(initialValues));

  useEffect(() => {
    setForm(toFormValues(initialValues));
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.amount || !form.date) return;

    onSubmit({
      title: form.title,
      amount: parseFloat(form.amount),
      date: form.date,
      categoryId: form.categoryId || null,
    });

    if (!initialValues) {
      setForm(emptyForm);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <span className="card-title">{initialValues ? 'Editar despesa' : 'Nova despesa'}</span>
      <div className="input-group">
        <div className="field">
          <label htmlFor="expense-title">Título</label>
          <input
            id="expense-title"
            type="text"
            name="title"
            placeholder="Ex: Mercado"
            value={form.title}
            onChange={handleChange}
          />
        </div>
        <div className="field">
          <label htmlFor="expense-amount">Valor</label>
          <input
            id="expense-amount"
            type="number"
            name="amount"
            placeholder="0,00"
            min="0.01"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
          />
        </div>
        <div className="field">
          <label htmlFor="expense-date">Data</label>
          <input
            id="expense-date"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
        </div>
        <div className="field">
          <label htmlFor="expense-category">Categoria</label>
          <select id="expense-category" name="categoryId" value={form.categoryId} onChange={handleChange}>
            <option value="">Sem categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="button-group">
        <button type="submit" className="btn btn-primary">
          <i className="fas fa-plus"></i> {initialValues ? 'Salvar' : 'Adicionar despesa'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

ExpenseForm.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string.isRequired, name: PropTypes.string.isRequired })
  ).isRequired,
  initialValues: PropTypes.shape({
    title: PropTypes.string,
    amount: PropTypes.number,
    date: PropTypes.string,
    categoryId: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
};

export default ExpenseForm;
