/// <reference types="../environment" />
import { OneAtomCommonPropType } from '../prop_type';
import styled from 'styled-components';
import { A11yRole } from './a11y_role.component';

export type OneAtomA11yRegionProps = OneAtomCommonPropType & {
  label: string;
};

const elements = {
  container: styled(A11yRole)``,
};

export const A11yRegion: FC<OneAtomA11yRegionProps> = function A11yRegion({ children, label, ...rest }) {
  return (
    <elements.container aria-label={label} role="region" {...rest}>
      {children}
    </elements.container>
  );
};
