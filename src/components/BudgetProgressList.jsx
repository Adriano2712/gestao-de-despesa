import PropTypes from 'prop-types';
import { formatCurrency } from '../utils/formatCurrency';

function severity(ratio) {
  if (ratio > 1) return 'is-critical';
  if (ratio >= 0.7) return 'is-warning';
  return 'is-accent';
}

function BudgetProgressList({ expenses, budgets }) {
  if (budgets.length === 0) {
    return null;
  }

  const rows = budgets.map((budget) => {
    const spent = expenses
      .filter((expense) => expense.categoryId === budget.categoryId)
      .reduce((sum, expense) => sum + expense.amount, 0);
    const ratio = budget.monthlyLimit > 0 ? spent / budget.monthlyLimit : 0;
    return { ...budget, spent, ratio };
  });

  return (
    <div className="card">
      <span className="card-title">Orçamento por categoria</span>
      {rows.map((row) => (
        <div key={row.categoryId} className="meter">
          <div className="meter-labels">
            <span>{row.category?.name}</span>
            <span>
              {formatCurrency(row.spent)} de {formatCurrency(row.monthlyLimit)}
            </span>
          </div>
          <div className="meter-track">
            <div
              className={`meter-fill ${severity(row.ratio)}`}
              style={{ width: `${Math.min(row.ratio, 1) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

BudgetProgressList.propTypes = {
  expenses: PropTypes.arrayOf(
    PropTypes.shape({
      categoryId: PropTypes.string,
      amount: PropTypes.number.isRequired,
    })
  ).isRequired,
  budgets: PropTypes.arrayOf(
    PropTypes.shape({
      categoryId: PropTypes.string.isRequired,
      monthlyLimit: PropTypes.number.isRequired,
      category: PropTypes.shape({ name: PropTypes.string }),
    })
  ).isRequired,
};

export default BudgetProgressList;
