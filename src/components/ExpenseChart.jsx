import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import PropTypes from 'prop-types';
import { formatCurrency } from '../utils/formatCurrency';

ChartJS.register(ArcElement, Tooltip, Legend);

function ExpenseChart({ expenses, salary }) {
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remainingSalary = salary - totalExpenses;
  const isOverBudget = totalExpenses > salary;

  const data = {
    labels: ['Despesas', 'Salário Restante'],
    datasets: [
      {
        label: 'Salário e Despesas',
        data: [totalExpenses, remainingSalary > 0 ? remainingSalary : 0],
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Gastos Totais: {formatCurrency(totalExpenses)}</h2>
      <h2>Salário Restante: {formatCurrency(remainingSalary > 0 ? remainingSalary : 0)}</h2>
      {isOverBudget && (
        <p className="auth-error">
          As despesas deste mês já ultrapassaram o salário cadastrado.
        </p>
      )}
      <div style={{ width: '300px', height: '300px', margin: '0 auto' }}>
        <Pie data={data} />
      </div>
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
