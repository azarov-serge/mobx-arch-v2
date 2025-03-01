import React from 'react';
import { data, Link, useNavigate, useSearchParams } from 'react-router';
import { Column } from '@admiral-ds/react-ui';

import { CategoryCocktail } from '../../../../../app/stores';

export const useColumns = (): Column[] => {
  const navigate = useNavigate();

  const columns: Column[] = [
    {
      name: 'name',
      title: 'Name',
      width: '100%',
      renderCell: (data, row) => <Link to={`/product/${row.id}`}>{data}</Link>,
    },
  ];

  return columns;
};
