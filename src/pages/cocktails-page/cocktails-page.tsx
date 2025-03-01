import React from 'react';

import { Styled } from './styled';
import { Categories, Cocktails } from './components';

export const CocktailsPage: React.FC = () => {
  return (
    <Styled.Wrapper>
      <Styled.Categories>
        <Categories />
      </Styled.Categories>
      <Styled.Cocktails>
        <Cocktails />
      </Styled.Cocktails>
    </Styled.Wrapper>
  );
};
