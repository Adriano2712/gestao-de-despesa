import { useEffect, useState } from 'react';
import {
  listRecurringExpensesRequest,
  createRecurringExpenseRequest,
  updateRecurringExpenseRequest,
  deleteRecurringExpenseRequest,
} from '../api/recurringExpenses';
import { listCategoriesRequest } from '../api/categories';
import { extractErrorMessage } from '../api/client';
import { formatCurrency } from '../utils/formatCurrency';

const emptyForm = { title: '', amount: '', dayOfMonth: '5', startDate: '', categoryId: '' };

function RecurringExpensesPage() {
  const [recurringExpenses, setRecurringExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    listCategoriesRequest().then(setCategories).catch((err) => setError(extractErrorMessage(err)));
    listRecurringExpensesRequest()
      .then(setRecurringExpenses)
      .catch((err) => setError(extractErrorMessage(err)));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.amount || !form.startDate) return;
    try {
      const created = await createRecurringExpenseRequest({
        title: form.title,
        amount: parseFloat(form.amount),
        dayOfMonth: parseInt(form.dayOfMonth, 10),
        startDate: form.startDate,
        categoryId: form.categoryId || null,
      });
      setRecurringExpenses((prev) => [created, ...prev]);
      setForm(emptyForm);
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  const handleToggleActive = async (recurringExpense) => {
    try {
      const updated = await updateRecurringExpenseRequest(recurringExpense.id, {
        active: !recurringExpense.active,
      });
      setRecurringExpenses((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRecurringExpenseRequest(id);
      setRecurringExpenses((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Despesas recorrentes</h1>
        <p>Cadastre gastos fixos mensais (aluguel, assinaturas) e eles entram automaticamente todo mês.</p>
      </div>
      {error && <p className="auth-error">{error}</p>}

      <form onSubmit={handleSubmit} className="card">
        <span className="card-title">Nova recorrência</span>
        <div className="input-group">
          <div className="field">
            <label htmlFor="rec-title">Título</label>
            <input id="rec-title" type="text" name="title" value={form.title} onChange={handleChange} />
          </div>
          <div className="field">
            <label htmlFor="rec-amount">Valor</label>
            <input
              id="rec-amount"
              type="number"
              name="amount"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <label htmlFor="rec-day">Dia do mês</label>
            <input
              id="rec-day"
              type="number"
              name="dayOfMonth"
              min="1"
              max="28"
              value={form.dayOfMonth}
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <label htmlFor="rec-start">A partir de</label>
            <input id="rec-start" type="date" name="startDate" value={form.startDate} onChange={handleChange} />
          </div>
          <div className="field">
            <label htmlFor="rec-category">Categoria</label>
            <select id="rec-category" name="categoryId" value={form.categoryId} onChange={handleChange}>
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
            <i className="fas fa-plus"></i> Adicionar recorrência
          </button>
        </div>
      </form>

      <div className="card">
        <span className="card-title">Recorrências cadastradas</span>
        <div className="expense-list">
          {recurringExpenses.length === 0 ? (
            <p className="chart-empty">Nenhuma despesa recorrente cadastrada.</p>
          ) : (
            recurringExpenses.map((recurringExpense) => (
              <div className="expense-item" key={recurringExpense.id}>
                <span
                  className="expense-category-dot"
                  style={{ backgroundColor: recurringExpense.category?.color || '#898781' }}
                />
                <span className="expense-title">
                  {recurringExpense.title} — dia {recurringExpense.dayOfMonth}
                </span>
                <span className="expense-amount">{formatCurrency(recurringExpense.amount)}</span>
                <div className="expense-actions">
                  <button
                    onClick={() => handleToggleActive(recurringExpense)}
                    className={`btn btn-icon ${recurringExpense.active ? 'btn-secondary' : 'btn-primary'}`}
                    title={recurringExpense.active ? 'Pausar' : 'Reativar'}
                  >
                    <i className={`fas ${recurringExpense.active ? 'fa-pause' : 'fa-play'}`}></i>
                  </button>
                  <button
                    onClick={() => handleDelete(recurringExpense.id)}
                    className="btn btn-danger btn-icon"
                    title="Excluir"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default RecurringExpensesPage;
