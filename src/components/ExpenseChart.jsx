import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import PropTypes from 'prop-types';

ChartJS.register(ArcElement, Tooltip, Legend);

function ExpenseChart({ expenses, salary }) {
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remainingSalary = salary - totalExpenses;

  if (totalExpenses > salary) {
    alert('A soma das despesas não pode ser maior que o salário!');
  }

  const labels = ['Despesas', 'Salário Restante'];
  const dataPoints = [totalExpenses, remainingSalary > 0 ? remainingSalary : 0];

  const colors = ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'];

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Salário e Despesas',
        data: dataPoints,
        backgroundColor: colors,
        borderColor: colors.map(color => color.replace('0.6', '1')),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Gastos Totais: R$ {totalExpenses.toFixed(2)}</h2>
      <h2>Salário Restante: R$ {remainingSalary > 0 ? remainingSalary.toFixed(2) : '0.00'}</h2>
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
      date: PropTypes.instanceOf(Date).isRequired,
    })
  ).isRequired,
  salary: PropTypes.number.isRequired,
};

export default ExpenseChart;
