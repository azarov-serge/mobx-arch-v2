import React from 'react';
import { useSearchParams } from 'react-router';
import { observer } from 'mobx-react';
import { Spinner, TableRow } from '@admiral-ds/react-ui';

import { useGetCocktails } from '../../../../share/hooks';
import { LastRowWrapper } from '../../../../share/ui-kit';
import { useColumns } from './hooks/use-columns';
import { Styled } from './styled';

export const Cocktails: React.FC = observer(() => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') ?? '';
  const { isFetching, getData, nextPage, data } = useGetCocktails(category);
  const columns = useColumns();
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!category) {
      return;
    }

    getData(category);
  }, [category]);

  if (!category) {
    return null;
  }

  const { data: cocktails } = data ?? {};
  const rowsCount = data?.count ?? 0;
  const rowsAmount = (data?.page ?? 0) * (data?.limit ?? 0);

  const onUploadNewRows = () => {
    if (!category) {
      return;
    }

    if (!isFetching && rowsAmount < rowsCount) {
      if (nextPage(category, `${data?.lastId ?? ''}`)) {
        getData(category);
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
