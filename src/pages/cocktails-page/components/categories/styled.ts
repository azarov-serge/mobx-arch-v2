import styled from 'styled-components';

const Spinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

const List = styled.ul`
  list-style: none;
`;

const Item = styled.li<{ $active: boolean }>`
  list-style: none;
  cursor: pointer;
  padding: 5px 0;
  ${(props) =>
    props.$active
      ? `color: ${props.theme.color['Primary/Primary 60 Main']}`
      : ''}
`;

export const Styled = {
  Spinner,
  List,
  Item,
};
