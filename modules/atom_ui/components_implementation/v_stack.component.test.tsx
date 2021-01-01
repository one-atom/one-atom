/// <reference types="../environment" />
import { render } from '@testing-library/react';
import { VStack } from './v_stack.component';
import {
  HStack,
  Layout,
  Text,
  Separator,
  HSpacing,
  VSpacing,
  StaticButton,
  Article,
  Flex,
  Button,
  Input,
  Size,
  Shimmer,
  Spacer,
} from './mod';

test('asserts that parent gets className applied', () => {
  const { container } = render(
    <VStack.h>
      <div>test</div>
    </VStack.h>,
  );

  expect(container.querySelectorAll('.p_0_y_v').length).toBe(1);
});

test('asserts that children gets className applied', () => {
  const { container } = render(
    <VStack.h>
      <Article.h />
      <Button.h label="-" />
      <Flex.h />
      <HSpacing.h px={0} />
      <HStack.h />
      <Input.h type="text" />
      <Separator.h />
      <Shimmer.h height={100} width={100} />
      <Size.h />
      <Spacer.h />
      <VStack.h />
      <StaticButton.h />
      <Text.h />
      <VSpacing.h px={0} />
      <Layout.h />
      <div />
    </VStack.h>,
  );

  expect(container.querySelectorAll('.c_0_y_v').length).toBe(16);
});

test('asserts that spacing prop gets applied', () => {
  const { container } = render(
    <VStack.h spacing={10}>
      <div>test</div>
    </VStack.h>,
  );

  expect(container.querySelectorAll('.p_10_y_v').length).toBe(1);
  expect(container.querySelectorAll('.c_10_y_v').length).toBe(1);
});
