/// <reference types="../environment" />
import { render } from '@testing-library/react';
import { HStack } from './h_stack.component';
import {
  VStack,
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
    <HStack>
      <div>test</div>
    </HStack>,
  );

  expect(container.querySelectorAll('.p_0_y_h').length).toBe(1);
});

test('asserts that children gets className applied', () => {
  const { container } = render(
    <HStack>
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
    </HStack>,
  );

  expect(container.querySelectorAll('.c_0_y_h').length).toBe(16);
});

test('asserts that spacing prop gets applied', () => {
  const { container } = render(
    <HStack spacing={10}>
      <div>test</div>
    </HStack>,
  );

  expect(container.querySelectorAll('.p_10_y_h').length).toBe(1);
  expect(container.querySelectorAll('.c_10_y_h').length).toBe(1);
});
