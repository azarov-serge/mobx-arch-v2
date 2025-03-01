import styled from 'styled-components';

import { Table as TableUI } from '@admiral-ds/react-ui';

const Table = styled(TableUI)`
  height: 320px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  width: 100%;
`;

export const Styled = {
  Table,
  Footer,
};
