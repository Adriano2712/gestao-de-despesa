import PropTypes from 'prop-types';
import { formatCurrency } from '../utils/formatCurrency';

function ExpenseItem({ expense, onEdit, onDelete }) {
  return (
    <div className="expense-item">
      <span
        className="expense-category-dot"
        style={{ backgroundColor: expense.category?.color || '#6c757d' }}
        title={expense.category?.name || 'Sem categoria'}
      />
      <span className="expense-title">{expense.title}</span>
      <span className="expense-date">{new Date(expense.date).toLocaleDateString('pt-BR')}</span>
      <span className="expense-amount">{formatCurrency(expense.amount)}</span>
      <div className="expense-actions">
        <button onClick={() => onEdit(expense)} className="btn-edit-expense" title="Editar">
          <i className="fas fa-pen"></i>
        </button>
        <button
          onClick={() => onDelete(expense.id)}
          className="btn-delete-expense"
          title="Excluir"
        >
          <i className="fas fa-trash-alt"></i>
        </button>
      </div>
    </div>
  );
}

ExpenseItem.propTypes = {
  expense: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    category: PropTypes.shape({
      name: PropTypes.string,
      color: PropTypes.string,
    }),
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ExpenseItem;
