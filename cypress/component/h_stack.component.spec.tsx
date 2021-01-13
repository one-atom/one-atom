/// <reference types="cypress" />
/// <reference types="cypress-wait-until" />
/// <reference types="../environment" />

import { mount } from 'cypress-react-unit-test';
import { Layout, HStack } from '../../modules/atom_ui/mod';
import { Parent } from '../utils/_parent';

const prettyColors = ['#10100e', '#01fdf8', '#0041f8', '#f93bfa', '#f70000'] as const;

describe('<HStack.h />', () => {
  it('children should have equal height', () => {
    mount(
      <Parent>
        <HStack>
          <Layout data-testid="child-1" background={prettyColors[0]} height={20} width={200}>
            a
          </Layout>
          <Layout data-testid="child-2" background={prettyColors[1]} height={20} width={200}>
            b
          </Layout>
          <Layout data-testid="child-3" background={prettyColors[2]} height={20} width={200}>
            c
          </Layout>
        </HStack>
      </Parent>,
    );

    // Values are snapshotted
    cy.get('[data-testid=child-1]').invoke('css', 'width').should('eq', '333.328125px');
    cy.get('[data-testid=child-2]').invoke('css', 'width').should('eq', '333.328125px');
    cy.get('[data-testid=child-3]').invoke('css', 'width').should('eq', '333.328125px');
  });

  it('should space children', () => {
    mount(
      <Parent>
        <HStack spacing={10}>
          <Layout data-testid="child-1" background={prettyColors[0]} height={20}>
            a
          </Layout>
          <Layout data-testid="child-2" background={prettyColors[1]} height={20}>
            b
          </Layout>
          <Layout data-testid="child-3" background={prettyColors[2]} height={20}>
            c
          </Layout>
        </HStack>
      </Parent>,
    );

    // Values are snapshotted
    cy.get('[data-testid=child-1]').invoke('css', 'width').should('eq', '326.65625px');
    cy.get('[data-testid=child-2]').invoke('css', 'width').should('eq', '326.65625px');
    cy.get('[data-testid=child-3]').invoke('css', 'width').should('eq', '326.65625px');
  });

  it('children should have their own height', () => {
    mount(
      <Parent>
        <HStack>
          <Layout data-testid="child-1" background={prettyColors[0]} height={20}>
            a
          </Layout>
        </HStack>
      </Parent>,
    );

    cy.get('[data-testid=child-1]').invoke('css', 'height').should('eq', '20px');
  });
});
