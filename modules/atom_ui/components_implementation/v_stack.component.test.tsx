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
    <VStack>
      <div>test</div>
    </VStack>,
  );

  expect(container.querySelectorAll('.p_0_y_v').length).toBe(1);
});

test('asserts that children gets className applied', () => {
  const { container } = render(
    <VStack>
      <Article />
      <Button.h label="-" />
      <Flex />
      <HSpacing px={0} />
      <HStack />
      <Input type="text" />
      <Separator />
      <Shimmer height={100} width={100} />
      <Size />
      <Spacer />
      <VStack />
      <StaticButton />
      <Text.h />
      <VSpacing px={0} />
      <Layout />
      <div />
    </VStack>,
  );

  expect(container.querySelectorAll('.c_0_y_v_l_16').length).toBe(16);
});

test('asserts that spacing prop gets applied', () => {
  const { container } = render(
    <VStack spacing={10}>
      <div>test</div>
    </VStack>,
  );

  expect(container.querySelectorAll('.p_10_y_v').length).toBe(1);
  expect(container.querySelectorAll('.c_10_y_v_l_1').length).toBe(1);
});
