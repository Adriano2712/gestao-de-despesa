import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/useAuth';
import { listCategoriesRequest } from '../api/categories';
import {
  listExpensesRequest,
  createExpenseRequest,
  updateExpenseRequest,
  deleteExpenseRequest,
} from '../api/expenses';
import { listBudgetsRequest } from '../api/budgets';
import { extractErrorMessage } from '../api/client';
import { formatCurrency } from '../utils/formatCurrency';
import ExpenseChart from '../components/ExpenseChart';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import BudgetProgressList from '../components/BudgetProgressList';

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function DashboardPage() {
  const { user, updateSalary } = useAuth();
  const [month, setMonth] = useState(currentMonth());
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [newSalary, setNewSalary] = useState('');
  const [error, setError] = useState('');

  const loadExpenses = useCallback(async () => {
    try {
      const data = await listExpensesRequest({ month });
      setExpenses(data);
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  }, [month]);

  useEffect(() => {
    listCategoriesRequest().then(setCategories).catch((err) => setError(extractErrorMessage(err)));
    listBudgetsRequest().then(setBudgets).catch((err) => setError(extractErrorMessage(err)));
  }, []);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const handleCreateOrUpdate = async (values) => {
    setError('');
    try {
      if (editingExpense) {
        await updateExpenseRequest(editingExpense.id, values);
        setEditingExpense(null);
      } else {
        await createExpenseRequest(values);
      }
      await loadExpenses();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await deleteExpenseRequest(id);
      await loadExpenses();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  const handleUpdateSalary = async (e) => {
    e.preventDefault();
    if (!newSalary) return;
    setError('');
    try {
      await updateSalary(parseFloat(newSalary));
      setNewSalary('');
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Olá, {user.name}</h1>
        <p>Acompanhe seus gastos e mantenha o orçamento do mês sob controle.</p>
      </div>
      {error && <p className="auth-error">{error}</p>}

      <div className="card">
        <div className="input-group">
          <div className="field" style={{ flex: '0 0 auto' }}>
            <label htmlFor="month-filter">Mês</label>
            <input
              id="month-filter"
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </div>
          <form onSubmit={handleUpdateSalary} className="field" style={{ flexDirection: 'row', alignItems: 'end', gap: 'var(--space-2)' }}>
            <div className="field">
              <label htmlFor="salary-input">Salário mensal</label>
              <input
                id="salary-input"
                type="number"
                placeholder={formatCurrency(user.salary)}
                value={newSalary}
                onChange={(e) => setNewSalary(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-accent">
              <i className="fas fa-save"></i> Salvar
            </button>
          </form>
        </div>
      </div>

      <ExpenseForm
        categories={categories}
        initialValues={editingExpense}
        onSubmit={handleCreateOrUpdate}
        onCancel={editingExpense ? () => setEditingExpense(null) : null}
      />

      <ExpenseChart expenses={expenses} salary={user.salary} />
      <BudgetProgressList expenses={expenses} budgets={budgets} />
      <ExpenseList expenses={expenses} onEdit={setEditingExpense} onDelete={handleDelete} />
    </div>
  );
}

export default DashboardPage;
