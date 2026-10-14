import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BudgetMeter from './BudgetMeter';

describe('BudgetMeter', () => {
  it('uses the accent color when spending is comfortably under the limit', () => {
    const { container } = render(<BudgetMeter spent={200} limit={1000} />);
    expect(container.querySelector('.meter-fill')).toHaveClass('is-accent');
  });

  it('uses the warning color once spending crosses 70% of the limit', () => {
    const { container } = render(<BudgetMeter spent={750} limit={1000} />);
    expect(container.querySelector('.meter-fill')).toHaveClass('is-warning');
  });

  it('uses the critical color and clamps the fill width when over budget', () => {
    const { container } = render(<BudgetMeter spent={1500} limit={1000} />);
    const fill = container.querySelector('.meter-fill');
    expect(fill).toHaveClass('is-critical');
    expect(fill).toHaveStyle({ width: '100%' });
  });

  it('shows a message when no salary/limit is set', () => {
    render(<BudgetMeter spent={200} limit={0} />);
    expect(screen.getByText('Salário não informado')).toBeInTheDocument();
  });
});
