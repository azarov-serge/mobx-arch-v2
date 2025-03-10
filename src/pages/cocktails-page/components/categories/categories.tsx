import React from 'react';
import { useSearchParams } from 'react-router';
import { observer } from 'mobx-react';

import { Spinner } from '@admiral-ds/react-ui';

import { useGetCategories } from '../../../../share/hooks';
import { Styled } from './styled';

const PARAM_NAME = 'category';

export const Categories: React.FC = observer(() => {
  const { isFetching, data, fetchData } = useGetCategories();
  const [searchParams, setSearchParams] = useSearchParams();
  const active = searchParams.get(PARAM_NAME);

  React.useEffect(() => {
    if (!data) {
      fetchData();
    }
  }, []);

  if (isFetching || !data) {
    return <p>Loading ....</p>;
  }

  if (!data) {
    return <p>No data</p>;
  }

  return (
    <Styled.List>
      {data.map((category, index) => {
        return (
          <Styled.Item
            key={`${category}-${index}`}
            $active={category === active}
            onClick={() => {
              setSearchParams((params) => {
                params.set(PARAM_NAME, category);

                return params;
              });
            }}
          >
            {category}
          </Styled.Item>
        );
      })}
    </Styled.List>
  );
});
