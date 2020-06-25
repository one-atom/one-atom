import React, { Fragment } from 'react';
import { render } from '@testing-library/react';
import { unwrap_fragment } from '../src';

describe('unwrap_fragment', () => {
  const T: React.FC = ({ children }) => {
    const flatten = unwrap_fragment(children);

    return <Fragment>{flatten}</Fragment>;
  };

  it('should render normally', () => {
    const { getAllByTestId } = render(
      <T>
        <div data-testid='should render'>1</div>
        <div data-testid='should render'>2</div>
        <div data-testid='should render'>3</div>
        <div data-testid='should render'>4</div>
      </T>,
    );

    const collection = getAllByTestId('should render');

    expect(collection.length).toBe(4);
  });

  it('should render non wrapped fragment and the unwrapped', () => {
    const { getAllByTestId } = render(
      <T>
        <div data-testid='should render'>1</div>
        <div data-testid='should render'>2</div>
        <Fragment>
          <div data-testid='should render'>3</div>
          <div data-testid='should render'>4</div>
        </Fragment>
      </T>,
    );

    const collection = getAllByTestId('should render');

    expect(collection.length).toBe(4);
  });

  it('should render all children within a fragment', () => {
    const { getAllByTestId } = render(
      <T>
        <Fragment>
          <div data-testid='should render'>1</div>
          <div data-testid='should render'>2</div>
          <div data-testid='should render'>3</div>
          <div data-testid='should render'>4</div>
        </Fragment>
      </T>,
    );

    const collection = getAllByTestId('should render');

    expect(collection.length).toBe(4);
  });
});
