import PropTypes from 'prop-types';
import './ExpenseList.css';

function ExpenseList({ expenses }) {
  return (
    <div className="expense-list">
      <h3>Despesas Detalhadas</h3>
      {expenses.length === 0 ? (
        <p>Nenhuma despesa cadastrada.</p>
      ) : (
        expenses.map((expense, index) => (
          <div className="expense-item" key={index}>
            <span>{expense.title}</span>
            <span>R$ {expense.amount.toFixed(2)}</span>
          </div>
        ))
      )}
    </div>
  );
}

ExpenseList.propTypes = {
  expenses: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      date: PropTypes.instanceOf(Date).isRequired,
    })
  ).isRequired,
};

export default ExpenseList;
