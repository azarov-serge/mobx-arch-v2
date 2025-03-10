import { Link } from 'react-router';
import { Column } from '@admiral-ds/react-ui';

export const useColumns = (): Column[] => {
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
