import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from 'chart.js';
import PropTypes from 'prop-types';
import { formatCurrency } from '../utils/formatCurrency';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

const MUTED = '#898781';

function groupByCategory(expenses) {
  const totals = new Map();

  expenses.forEach((expense) => {
    const key = expense.category?.name || 'Sem categoria';
    const color = expense.category?.color || MUTED;
    const current = totals.get(key) || { total: 0, color };
    current.total += expense.amount;
    totals.set(key, current);
  });

  return [...totals.entries()]
    .map(([name, { total, color }]) => ({ name, total, color }))
    .sort((a, b) => b.total - a.total);
}

function CategoryBreakdownChart({ expenses }) {
  const rows = groupByCategory(expenses);

  if (rows.length === 0) {
    return <p className="chart-empty">Sem despesas para detalhar por categoria neste mês.</p>;
  }

  const data = {
    labels: rows.map((row) => row.name),
    datasets: [
      {
        label: 'Total gasto',
        data: rows.map((row) => row.total),
        backgroundColor: rows.map((row) => row.color),
        borderRadius: 4,
        barThickness: 20,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => formatCurrency(context.parsed.x),
        },
      },
    },
    scales: {
      x: {
        grid: { color: '#e1e0d9' },
        ticks: {
          color: '#898781',
          callback: (value) => formatCurrency(value),
        },
      },
      y: {
        grid: { display: false },
        ticks: { color: '#52514e' },
      },
    },
  };

  return (
    <div style={{ height: Math.max(rows.length * 36, 120) + 40 }}>
      <Bar data={data} options={options} />
    </div>
  );
}

CategoryBreakdownChart.propTypes = {
  expenses: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      category: PropTypes.shape({ name: PropTypes.string, color: PropTypes.string }),
    })
  ).isRequired,
};

export default CategoryBreakdownChart;
