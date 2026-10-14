import PropTypes from 'prop-types';
import { formatCurrency } from '../utils/formatCurrency';

function severity(ratio) {
  if (ratio > 1) return 'is-critical';
  if (ratio >= 0.7) return 'is-warning';
  return 'is-accent';
}

function BudgetMeter({ spent, limit }) {
  const ratio = limit > 0 ? spent / limit : 0;
  const fillWidth = Math.min(ratio, 1) * 100;

  return (
    <div className="meter">
      <div className="meter-labels">
        <span>{formatCurrency(spent)} gastos</span>
        <span>{limit > 0 ? `${Math.round(ratio * 100)}% do salário` : 'Salário não informado'}</span>
      </div>
      <div className="meter-track">
        <div className={`meter-fill ${severity(ratio)}`} style={{ width: `${fillWidth}%` }} />
      </div>
    </div>
  );
}

BudgetMeter.propTypes = {
  spent: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
};

export default BudgetMeter;
