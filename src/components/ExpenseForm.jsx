import PropTypes from 'prop-types';

function ExpenseForm({ onAddExpense }) {
  const submitHandler = (e) => {
    e.preventDefault();
    onAddExpense({ title: 'Example', amount: 100 });
  };

  return <form onSubmit={submitHandler}> form inputs </form>;
}

ExpenseForm.propTypes = {
  onAddExpense: PropTypes.func.isRequired, // Validação de prop obrigatória
};

export default ExpenseForm;
