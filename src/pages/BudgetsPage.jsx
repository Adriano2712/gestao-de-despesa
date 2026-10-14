import { useEffect, useState } from 'react';
import { listCategoriesRequest } from '../api/categories';
import { listBudgetsRequest, upsertBudgetRequest, deleteBudgetRequest } from '../api/budgets';
import { extractErrorMessage } from '../api/client';

function BudgetsPage() {
  const [categories, setCategories] = useState([]);
  const [budgetsByCategory, setBudgetsByCategory] = useState({});
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    listCategoriesRequest().then(setCategories).catch((err) => setError(extractErrorMessage(err)));
    listBudgetsRequest()
      .then((budgets) => {
        const byCategory = Object.fromEntries(budgets.map((b) => [b.categoryId, b]));
        setBudgetsByCategory(byCategory);
        setInputs(Object.fromEntries(budgets.map((b) => [b.categoryId, String(b.monthlyLimit)])));
      })
      .catch((err) => setError(extractErrorMessage(err)));
  }, []);

  const handleSave = async (categoryId) => {
    const value = parseFloat(inputs[categoryId]);
    if (!value || value <= 0) return;
    setError('');
    try {
      const budget = await upsertBudgetRequest(categoryId, value);
      setBudgetsByCategory((prev) => ({ ...prev, [categoryId]: budget }));
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  const handleRemove = async (categoryId) => {
    setError('');
    try {
      await deleteBudgetRequest(categoryId);
      setBudgetsByCategory((prev) => {
        const next = { ...prev };
        delete next[categoryId];
        return next;
      });
      setInputs((prev) => ({ ...prev, [categoryId]: '' }));
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Orçamento por categoria</h1>
        <p>Defina um limite mensal para cada categoria e acompanhe o progresso no dashboard.</p>
      </div>
      {error && <p className="auth-error">{error}</p>}

      <div className="card">
        <span className="card-title">Categorias</span>
        <div className="expense-list">
          {categories.length === 0 ? (
            <p className="chart-empty">Cadastre categorias para definir orçamentos.</p>
          ) : (
            categories.map((category) => (
              <div className="expense-item" key={category.id}>
                <span className="expense-category-dot" style={{ backgroundColor: category.color }} />
                <span className="expense-title">{category.name}</span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Sem limite"
                  value={inputs[category.id] ?? ''}
                  onChange={(e) => setInputs((prev) => ({ ...prev, [category.id]: e.target.value }))}
                  style={{ maxWidth: 140 }}
                />
                <div className="expense-actions">
                  <button onClick={() => handleSave(category.id)} className="btn btn-primary btn-icon">
                    Salvar
                  </button>
                  {budgetsByCategory[category.id] && (
                    <button
                      onClick={() => handleRemove(category.id)}
                      className="btn btn-danger btn-icon"
                      title="Remover limite"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default BudgetsPage;
