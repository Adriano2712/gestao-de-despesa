import PropTypes from 'prop-types';
import { formatCurrency } from '../utils/formatCurrency';
import StatTile from './StatTile';
import BudgetMeter from './BudgetMeter';
import CategoryBreakdownChart from './CategoryBreakdownChart';

function ExpenseChart({ expenses, salary }) {
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remainingSalary = salary - totalExpenses;
  const isOverBudget = totalExpenses > salary && salary > 0;

  return (
    <div className="card">
      <span className="card-title">Resumo do mês</span>

      <div className="stat-row">
        <StatTile label="Gastos totais" value={formatCurrency(totalExpenses)} />
        <StatTile
          label="Salário restante"
          value={formatCurrency(remainingSalary > 0 ? remainingSalary : 0)}
          critical={isOverBudget}
        />
      </div>

      <BudgetMeter spent={totalExpenses} limit={salary} />
      {isOverBudget && (
        <p className="auth-error">As despesas deste mês já ultrapassaram o salário cadastrado.</p>
      )}

      <span className="card-title">Por categoria</span>
      <CategoryBreakdownChart expenses={expenses} />
    </div>
  );
}

ExpenseChart.propTypes = {
  expenses: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    })
  ).isRequired,
  salary: PropTypes.number.isRequired,
};

export default ExpenseChart;
