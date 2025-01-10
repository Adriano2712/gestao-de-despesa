import { useState } from "react";
import ExpenseChart from "./components/ExpenseChart";
import ExpenseList from "./components/ExpenseList";

function App() {
  const [expenses, setExpenses] = useState([
    { title: "Alimentação", amount: 200 },
    { title: "Transporte", amount: 100 },
  ]);
  const [salary, setSalary] = useState(3000);
  const [newExpense, setNewExpense] = useState({ title: "", amount: "" });
  const [newSalary, setNewSalary] = useState("");

  const handleAddExpense = () => {
    if (newExpense.title && newExpense.amount) {
      setExpenses((prevExpenses) => [
        ...prevExpenses,
        { title: newExpense.title, amount: parseFloat(newExpense.amount) },
      ]);
      setNewExpense({ title: "", amount: "" });
    }
  };

  const handleClearExpenses = () => {
    setExpenses([]);
  };

  const handleUpdateSalary = () => {
    if (newSalary) {
      setSalary(parseFloat(newSalary));
      setNewSalary("");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="container">
  <h1>Gestão de Despesas</h1>

  <div className="input-group">
    <input
      type="number"
      placeholder="Salário mensal"
      value={newSalary}
      onChange={(e) => setNewSalary(e.target.value)}
    />
    <button onClick={handleUpdateSalary} className="btn-update-salary">
      <i className="fas fa-save"></i> Atualizar Salário
    </button>
  </div>

  <div className="input-group">
    <input
      type="text"
      name="title"
      placeholder="Título da despesa"
      value={newExpense.title}
      onChange={handleInputChange}
    />
    <input
      type="number"
      name="amount"
      placeholder="Valor"
      value={newExpense.amount}
      onChange={handleInputChange}
    />
    <div className="button-group">
      <button onClick={handleAddExpense} className="btn-add-expense">
        <i className="fas fa-plus"></i> Adicionar Despesa
      </button>
      <button onClick={handleClearExpenses} className="btn-clear-expenses">
        <i className="fas fa-trash-alt"></i> Limpar Despesas
      </button>
    </div>
  </div>

  <ExpenseChart expenses={expenses} salary={salary} />
  <ExpenseList expenses={expenses} />
</div>

  );
}

export default App;
