import React, { useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: contents;
  color: violet;
`;

export const ExampleComponent: React.FC = () => {
  const [state, setState] = useState(0);

  function handle_click(): void {
    setState(state + 1);
  }

  return (
    <Wrapper>
      <div>React is working</div>
      <button onClick={handle_click}>plus one!</button> <div>{state}</div>
    </Wrapper>
  );
};
