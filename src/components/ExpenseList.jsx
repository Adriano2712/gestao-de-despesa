import PropTypes from 'prop-types';
import ExpenseItem from './ExpenseItem';

function ExpenseList({ expenses, onEdit, onDelete }) {
  return (
    <div className="expense-list">
      <h3>Despesas Detalhadas</h3>
      {expenses.length === 0 ? (
        <p>Nenhuma despesa cadastrada neste mês.</p>
      ) : (
        expenses.map((expense) => (
          <ExpenseItem key={expense.id} expense={expense} onEdit={onEdit} onDelete={onDelete} />
        ))
      )}
    </div>
  );
}

ExpenseList.propTypes = {
  expenses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ExpenseList;
