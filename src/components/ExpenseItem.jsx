import PropTypes from 'prop-types'; // Importando PropTypes

function ExpenseItem({ expense }) {
  return (
    <li>
      <div>{expense.title}</div> {/* 'expense.title' */}
      <div>{expense.amount.toFixed(2)} USD</div> {/* 'expense.amount' e 'expense.amount.toFixed' */}
      <div>{expense.date.toDateString()}</div> {/* 'expense.date' e 'expense.date.toDateString' */}
    </li>
  );
}

// Adicionando validação para a prop 'expense' e suas propriedades
ExpenseItem.propTypes = {
  expense: PropTypes.shape({
    title: PropTypes.string.isRequired, // 'expense.title'
    amount: PropTypes.number.isRequired, // 'expense.amount'
    date: PropTypes.instanceOf(Date).isRequired, // 'expense.date'
  }).isRequired,
};

export default ExpenseItem;
