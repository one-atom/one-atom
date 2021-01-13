/// <reference types="../environment" />
import { render } from '@testing-library/react';
import { HeadLessStack } from './headless_stack.component';

test('asserts that Horizontal impl works', async () => {
  const { findByText } = render(
    <HeadLessStack fluid={true} childLength={2} spacing={10} axis="Horizontal">
      {({ parentClassName }) => <div>{parentClassName}</div>}
    </HeadLessStack>,
  );

  await findByText(/p_10_y_h/i);
});

test('asserts that Vertical impl works', async () => {
  const { findByText } = render(
    <HeadLessStack fluid={true} childLength={2} spacing={10} axis="Vertical">
      {({ parentClassName }) => <div>{parentClassName}</div>}
    </HeadLessStack>,
  );

  await findByText(/p_10_y_v/i);
});
