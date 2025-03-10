import React from 'react';
import { observer } from 'mobx-react';
import { Link, useParams } from 'react-router';
import { Spinner } from '@admiral-ds/react-ui';

import { Styled } from './styled';
import { useGetCocktail } from '../../share/hooks';
import { NotFoundPage } from '../not-found-page';

export const CocktailPage: React.FC = observer(() => {
  const { id = '' } = useParams();

  const { isFetching, isFetched, fetchData, data } = useGetCocktail(id);

  React.useEffect(() => {
    if (!id) {
      return;
    }

    if (!isFetching && !isFetched) {
      fetchData({ params: { i: id } });
    }
  }, [id, isFetching, isFetched]);

  if (isFetching) {
    return (
      <Styled.Spinner>
        <Spinner />
      </Styled.Spinner>
    );
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
            {data?.ingredients.length ? (
              <ul>
                {data.ingredients.map((ingredient) => (
                  <li key={ingredient}>{ingredient}</li>
                ))}
              </ul>
            ) : (
              '-'
            )}
          </div>
        </Styled.Info>
      </Styled.Wrapper>
    </>
  );
});
