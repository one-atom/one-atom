/// <reference types="../environment" />
import { View } from './view.component';
import { render } from '@testing-library/react';

test('asserts "data-" properties gets applied', () => {
  {
    const { getByTestId } = render(<View.h data-testid="test" />);

    getByTestId('test');
  }

  {
    const { container } = render(<View.h data-test="test" />);

    expect(container.querySelector('[data-test="test"]')).toBeTruthy();
  }
});

test('asserts "aria-" properties gets applied', () => {
  const { container } = render(<View.h aria-label="test" />);

  expect(container.querySelector('[aria-label="test"]')).toBeTruthy();
});
