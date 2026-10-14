import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExpenseForm from './ExpenseForm';

const categories = [{ id: 'cat-1', name: 'Alimentação' }];

describe('ExpenseForm', () => {
  it('submits the parsed values for a new expense', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ExpenseForm categories={categories} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Título'), 'Mercado');
    await user.type(screen.getByLabelText('Valor'), '150.5');
    await user.type(screen.getByLabelText('Data'), '2026-10-05');
    await user.selectOptions(screen.getByLabelText('Categoria'), 'cat-1');
    await user.click(screen.getByRole('button', { name: /adicionar despesa/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Mercado',
      amount: 150.5,
      date: '2026-10-05',
      categoryId: 'cat-1',
    });
  });

  it('does not submit when required fields are missing', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ExpenseForm categories={categories} onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: /adicionar despesa/i }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('pre-fills the form and shows a cancel button in edit mode', () => {
    const onCancel = vi.fn();
    render(
      <ExpenseForm
        categories={categories}
        initialValues={{ title: 'Aluguel', amount: 1200, date: '2026-10-01', categoryId: '' }}
        onSubmit={vi.fn()}
        onCancel={onCancel}
      />
    );

    expect(screen.getByLabelText('Título')).toHaveValue('Aluguel');
    expect(screen.getByLabelText('Valor')).toHaveValue(1200);
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });
});
