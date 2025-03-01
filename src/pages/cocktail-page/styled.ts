import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Img = styled.div`
  width: 25%;
  padding: 20px;
  box-sizing: border-box;

  img {
    width: 100%;
  }
`;

const Info = styled.div`
  width: 75%;
`;

const Spinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

export const Styled = {
  Wrapper,
  Img,
  Info,
  Spinner,
};
