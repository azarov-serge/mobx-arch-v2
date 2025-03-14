import React from 'react';
import { useSearchParams } from 'react-router';
import { observer } from 'mobx-react';
import { Spinner, TableRow } from '@admiral-ds/react-ui';

import { useGetCocktails } from '../../../../shared/hooks';
import { LastRowWrapper } from '../../../../shared/ui-kit';
import { useColumns } from './hooks/use-columns';
import { Styled } from './styled';

export const Cocktails: React.FC = observer(() => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') ?? '';
  const { isFetching, isFetched, fetchData, nextPage, data, resetQuery } =
    useGetCocktails();
  const columns = useColumns();
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!category) {
      return;
    }

    fetchData(category);

    return () => resetQuery();
  }, [category]);

  if (!category) {
    return null;
  }

  const { data: cocktails } = data ?? {};
  const rowsCount = data?.count ?? 0;
  const rowsAmount = (data?.page ?? 0) * (data?.limit ?? 0);

  if (!isFetched && (data?.page ?? 0) < 1) {
    return <p>Loading ...</p>;
  }

  const onUploadNewRows = () => {
    if (!category) {
      return;
    }

    if (!isFetching && rowsAmount < rowsCount) {
      if (nextPage({ 'last-id': data?.lastId ?? '' })) {
        fetchData(category);
      }
    }
  };

  const renderRowWrapper = (
    row: TableRow,
    index: number,
    rowNode: React.ReactNode
  ) => {
    return index === rowsAmount - 1 ? (
      <LastRowWrapper
        key={row.id}
        containerRef={ref}
        rowNode={rowNode}
        onVisible={onUploadNewRows}
      />
    ) : (
      rowNode
    );
  };

  return (
    <>
      <Styled.Table
        ref={ref}
        columnList={columns}
        rowList={cocktails ?? []}
        renderRowWrapper={renderRowWrapper}
        virtualScroll={{ fixedRowHeight: 40 }}
      />
      <Styled.Footer>
        {isFetching ? <Spinner /> : `${cocktails?.length ?? 0}/${rowsCount}`}
      </Styled.Footer>
    </>
  );
});
