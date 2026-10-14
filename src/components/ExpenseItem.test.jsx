import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExpenseItem from './ExpenseItem';

const expense = {
  id: 'exp-1',
  title: 'Mercado',
  amount: 150.5,
  date: '2026-10-05',
  category: { name: 'Alimentação', color: '#eb6834' },
};

describe('ExpenseItem', () => {
  it('renders the expense title and formatted amount', () => {
    render(<ExpenseItem expense={expense} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('Mercado')).toBeInTheDocument();
    // Testing Library's default normalizer collapses the currency's non-breaking space to a regular one.
    expect(screen.getByText('R$ 150,50')).toBeInTheDocument();
  });

  it('calls onEdit with the expense when the edit button is clicked', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(<ExpenseItem expense={expense} onEdit={onEdit} onDelete={vi.fn()} />);

    await user.click(screen.getByTitle('Editar'));

    expect(onEdit).toHaveBeenCalledWith(expense);
  });

  it('calls onDelete with the expense id when the delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<ExpenseItem expense={expense} onEdit={vi.fn()} onDelete={onDelete} />);

    await user.click(screen.getByTitle('Excluir'));

    expect(onDelete).toHaveBeenCalledWith('exp-1');
  });
});
