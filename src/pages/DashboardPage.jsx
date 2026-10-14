import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { listCategoriesRequest } from '../api/categories';
import {
  listExpensesRequest,
  createExpenseRequest,
  updateExpenseRequest,
  deleteExpenseRequest,
} from '../api/expenses';
import { extractErrorMessage } from '../api/client';
import ExpenseChart from '../components/ExpenseChart';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function DashboardPage() {
  const { user, updateSalary } = useAuth();
  const [month, setMonth] = useState(currentMonth());
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
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
      <h1>Olá, {user.name}</h1>
      {error && <p className="auth-error">{error}</p>}

      <div className="input-group">
        <label htmlFor="month-filter">Mês</label>
        <input
          id="month-filter"
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </div>

      <form onSubmit={handleUpdateSalary} className="input-group">
        <input
          type="number"
          placeholder={`Salário atual: R$ ${user.salary.toFixed(2)}`}
          value={newSalary}
          onChange={(e) => setNewSalary(e.target.value)}
        />
        <button type="submit" className="btn-update-salary">
          <i className="fas fa-save"></i> Atualizar Salário
        </button>
      </form>

      <ExpenseForm
        categories={categories}
        initialValues={editingExpense}
        onSubmit={handleCreateOrUpdate}
        onCancel={editingExpense ? () => setEditingExpense(null) : null}
      />

      <ExpenseChart expenses={expenses} salary={user.salary} />
      <ExpenseList expenses={expenses} onEdit={setEditingExpense} onDelete={handleDelete} />
    </div>
  );
}

export default DashboardPage;
