import { useEffect, useState, useCallback } from 'react';
import { monthlyReportRequest, historyReportRequest, downloadExpensesCsv } from '../api/reports';
import { extractErrorMessage } from '../api/client';
import { formatCurrency } from '../utils/formatCurrency';
import MonthlyTrendChart from '../components/MonthlyTrendChart';

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function ReportsPage() {
  const [month, setMonth] = useState(currentMonth());
  const [report, setReport] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

  const loadReport = useCallback(async () => {
    try {
      const data = await monthlyReportRequest(month);
      setReport(data);
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  }, [month]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  useEffect(() => {
    historyReportRequest(6).then(setHistory).catch((err) => setError(extractErrorMessage(err)));
  }, []);

  const handleExport = async () => {
    setExporting(true);
    setError('');
    try {
      await downloadExpensesCsv(month);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Relatórios</h1>
        <p>Histórico de gastos e detalhamento por categoria, mês a mês.</p>
      </div>
      {error && <p className="auth-error">{error}</p>}

      <div className="card">
        <span className="card-title">Tendência dos últimos 6 meses</span>
        <MonthlyTrendChart series={history} />
      </div>

      <div className="card">
        <div className="input-group">
          <div className="field" style={{ flex: '0 0 auto' }}>
            <label htmlFor="report-month">Mês</label>
            <input
              id="report-month"
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="btn btn-secondary"
            style={{ alignSelf: 'end' }}
          >
            <i className="fas fa-file-csv"></i> {exporting ? 'Exportando...' : 'Exportar CSV'}
          </button>
        </div>

        {report && (
          <>
            <div className="stat-row">
              <div className="stat-tile">
                <span className="stat-tile-label">Gastos totais</span>
                <span className="stat-tile-value">{formatCurrency(report.totalExpenses)}</span>
              </div>
              <div className="stat-tile">
                <span className="stat-tile-label">Salário restante</span>
                <span className={`stat-tile-value${report.remaining < 0 ? ' is-critical' : ''}`}>
                  {formatCurrency(report.remaining)}
                </span>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'var(--ink-secondary)', fontSize: 13 }}>
                  <th style={{ padding: '8px 0' }}>Categoria</th>
                  <th style={{ padding: '8px 0', textAlign: 'right' }}>Gasto</th>
                  <th style={{ padding: '8px 0', textAlign: 'right' }}>Orçamento</th>
                </tr>
              </thead>
              <tbody>
                {report.categories.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="chart-empty">
                      Sem despesas neste mês.
                    </td>
                  </tr>
                ) : (
                  report.categories.map((category) => (
                    <tr key={category.categoryId || 'none'} style={{ borderTop: '1px solid var(--border-hairline)' }}>
                      <td style={{ padding: '8px 0' }}>
                        <span
                          className="expense-category-dot"
                          style={{ backgroundColor: category.color, marginRight: 8 }}
                        />
                        {category.name}
                      </td>
                      <td style={{ padding: '8px 0', textAlign: 'right' }}>
                        {formatCurrency(category.total)}
                      </td>
                      <td style={{ padding: '8px 0', textAlign: 'right', color: 'var(--ink-secondary)' }}>
                        {category.budgetLimit ? formatCurrency(category.budgetLimit) : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

export default ReportsPage;
