/// <reference types="cypress" />
/// <reference types="cypress-wait-until" />
/// <reference types="../environment" />

import { mount } from 'cypress-react-unit-test';
import { View } from '../../modules/atom_ui/mod';
import { Parent } from '../utils/_parent';

const prettyColors = ['#10100e', '#01fdf8', '#0041f8', '#f93bfa', '#f70000'] as const;

type LocationInvokeFn = ($el: JQueryInstance) => boolean;
const locationInvoke = (top: number, right: number, bottom: number, left: number): LocationInvokeFn => {
  return ($el: JQueryInstance): boolean => {
    const rect = $el[0].getBoundingClientRect();

    if (top !== rect.top) {
      throw new Error(`it's top position has changed, expected: ${top} but got ${rect.top}`);
    }

    if (right !== rect.right) {
      throw new Error(`it's right position has changed, expected: ${right} but got ${rect.right}`);
    }

    if (bottom !== rect.bottom) {
      throw new Error(`it's bottom position has changed, expected: ${bottom} but got ${rect.bottom}`);
    }

    if (left !== rect.left) {
      throw new Error(`it's left position has changed, expected: ${left} but got ${rect.left}`);
    }

    return true;
  };
};

describe('View.h - flex direction and size', () => {
  it('asserts that parent will have children as columns and they will grow', () => {
    mount(
      <Parent>
        <View.h data-testid="parent" background={prettyColors[0]}>
          <View.h data-testid="child-1" background={prettyColors[1]}></View.h>
          <View.h data-testid="child-2" background={prettyColors[2]}></View.h>
          <View.h data-testid="child-3" background={prettyColors[3]}></View.h>
          <View.h data-testid="child-4" background={prettyColors[4]}></View.h>
        </View.h>
      </Parent>,
    );

    cy.get('[data-testid=parent]').invoke('css', 'height').should('eq', '660px');
    cy.get('[data-testid=parent]').invoke('css', 'width').should('eq', '1000px');

    cy.get('[data-testid=child-1]').invoke('css', 'height').should('eq', '165px');
    cy.get('[data-testid=child-1]').invoke('css', 'width').should('eq', '1000px');

    cy.get('[data-testid=child-2]').invoke('css', 'height').should('eq', '165px');
    cy.get('[data-testid=child-2]').invoke('css', 'width').should('eq', '1000px');

    cy.get('[data-testid=child-3]').invoke('css', 'height').should('eq', '165px');
    cy.get('[data-testid=child-3]').invoke('css', 'width').should('eq', '1000px');

    cy.get('[data-testid=child-4]').invoke('css', 'height').should('eq', '165px');
    cy.get('[data-testid=child-4]').invoke('css', 'width').should('eq', '1000px');
  });

  it('asserts that parent will have children as rows and they will grow', () => {
    mount(
      <Parent>
        <View.h direction="row" data-testid="parent" background={prettyColors[0]}>
          <View.h data-testid="child-1" background={prettyColors[1]}></View.h>
          <View.h data-testid="child-2" background={prettyColors[2]}></View.h>
          <View.h data-testid="child-3" background={prettyColors[3]}></View.h>
          <View.h data-testid="child-4" background={prettyColors[4]}></View.h>
        </View.h>
      </Parent>,
    );

    cy.get('[data-testid=parent]').invoke('css', 'height').should('eq', '660px');
    cy.get('[data-testid=parent]').invoke('css', 'width').should('eq', '1000px');

    cy.get('[data-testid=child-1]').invoke('css', 'height').should('eq', '660px');
    cy.get('[data-testid=child-1]').invoke('css', 'width').should('eq', '250px');

    cy.get('[data-testid=child-2]').invoke('css', 'height').should('eq', '660px');
    cy.get('[data-testid=child-2]').invoke('css', 'width').should('eq', '250px');

    cy.get('[data-testid=child-3]').invoke('css', 'height').should('eq', '660px');
    cy.get('[data-testid=child-3]').invoke('css', 'width').should('eq', '250px');

    cy.get('[data-testid=child-4]').invoke('css', 'height').should('eq', '660px');
    cy.get('[data-testid=child-4]').invoke('css', 'width').should('eq', '250px');
  });

  it('asserts that a child may have fixed width', () => {
    mount(
      <Parent>
        <View.h direction="row" data-testid="parent" background={prettyColors[0]}>
          <View.h data-testid="child-1" background={prettyColors[1]} width={625} shrink={false}></View.h>
          <View.h data-testid="child-2" background={prettyColors[2]}></View.h>
          <View.h data-testid="child-3" background={prettyColors[3]}></View.h>
          <View.h data-testid="child-4" background={prettyColors[4]}></View.h>
        </View.h>
      </Parent>,
    );

    cy.get('[data-testid=parent]').invoke('css', 'height').should('eq', '660px');
    cy.get('[data-testid=parent]').invoke('css', 'width').should('eq', '1000px');

    cy.get('[data-testid=child-1]').invoke('css', 'height').should('eq', '660px');
    cy.get('[data-testid=child-1]').invoke('css', 'width').should('eq', '625px');

    cy.get('[data-testid=child-2]').invoke('css', 'height').should('eq', '660px');
    cy.get('[data-testid=child-2]').invoke('css', 'width').should('eq', '125px');

    cy.get('[data-testid=child-3]').invoke('css', 'height').should('eq', '660px');
    cy.get('[data-testid=child-3]').invoke('css', 'width').should('eq', '125px');

    cy.get('[data-testid=child-4]').invoke('css', 'height').should('eq', '660px');
    cy.get('[data-testid=child-4]').invoke('css', 'width').should('eq', '125px');
  });

  it('asserts that a child may have fixed height', () => {
    mount(
      <Parent>
        <View.h direction="row" data-testid="parent" background={prettyColors[0]}>
          <View.h data-testid="child-1" background={prettyColors[1]} height={500}></View.h>
          <View.h data-testid="child-2" background={prettyColors[2]}></View.h>
          <View.h data-testid="child-3" background={prettyColors[3]}></View.h>
          <View.h data-testid="child-4" background={prettyColors[4]}></View.h>
        </View.h>
      </Parent>,
    );

    cy.get('[data-testid=parent]').invoke('css', 'height').should('eq', '660px');
    cy.get('[data-testid=parent]').invoke('css', 'width').should('eq', '1000px');

    cy.get('[data-testid=child-1]').invoke('css', 'height').should('eq', '500px');
    cy.get('[data-testid=child-1]').invoke('css', 'width').should('eq', '250px');

    cy.get('[data-testid=child-2]').invoke('css', 'height').should('eq', '660px');
    cy.get('[data-testid=child-2]').invoke('css', 'width').should('eq', '250px');

    cy.get('[data-testid=child-3]').invoke('css', 'height').should('eq', '660px');
    cy.get('[data-testid=child-3]').invoke('css', 'width').should('eq', '250px');

    cy.get('[data-testid=child-4]').invoke('css', 'height').should('eq', '660px');
    cy.get('[data-testid=child-4]').invoke('css', 'width').should('eq', '250px');
  });

  it('asserts that a child may have fixed width', () => {
    mount(
      <Parent>
        <View.h direction="row" data-testid="parent" background={prettyColors[0]}>
          <View.h data-testid="child-1" background={prettyColors[1]} width="625px" shrink={false}></View.h>
          <View.h data-testid="child-2" background={prettyColors[2]}></View.h>
          <View.h data-testid="child-3" background={prettyColors[3]}></View.h>
          <View.h data-testid="child-4" background={prettyColors[4]}></View.h>
        </View.h>
      </Parent>,
    );

    cy.get('[data-testid=parent]').invoke('css', 'height').should('eq', '660px');
    cy.get('[data-testid=parent]').invoke('css', 'width').should('eq', '1000px');

    cy.get('[data-testid=child-1]').invoke('css', 'height').should('eq', '660px');
    cy.get('[data-testid=child-1]').invoke('css', 'width').should('eq', '625px');

    cy.get('[data-testid=child-2]').invoke('css', 'height').should('eq', '660px');
    cy.get('[data-testid=child-2]').invoke('css', 'width').should('eq', '125px');

    cy.get('[data-testid=child-3]').invoke('css', 'height').should('eq', '660px');
    cy.get('[data-testid=child-3]').invoke('css', 'width').should('eq', '125px');

    cy.get('[data-testid=child-4]').invoke('css', 'height').should('eq', '660px');
    cy.get('[data-testid=child-4]').invoke('css', 'width').should('eq', '125px');
  });

  it('asserts that a child may have fixed height', () => {
    mount(
      <Parent>
        <View.h direction="row" data-testid="parent" background={prettyColors[0]}>
          <View.h data-testid="child-1" background={prettyColors[1]} height="500px"></View.h>
          <View.h data-testid="child-2" background={prettyColors[2]}></View.h>
          <View.h data-testid="child-3" background={prettyColors[3]}></View.h>
          <View.h data-testid="child-4" background={prettyColors[4]}></View.h>
        </View.h>
      </Parent>,
    );

    cy.get('[data-testid=parent]').invoke('css', 'height').should('eq', '660px');
    cy.get('[data-testid=parent]').invoke('css', 'width').should('eq', '1000px');

    cy.get('[data-testid=child-1]').invoke('css', 'height').should('eq', '500px');
    cy.get('[data-testid=child-1]').invoke('css', 'width').should('eq', '250px');

    cy.get('[data-testid=child-2]').invoke('css', 'height').should('eq', '660px');
    cy.get('[data-testid=child-2]').invoke('css', 'width').should('eq', '250px');

    cy.get('[data-testid=child-3]').invoke('css', 'height').should('eq', '660px');
    cy.get('[data-testid=child-3]').invoke('css', 'width').should('eq', '250px');

    cy.get('[data-testid=child-4]').invoke('css', 'height').should('eq', '660px');
    cy.get('[data-testid=child-4]').invoke('css', 'width').should('eq', '250px');
  });
});

// ***********************************************
// Alignment assertions
// ***********************************************

describe('View.h - alignment', () => {
  const size = [100, 100] as const;

  it("asserts that parent as a column will align it's children topLeading", () => {
    mount(
      <Parent>
        <View.h background={prettyColors[0]} alignment="topLeading">
          <View.h data-testid="child-1" background={prettyColors[1]} width={100} height={100}></View.h>
        </View.h>
      </Parent>,
    );

    cy.get('[data-testid=child-1]').then(locationInvoke(0, 100, 100, 0)).should('eq', true);
  });

  it("asserts that parent as a column will align it's children top", () => {
    mount(
      <Parent>
        <View.h background={prettyColors[0]} alignment="top">
          <View.h data-testid="child-1" background={prettyColors[1]} width={100} height={100}></View.h>
        </View.h>
      </Parent>,
    );

    cy.get('[data-testid=child-1]').then(locationInvoke(0, 550, 100, 450)).should('eq', true);
  });

  it("asserts that parent as a column will align it's children topTrailing", () => {
    mount(
      <Parent>
        <View.h background={prettyColors[0]} alignment="topTrailing">
          <View.h data-testid="child-1" background={prettyColors[1]} width={100} height={100}></View.h>
        </View.h>
      </Parent>,
    );

    cy.get('[data-testid=child-1]').then(locationInvoke(0, 1000, 100, 900)).should('eq', true);
  });

  it("asserts that parent as a column will align it's children leading", () => {
    mount(
      <Parent>
        <View.h background={prettyColors[0]} alignment="leading">
          <View.h data-testid="child-1" background={prettyColors[1]} width={100} height={100}></View.h>
        </View.h>
      </Parent>,
    );

    cy.get('[data-testid=child-1]').then(locationInvoke(280, 100, 380, 0)).should('eq', true);
  });

  it("asserts that parent as a column align it's children center", () => {
    mount(
      <Parent>
        <View.h background={prettyColors[0]} alignment="center">
          <View.h data-testid="child-1" background={prettyColors[1]} width={size[0]} height={size[1]}></View.h>
        </View.h>
      </Parent>,
    );

    cy.get('[data-testid=child-1]').then(locationInvoke(280, 550, 380, 450)).should('eq', true);
  });

  it("asserts that parent as a column align it's children trailing", () => {
    mount(
      <Parent>
        <View.h background={prettyColors[0]} alignment="trailing">
          <View.h data-testid="child-1" background={prettyColors[1]} width={size[0]} height={size[1]}></View.h>
        </View.h>
      </Parent>,
    );

    cy.get('[data-testid=child-1]').then(locationInvoke(280, 1000, 380, 900)).should('eq', true);
  });

  it("asserts that parent as a column align it's children bottomLeading", () => {
    mount(
      <Parent>
        <View.h background={prettyColors[0]} alignment="bottomLeading">
          <View.h data-testid="child-1" background={prettyColors[1]} width={size[0]} height={size[1]}></View.h>
        </View.h>
      </Parent>,
    );

    cy.get('[data-testid=child-1]').then(locationInvoke(560, 100, 660, 0)).should('eq', true);
  });

  it("asserts that parent as a column align it's children bottom", () => {
    mount(
      <Parent>
        <View.h background={prettyColors[0]} alignment="bottom">
          <View.h data-testid="child-1" background={prettyColors[1]} width={size[0]} height={size[1]}></View.h>
        </View.h>
      </Parent>,
    );

    cy.get('[data-testid=child-1]').then(locationInvoke(560, 550, 660, 450)).should('eq', true);
  });

  it("asserts that parent as a column align it's children bottomTrailing", () => {
    mount(
      <Parent>
        <View.h background={prettyColors[0]} alignment="bottomTrailing">
          <View.h data-testid="child-1" background={prettyColors[1]} width={size[0]} height={size[1]}></View.h>
        </View.h>
      </Parent>,
    );

    cy.get('[data-testid=child-1]').then(locationInvoke(560, 1000, 660, 900)).should('eq', true);
  });

  it("asserts that parent as a column align it's children bottomTrailing", () => {
    mount(
      <Parent>
        <View.h background={prettyColors[0]} alignment="bottomTrailing">
          <View.h data-testid="child-1" background={prettyColors[1]} width={size[0]} height={size[1]}></View.h>
        </View.h>
      </Parent>,
    );

    cy.get('[data-testid=child-1]').then(locationInvoke(560, 1000, 660, 900)).should('eq', true);
  });

  it("asserts that parent as a column align it's children spaceStart", () => {
    mount(
      <Parent>
        <View.h background={prettyColors[0]} alignment="spaceStart">
          <View.h data-testid="child-1" background={prettyColors[1]} width={size[0]} height={size[1]}></View.h>
          <View.h data-testid="child-2" background={prettyColors[2]} width={size[0]} height={size[1]}></View.h>
        </View.h>
      </Parent>,
    );

    cy.get('[data-testid=child-1]').then(locationInvoke(0, 100, 100, 0)).should('eq', true);
    cy.get('[data-testid=child-2]').then(locationInvoke(560, 100, 660, 0)).should('eq', true);
  });

  it("asserts that parent as a column align it's children spaceCenter", () => {
    mount(
      <Parent>
        <View.h background={prettyColors[0]} alignment="spaceCenter">
          <View.h data-testid="child-1" background={prettyColors[1]} width={size[0]} height={size[1]}></View.h>
          <View.h data-testid="child-2" background={prettyColors[2]} width={size[0]} height={size[1]}></View.h>
        </View.h>
      </Parent>,
    );

    cy.get('[data-testid=child-1]').then(locationInvoke(0, 550, 100, 450)).should('eq', true);
    cy.get('[data-testid=child-2]').then(locationInvoke(560, 550, 660, 450)).should('eq', true);
  });

  it("asserts that parent as a column align it's children spaceEnd", () => {
    mount(
      <Parent>
        <View.h background={prettyColors[0]} alignment="spaceEnd">
          <View.h data-testid="child-1" background={prettyColors[1]} width={size[0]} height={size[1]}></View.h>
          <View.h data-testid="child-2" background={prettyColors[2]} width={size[0]} height={size[1]}></View.h>
        </View.h>
      </Parent>,
    );

    cy.get('[data-testid=child-1]').then(locationInvoke(0, 1000, 100, 900)).should('eq', true);
    cy.get('[data-testid=child-2]').then(locationInvoke(560, 1000, 660, 900)).should('eq', true);
  });

  // ***********************************************
  // Direction -> row
  // ***********************************************

  it("asserts that parent as a row will align it's children topLeading", () => {
    mount(
      <Parent>
        <View.h background={prettyColors[0]} direction="row" alignment="topLeading">
          <View.h data-testid="child-1" background={prettyColors[1]} width={100} height={100}></View.h>
        </View.h>
      </Parent>,
    );

    cy.get('[data-testid=child-1]').then(locationInvoke(0, 100, 100, 0)).should('eq', true);
  });

  it("asserts that parent as a row will align it's children top", () => {
    mount(
      <Parent>
        <View.h background={prettyColors[0]} direction="row" alignment="top">
          <View.h data-testid="child-1" background={prettyColors[1]} width={100} height={100}></View.h>
        </View.h>
      </Parent>,
    );

    cy.get('[data-testid=child-1]').then(locationInvoke(0, 550, 100, 450)).should('eq', true);
  });

  it("asserts that parent as a row will align it's children topTrailing", () => {
    mount(
      <Parent>
        <View.h background={prettyColors[0]} direction="row" alignment="topTrailing">
          <View.h data-testid="child-1" background={prettyColors[1]} width={100} height={100}></View.h>
        </View.h>
      </Parent>,
    );

    cy.get('[data-testid=child-1]').then(locationInvoke(0, 1000, 100, 900)).should('eq', true);
  });

  it("asserts that parent as a row will align it's children leading", () => {
    mount(
      <Parent>
        <View.h background={prettyColors[0]} direction="row" alignment="leading">
          <View.h data-testid="child-1" background={prettyColors[1]} width={100} height={100}></View.h>
        </View.h>
      </Parent>,
    );

    cy.get('[data-testid=child-1]').then(locationInvoke(280, 100, 380, 0)).should('eq', true);
  });

  it("asserts that parent as a row align it's children center", () => {
    mount(
      <Parent>
        <View.h background={prettyColors[0]} direction="row" alignment="center">
          <View.h data-testid="child-1" background={prettyColors[1]} width={size[0]} height={size[1]}></View.h>
        </View.h>
      </Parent>,
    );

    cy.get('[data-testid=child-1]').then(locationInvoke(280, 550, 380, 450)).should('eq', true);
  });

  it("asserts that parent as a row align it's children trailing", () => {
    mount(
      <Parent>
        <View.h background={prettyColors[0]} direction="row" alignment="trailing">
          <View.h data-testid="child-1" background={prettyColors[1]} width={size[0]} height={size[1]}></View.h>
        </View.h>
      </Parent>,
    );

    cy.get('[data-testid=child-1]').then(locationInvoke(280, 1000, 380, 900)).should('eq', true);
  });

  it("asserts that parent as a row align it's children bottomLeading", () => {
    mount(
      <Parent>
        <View.h background={prettyColors[0]} direction="row" alignment="bottomLeading">
          <View.h data-testid="child-1" background={prettyColors[1]} width={size[0]} height={size[1]}></View.h>
        </View.h>
      </Parent>,
    );

    cy.get('[data-testid=child-1]').then(locationInvoke(560, 100, 660, 0)).should('eq', true);
  });

  it("asserts that parent as a row align it's children bottom", () => {
    mount(
      <Parent>
        <View.h background={prettyColors[0]} direction="row" alignment="bottom">
          <View.h data-testid="child-1" background={prettyColors[1]} width={size[0]} height={size[1]}></View.h>
        </View.h>
      </Parent>,
    );

    cy.get('[data-testid=child-1]').then(locationInvoke(560, 550, 660, 450)).should('eq', true);
  });

  it("asserts that parent as a row align it's children bottomTrailing", () => {
    mount(
      <Parent>
        <View.h background={prettyColors[0]} direction="row" alignment="bottomTrailing">
          <View.h data-testid="child-1" background={prettyColors[1]} width={size[0]} height={size[1]}></View.h>
        </View.h>
      </Parent>,
    );

    cy.get('[data-testid=child-1]').then(locationInvoke(560, 1000, 660, 900)).should('eq', true);
  });

  it("asserts that parent as a row align it's children bottomTrailing", () => {
    mount(
      <Parent>
        <View.h background={prettyColors[0]} direction="row" alignment="bottomTrailing">
          <View.h data-testid="child-1" background={prettyColors[1]} width={size[0]} height={size[1]}></View.h>
        </View.h>
      </Parent>,
    );

    cy.get('[data-testid=child-1]').then(locationInvoke(560, 1000, 660, 900)).should('eq', true);
  });

  it("asserts that parent as a row align it's children spaceStart", () => {
    mount(
      <Parent>
        <View.h background={prettyColors[0]} direction="row" alignment="spaceStart">
          <View.h data-testid="child-1" background={prettyColors[1]} width={size[0]} height={size[1]}></View.h>
          <View.h data-testid="child-2" background={prettyColors[2]} width={size[0]} height={size[1]}></View.h>
        </View.h>
      </Parent>,
    );

    cy.get('[data-testid=child-1]').then(locationInvoke(0, 100, 100, 0)).should('eq', true);
    cy.get('[data-testid=child-2]').then(locationInvoke(0, 1000, 100, 900)).should('eq', true);
  });

  it("asserts that parent as a row align it's children spaceCenter", () => {
    mount(
      <Parent>
        <View.h background={prettyColors[0]} direction="row" alignment="spaceCenter">
          <View.h data-testid="child-1" background={prettyColors[1]} width={size[0]} height={size[1]}></View.h>
          <View.h data-testid="child-2" background={prettyColors[2]} width={size[0]} height={size[1]}></View.h>
        </View.h>
      </Parent>,
    );

    cy.get('[data-testid=child-1]').then(locationInvoke(280, 100, 380, 0)).should('eq', true);
    cy.get('[data-testid=child-2]').then(locationInvoke(280, 1000, 380, 900)).should('eq', true);
  });

  it("asserts that parent as a row align it's children spaceEnd", () => {
    mount(
      <Parent>
        <View.h background={prettyColors[0]} direction="row" alignment="spaceEnd">
          <View.h data-testid="child-1" background={prettyColors[1]} width={size[0]} height={size[1]}></View.h>
          <View.h data-testid="child-2" background={prettyColors[2]} width={size[0]} height={size[1]}></View.h>
        </View.h>
      </Parent>,
    );

    cy.get('[data-testid=child-1]').then(locationInvoke(560, 100, 660, 0)).should('eq', true);
    cy.get('[data-testid=child-2]').then(locationInvoke(560, 1000, 660, 900)).should('eq', true);
  });
});

describe('View.h - boxes', () => {
  it('padding', () => {
    mount(
      <Parent>
        <View.h data-testid="parent" padding={20} background={prettyColors[0]}>
          <View.h data-testid="child-1" background={prettyColors[1]}></View.h>
        </View.h>
      </Parent>,
    );

    cy.get('[data-testid=child-1]').then(locationInvoke(20, 980, 640, 20)).should('eq', true);
  });

  it('margin', () => {
    mount(
      <Parent>
        <View.h data-testid="parent" background={prettyColors[0]}>
          <View.h data-testid="child-1" margin="20px 0" background={prettyColors[3]}></View.h>
        </View.h>
      </Parent>,
    );

    cy.get('[data-testid=child-1]').then(locationInvoke(20, 1000, 640, 0)).should('eq', true);
  });
});
