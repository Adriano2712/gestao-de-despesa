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
    <form onSubmit={handleSubmit} className="input-group">
      <input
        type="text"
        name="title"
        placeholder="Título da despesa"
        value={form.title}
        onChange={handleChange}
      />
      <input
        type="number"
        name="amount"
        placeholder="Valor"
        min="0.01"
        step="0.01"
        value={form.amount}
        onChange={handleChange}
      />
      <input type="date" name="date" value={form.date} onChange={handleChange} />
      <select name="categoryId" value={form.categoryId} onChange={handleChange}>
        <option value="">Sem categoria</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <div className="button-group">
        <button type="submit" className="btn-add-expense">
          <i className="fas fa-plus"></i> {initialValues ? 'Salvar' : 'Adicionar Despesa'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-clear-expenses">
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
