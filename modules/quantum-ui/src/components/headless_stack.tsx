import { FC } from 'react';
import { StyleSheetController } from '../helpers/style_sheet_controller';
import { KiraPropType } from '../prop_type';

/**
 * HeadLessStack
 */
export namespace HeadLessStack {
  interface HeadLessProps extends KiraPropType {
    parentClassName: string;
    childClassName: string;
  }
  export type Axis = 'Vertical' | 'Horizontal';

  export interface Props {
    spacing: number;
    axis: Axis;
    fluid: boolean;
  }

  interface InternalProps extends Props {
    children: (props: HeadLessProps) => JSX.Element;
  }

  const style_sheet_controller = new StyleSheetController();

  export const h: FC<InternalProps> = function Kira_HeadlessStack({ axis, fluid, spacing, children }) {
    const half_spacing = spacing / 2;
    const base_str = `${spacing}_${fluid ? 'y' : 'n'}_${axis === 'Vertical' ? 'v' : 'h'}`;
    const parent_class_name = `p_${base_str}`;
    const child_class_name = `c_${base_str}`;

    if (axis === 'Vertical') {
      style_sheet_controller
        .addToRegister(
          `.${parent_class_name}`,
          `
            display: flex;
            ${fluid ? `height: calc(100% + ${spacing}px);` : ''}
            flex-direction: column;
            margin-top: -${half_spacing}px!important;
            margin-bottom: -${half_spacing}px!important;
          `,
        )
        .addToRegister(
          `.${child_class_name}`,
          `
            ${fluid ? `height: 100%;` : ''}
            margin-top: ${half_spacing}px!important;
            margin-bottom: ${half_spacing}px!important;
          `,
        );
    } else {
      style_sheet_controller
        .addToRegister(
          `.${parent_class_name}`,
          `
          display: flex;
          ${fluid ? `width: calc(100% + ${spacing}px);` : ''}
          flex-direction: row;
          margin-left: -${half_spacing}px!important;
          margin-right: -${half_spacing}px!important;
        `,
        )
        .addToRegister(
          `.${child_class_name}`,
          `
          ${fluid ? `width: 100%;` : ''}
          margin-left: ${half_spacing}px!important;
          margin-right: ${half_spacing}px!important;
        `,
        );
    }

    return children({
      parentClassName: parent_class_name,
      childClassName: child_class_name,
    });
  };
}
