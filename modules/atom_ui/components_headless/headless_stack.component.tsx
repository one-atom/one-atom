/// <reference types="../environment" />
import { useMemo, Children } from 'react';
import { StyleSheetController } from '../helpers/style_sheet_controller';
import { OneAtomCommonPropType } from '../prop_type';

interface HeadLessProps extends OneAtomCommonPropType {
  parentClassName: string;
  childClassName: string;
}
export type OneAtomHeadlessStackAxis = 'Vertical' | 'Horizontal';

export interface OneAtomHeadlessStackProps {
  spacing: number;
  axis: OneAtomHeadlessStackAxis;
  fluid: boolean;
  childLength: number;
}

interface InternalProps extends OneAtomHeadlessStackProps {
  children: (props: HeadLessProps) => JSX.Element;
}

const style_sheet_controller = new StyleSheetController();

export const HeadLessStack: FC<InternalProps> = function OneAtom_HeadlessStack({ axis, fluid, spacing, childLength, children }) {
  const halfSpacing = spacing / 2;
  const base_str = `${spacing}_${fluid ? 'y' : 'n'}_${axis === 'Vertical' ? 'v' : 'h'}`;
  const childClassName = `c_${base_str}${childLength !== 0 ? `_l_${childLength}` : ''}`;
  const parentClassName = `p_${base_str}`;

  if (axis === 'Vertical') {
    style_sheet_controller
      .addToRegister(
        `.${parentClassName}`,
        `
          display: flex;
          ${fluid ? `height: calc(100% + ${spacing}px);` : ''}
          flex-direction: column;
          margin-top: -${halfSpacing}px!important;
          margin-bottom: -${halfSpacing}px!important;
        `,
      )
      .addToRegister(
        `.${childClassName}`,
        `
          ${fluid ? `height: ${childLength !== 0 ? 100 / childLength : 100}%!important;` : ''}
          margin-top: ${halfSpacing}px!important;
          margin-bottom: ${halfSpacing}px!important;
        `,
      );
  } else {
    style_sheet_controller
      .addToRegister(
        `.${parentClassName}`,
        `
        display: flex;
        ${fluid ? `width: calc(100% + ${spacing}px);` : ''}
        flex-direction: row;
        margin-left: -${halfSpacing}px!important;
        margin-right: -${halfSpacing}px!important;
      `,
      )
      .addToRegister(
        `.${childClassName}`,
        `
        ${fluid ? `width: ${childLength !== 0 ? 100 / childLength : 100}%!important;` : ''}
        margin-left: ${halfSpacing}px!important;
        margin-right: ${halfSpacing}px!important;
      `,
      );
  }

  return children({
    parentClassName: parentClassName,
    childClassName: childClassName,
  });
};
