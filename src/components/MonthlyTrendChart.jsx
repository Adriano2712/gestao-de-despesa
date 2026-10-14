import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Filler,
} from 'chart.js';
import PropTypes from 'prop-types';
import { formatCurrency } from '../utils/formatCurrency';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Filler);

const ACCENT = '#2a78d6';

function monthLabel(month) {
  const [year, monthIndex] = month.split('-').map(Number);
  const date = new Date(Date.UTC(year, monthIndex - 1, 1));
  return date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit', timeZone: 'UTC' });
}

function MonthlyTrendChart({ series }) {
  if (series.every((point) => point.total === 0)) {
    return <p className="chart-empty">Sem despesas no período selecionado.</p>;
  }

  const data = {
    labels: series.map((point) => monthLabel(point.month)),
    datasets: [
      {
        data: series.map((point) => point.total),
        borderColor: ACCENT,
        backgroundColor: `${ACCENT}1a`,
        fill: true,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: ACCENT,
        tension: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => formatCurrency(context.parsed.y),
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#52514e' } },
      y: {
        grid: { color: '#e1e0d9' },
        ticks: { color: '#898781', callback: (value) => formatCurrency(value) },
      },
    },
  };

  return (
    <div style={{ height: 220 }}>
      <Line data={data} options={options} />
    </div>
  );
}

MonthlyTrendChart.propTypes = {
  series: PropTypes.arrayOf(
    PropTypes.shape({ month: PropTypes.string.isRequired, total: PropTypes.number.isRequired })
  ).isRequired,
};

export default MonthlyTrendChart;
