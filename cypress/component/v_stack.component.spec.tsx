/// <reference types="cypress" />
/// <reference types="cypress-wait-until" />
/// <reference types="../environment" />

import { mount } from 'cypress-react-unit-test';
import { Layout, VStack } from '../../modules/atom_ui/mod';
import { Parent } from '../utils/_parent';

const prettyColors = ['#10100e', '#01fdf8', '#0041f8', '#f93bfa', '#f70000'] as const;

describe('VStack.h - boxes', () => {
  it('children should have equal height', () => {
    mount(
      <Parent>
        <VStack>
          <Layout data-testid="child-1" background={prettyColors[0]} width={20} height={200}>
            a
          </Layout>
          <Layout data-testid="child-2" background={prettyColors[1]} width={20} height={200}>
            b
          </Layout>
          <Layout data-testid="child-3" background={prettyColors[2]} width={20} height={200}>
            c
          </Layout>
        </VStack>
      </Parent>,
    );

    // Values are snapshotted
    cy.get('[data-testid=child-1]').invoke('css', 'height').should('eq', '219.984375px');
    cy.get('[data-testid=child-2]').invoke('css', 'height').should('eq', '219.984375px');
    cy.get('[data-testid=child-3]').invoke('css', 'height').should('eq', '219.984375px');
  });

  it('should space children', () => {
    mount(
      <Parent>
        <VStack spacing={10}>
          <Layout data-testid="child-1" background={prettyColors[0]} width={20}>
            a
          </Layout>
          <Layout data-testid="child-2" background={prettyColors[1]} width={20}>
            b
          </Layout>
          <Layout data-testid="child-3" background={prettyColors[2]} width={20}>
            c
          </Layout>
        </VStack>
      </Parent>,
    );

    // Values are snapshotted
    cy.get('[data-testid=child-1]').invoke('css', 'height').should('eq', '213.328125px');
    cy.get('[data-testid=child-2]').invoke('css', 'height').should('eq', '213.328125px');
    cy.get('[data-testid=child-3]').invoke('css', 'height').should('eq', '213.328125px');
  });

  it('children should have their own width', () => {
    mount(
      <Parent>
        <VStack>
          <Layout data-testid="child-1" background={prettyColors[0]} width={20}>
            a
          </Layout>
        </VStack>
      </Parent>,
    );

    cy.get('[data-testid=child-1]').invoke('css', 'width').should('eq', '20px');
  });
});
