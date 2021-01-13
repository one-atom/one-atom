import { ResetCss } from '../../modules/atom_ui/mod';
/// <reference types="../environment" />

export const Parent: FC = ({ children }) => {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        overflowY: 'hidden',
      }}
    >
      <ResetCss />
      {children}
    </div>
  );
};
