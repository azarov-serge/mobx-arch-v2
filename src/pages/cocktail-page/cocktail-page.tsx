import React from 'react';
import { observer } from 'mobx-react';
import { Link, useParams } from 'react-router';

import { Styled } from './styled';
import { useGetCocktail } from '../../shared/hooks';
import { NotFoundPage } from '../not-found-page';

export const CocktailPage: React.FC = observer(() => {
  const { id = '' } = useParams();

  const { isFetching, isFetched, fetchData, data } = useGetCocktail(id);

  React.useEffect(() => {
    if (!id) {
      return;
    }

    if (!isFetching && !isFetched) {
      fetchData();
    }
  }, [id, isFetching, isFetched]);

  if (isFetching) {
    return <p>Loading ....</p>;
  }

  if (isFetched && !data) {
    return <NotFoundPage />;
  }

  return (
    <>
      <Link to={`/?category=${data?.category}`}>{'<-- Go back'}</Link>
      <Styled.Wrapper>
        <Styled.Img>
          <img src={data?.img} alt={data?.name} />
        </Styled.Img>
        <Styled.Info>
          <h1>{data?.name}</h1>
          <p>
            <b>Type: </b>
            {data?.type}
          </p>

          <p>
            <b>Instructions: </b>
            {data?.instructions}
          </p>

          <div>
            <b>Ingredients: </b>
            {data?.ingredients.length ? data.ingredients.join(', ') : '-'}
          </div>
        </Styled.Info>
      </Styled.Wrapper>
    </>
  );
});
