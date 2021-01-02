/// <reference types="../environment" />
import { Layout } from './layout.component';
import { render } from '@testing-library/react';

test('asserts "data-" properties gets applied', () => {
  {
    const { getByTestId } = render(<Layout data-testid="test" />);

    getByTestId('test');
  }

  {
    const { container } = render(<Layout data-test="test" />);

    expect(container.querySelector('[data-test="test"]')).toBeTruthy();
  }
});

test('asserts "aria-" properties gets applied', () => {
  const { container } = render(<Layout aria-label="test" />);

  expect(container.querySelector('[aria-label="test"]')).toBeTruthy();
});
