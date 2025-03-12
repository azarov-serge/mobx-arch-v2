# MobX arch v2

- [MobX arch v2](#mobx-arch-v2)
  - [Описание библиотеки](#описание-библиотеки)
  - [Запуск проекта](#запуск-проекта)
  - [Простой GET-запрос](#простой-get-запрос)
    - [Создать сервис](#создать-сервис)
    - [Создать view](#создать-view)
    - [Создать hook](#создать-hook)
    - [Применение](#применение)
  - [GET-запрос элемента с помощью urlParam `GET: http://localhost:8001/config/{item-id}`](#get-запрос-элемента-с-помощью-urlparam-get-httplocalhost8001configitem-id)
    - [Создать сервис](#создать-сервис-1)
    - [Создать view](#создать-view-1)
    - [Создать hook](#создать-hook-1)
    - [Применение](#применение-1)
  - [GET-запрос элемента с помощью searchParams `GET: http://localhost:8001/config?id={item-id}`](#get-запрос-элемента-с-помощью-searchparams-get-httplocalhost8001configiditem-id)
    - [Создать сервис](#создать-сервис-2)
    - [Создать view](#создать-view-2)
    - [Создать hook](#создать-hook-2)
    - [Применение](#применение-2)
  - [GET-запрос элементов с пагинацией](#get-запрос-элементов-с-пагинацией)
    - [Создать сервис](#создать-сервис-3)
    - [Создать view](#создать-view-3)
    - [Создать hook](#создать-hook-3)
    - [Применение](#применение-3)
  - [PUT-запрос (редактирование элемента)](#put-запрос-редактирование-элемента)
    - [Создать сервис](#создать-сервис-4)
    - [Создать view](#создать-view-4)
    - [Создать hook](#создать-hook-4)
    - [Применение](#применение-4)

## Описание библиотеки
Общая библиотека для WD проектов. Включает в себя:
- `/src/app/stores` - новое core для создания сервисов и вьюх
    - `/src/app/stores/core/rest-service.ts` - сервис позволяющий делать сетевые запрос и хранить статусы в локальном состоянии сервиса. Статус - это инстанс класса `/src/app/stores/core/queries/query-status.ts`. Хранит состояния:
        - `isFetching` - выполняется загрузка (`true`/`false`)
        - `isFetched` - загрузка выполнена (`true`/`false`)
        - `data` - полученные данные
        - `error` - ошибка. Инстанс класса `/src/app/stores/core/queries/query-error.ts`
    - `/src/app/stores/core/queries` - набор классов для работы с сетевыми запросами.
      - `/src/app/stores/core/queries/query.ts` - класс для простых сетевых запросов. Содержит:
        - `key` - уникальный ключ запроса.
        - `id` - уникальный id для POST, PATCH, PUT, DELETE запросов. будет использоваться для формирования уникально ключа запроса.
        - `url` - URL для запроса с search параметрами
        - `urlParam` - нужен как параметр для GET / DELETE запросов (получить / удалить элемент). Может использоваться как уникальный ключ.
        - `baseUrl` - базовый `url` без `search params` и `url param`
        - `method` - `GET` | `POST` | `PUT` | `PATCH` | `DELETE`
        - `params` -  `search params` (`{ ключ: значение }`)
      - `/src/app/stores/core/queries/pagination-query.ts` - класс для сетевых запросов с пагинацией. Содержит:
        - `key` - уникальный ключ запроса.
        - `keys` - массив уникальных ключей запроса.
        - `id` - уникальный id для POST, PATCH, PUT, DELETE запросов. будет использоваться для формирования уникально ключа запроса.
        - `url` - URL - для запроса с search параметрами
        - `urls` - массив URL-ов страниц для запросов с search параметрами.
        - `baseUrl` - базовый `url` без `search params` и `url param`
        - `method` - `GET` | `POST` | `PUT` | `PATCH` | `DELETE`
        - `params` -  `search params` - `{ ключ: значение }`
        - `page` - текущая страница
        - `pageParams` - параметры страницы - `{ страница: { ключ: значение } }`;
        - `pageLimit` - лимиты страницы - `{ страница: { ключ: значение } }`;
        - `limit` - текущий лимит страницы
        - `nextPage` - установить следующую страницу
        - `setParams` - установка `search params`

  
[к оглавлению](#mobx-arch-v2)


## Запуск проекта
1. Установить пакеты  `npm i`
2. Запустить проект  `npm run start`

[к оглавлению](#mobx-arch-v2)

## Простой GET-запрос
### Создать сервис
```typescript
import { makeObservable } from "mobx";
import { FetchResource, QueryStatus } from "wd-front-core";

export type ConfigItemResponse = {
  id: number;
  name: string;
};

// Создать запросы
const queries: Record<CommonKey, Query | PaginationQuery> = {
  // Создать простой GET-запрос
  config: new Query({
    url: `${BASE_URL}/config`,
  }),
};

export type CommonKey = "config"; // Ключи из queries
export type CommonServiceType = ConfigItemResponse[] | boolean;

export class CommonService extends FetchResource<CommonServiceType, CommonKey> {
  constructor() {
    super(queries);
    makeObservable(this);
  }

  fetchConfig = async (): Promise<QueryStatus<ConfigItemResponse[]>> => {
    return this.rest.request<ConfigItemResponse[]>({
      query: this.queries.config,
    });
  };
}

export const commonService = new CommonService();
```

[к оглавлению](#mobx-arch-v2)


### Создать view

```typescript
import { makeObservable } from "mobx";

import { QueryData, View } from "wd-front-core";

import { CommonKey, CommonService, commonService, commonService } from "@stores/services";

export type ConfigData = Awaited<ReturnType<typeof commonService.fetchConfig>>["data"];

class CommonView extends View<CommonService, CommonKey> {
  constructor() {
    super(commonService);
    makeObservable(this);
  }

  public createConfigData = (): QueryData<ConfigData, typeof commonService.fetchConfig> => {
    const query = this.service.queries.config;
    const status = this.service.getStatus<ConfigData>(query.key);
    const helpers = this.createHelpers("config");

    return {
      ...status,
      ...helpers,
      fetchData: this.service.fetchConfig,
    };
  };
}

export const commonView = new CommonView();
```

[к оглавлению](#mobx-arch-v2)


### Создать hook
```typescript
import { commonView } from "@stores";

export const useGetConfig = () => {
  return commonView.createConfigData();
};

```
[к оглавлению](#mobx-arch-v2)


### Применение
```typescript
import React from "react";

import { observer } from "mobx-react";
import { Modal, T } from "wd-front-core";
import { InnerPage } from "@components";
import { useGetConfig } from "@hooks";

export const ConfigPage: React.FC = observer(() => {
  const { isFetching, fetchData, data, error, clearError } = useGetConfig();

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <InnerPage title="Config page">
      {isFetching ? (
        <p>Loading data ...</p>
      ) : (
        <>
          {data && (
            <ol>
              {(data ?? []).map((item) => (
                <li key={item.id}>{item.name}</li>
              ))}
            </ol>
          )}
        </>
      )}
      <Modal
        isOpen={Boolean(error?.message)}
        title={"Ошибка"}
        onClose={clearError}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onAfterClose={clearError}
        width={480}
      >
        <T font={"Body/Body 1 Long"}>{error?.message}</T>
      </Modal>
    </InnerPage>
  );
});

```

[к оглавлению](#mobx-arch-v2)

## GET-запрос элемента с помощью urlParam `GET: http://localhost:8001/config/{item-id}`
### Создать сервис
```typescript
import { makeObservable } from "mobx";
import { FetchResource, QueryStatus } from "wd-front-core";

export type ConfigItemResponse = {
  id: number;
  name: string;
};

// Создать запросы
const queries: Record<CommonKey, Query | PaginationQuery> = {
  // Создать GET-запрос
  configItem: new Query({
    url: `${BASE_URL}/config`,
  }),
};

export type CommonKey = "configItem"; // Ключи из queries
export type CommonServiceType = ConfigItemResponse | boolean;

export class CommonService extends FetchResource<CommonServiceType, CommonKey> {
  constructor() {
    super(queries);
    makeObservable(this);
  }

  fetchConfigItem = async (id: string): Promise<QueryStatus<ConfigItemResponse>> => {
    const query = this.queries.configItem.copyWith({
      urlParam: id,
    });

    return this.rest.request<ConfigItemResponse | null>({
      query,
    });
  };
}

export const commonService = new CommonService();
```

[к оглавлению](#mobx-arch-v2)


### Создать view

```typescript
import { makeObservable } from "mobx";

import { QueryData, View } from "wd-front-core";

import { CommonKey, CommonService, commonService, commonService } from "@stores/services";


export type ConfigItemData = Awaited<ReturnType<typeof commonService.fetchConfigItem>>["data"];

class CommonView extends View<CommonService, CommonKey> {
  constructor() {
    super(commonService);
    makeObservable(this);
  }

  public createConfigItemData = (id: string): QueryData<ConfigItemData, typeof commonService.fetchConfigItem> => {
    const query = this.service.queries.configItem.copyWith({
      urlParam: id,
    });

    const status = this.service.getStatus<ConfigItemData>(query.key);
    const helpers = this.createHelpers("configItem");

    return {
      ...status,
      ...helpers,
      fetchData: this.service.fetchConfigItem,
    };
  };
}

export const commonView = new CommonView();
```

[к оглавлению](#mobx-arch-v2)


### Создать hook
```typescript
import { commonView } from "@stores";

export const useGetConfigItem = () => {
  const { isFetching, isFetched, data, error, resetQuery, ...cbs } = commonView.createConfigItemData(id);

  const helpers = React.useMemo(() => {
    return {
      fetchData: () => cbs.fetchData(id),
      clearError: () => cbs.clearError({ urlParam: id }),
      reset: () => cbs.reset({ urlParam: id }),
    };
  }, [id]);

  return {
    isFetching,
    isFetched,
    data,
    error,
    resetQuery,
    ...helpers,
  };
};

```
[к оглавлению](#mobx-arch-v2)


### Применение
```typescript
import React from "react";

import { observer } from "mobx-react";
import { Modal, T } from "wd-front-core";
import { InnerPage } from "@components";
import { useGetConfigItem } from "@hooks";

export const ConfigItemPage: React.FC = observer(() => {
  const { id = "" } = useParams();
  const { isFetching, fetchData, data, error, clearError } = useGetConfigItem(id);

  React.useEffect(() => {
    if (!id) {
      return;
    }

    fetchData();
  }, [id]);

  return (
    <InnerPage title="Config item page">
      {isFetching ? (
        <p>Loading data ...</p>
      ) : (
        {data && <p>{data.name}</p>}
      )}
      <Modal
        isOpen={Boolean(error?.message)}
        title={"Ошибка"}
        onClose={clearError}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onAfterClose={clearError}
        width={480}
      >
        <T font={"Body/Body 1 Long"}>{error?.message}</T>
      </Modal>
    </InnerPage>
  );
});

```

[к оглавлению](#mobx-arch-v2)

## GET-запрос элемента с помощью searchParams `GET: http://localhost:8001/config?id={item-id}`
### Создать сервис
```typescript
import { makeObservable } from "mobx";
import { FetchResource, QueryStatus } from "wd-front-core";

export type ConfigItemResponse = {
  id: number;
  name: string;
};

// Создать запросы
const queries: Record<CommonKey, Query | PaginationQuery> = {
  // Создать GET-запрос
  configItem: new Query({
    url: `${BASE_URL}/config`,
  }),
};

export type CommonKey = "configItem"; // Ключи из queries
export type CommonServiceType = ConfigItemResponse | boolean;

export class CommonService extends FetchResource<CommonServiceType, CommonKey> {
  constructor() {
    super(queries);
    makeObservable(this);
  }

  fetchConfigItem = async (id: string): Promise<QueryStatus<ConfigItemResponse>> => {
    const query = this.queries.configItem.copyWith({
      params: { id },
    });

    return this.rest.request<ConfigItemResponse | null>({
      query,
    });
  };
}

export const commonService = new CommonService();
```

[к оглавлению](#mobx-arch-v2)


### Создать view

```typescript
import { makeObservable } from "mobx";

import { QueryData, View } from "wd-front-core";

import { CommonKey, CommonService, commonService, commonService } from "@stores/services";


export type ConfigItemData = Awaited<ReturnType<typeof commonService.fetchConfigItem>>["data"];

class CommonView extends View<CommonService, CommonKey> {
  constructor() {
    super(commonService);
    makeObservable(this);
  }

  public createConfigItemData = (id: string): QueryData<ConfigItemData, typeof commonService.fetchConfigItem> => {
    const query = this.service.queries.configItem.copyWith({
      params: { id },
    });

    const status = this.service.getStatus<ConfigItemData>(query.key);
    const helpers = this.createHelpers("configItem");

    return {
      ...status,
      ...helpers,
      fetchData: this.service.fetchConfigItem,
    };
  };
}

export const commonView = new CommonView();
```

[к оглавлению](#mobx-arch-v2)


### Создать hook
```typescript
import { commonView } from "@stores";

export const useGetConfigItem = () => {
  const { isFetching, isFetched, data, error, resetQuery, ...cbs } = commonView.createConfigItemData(id);

  const helpers = React.useMemo(() => {
    return {
      fetchData: () => cbs.fetchData(id),
      clearError: () => cbs.clearError({ params: { id }, }),
      reset: () => cbs.reset({ params: { id }, }),
    };
  }, [id]);

  return {
    isFetching,
    isFetched,
    data,
    error,
    resetQuery,
    ...helpers,
  };
};

```
[к оглавлению](#mobx-arch-v2)


### Применение
```typescript
import React from "react";

import { observer } from "mobx-react";
import { Modal, T } from "wd-front-core";
import { InnerPage } from "@components";
import { useGetConfigItem } from "@hooks";

export const ConfigItemPage: React.FC = observer(() => {
  const { id = "" } = useParams();
  const { isFetching, fetchData, data, error, clearError } = useGetConfigItem(id);

  React.useEffect(() => {
    if (!id) {
      return;
    }

    fetchData();
  }, [id]);

  return (
    <InnerPage title="Config item page">
      {isFetching ? (
        <p>Loading data ...</p>
      ) : (
        {data && <p>{data.name}</p>}
      )}
      <Modal
        isOpen={Boolean(error?.message)}
        title={"Ошибка"}
        onClose={clearError}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onAfterClose={clearError}
        width={480}
      >
        <T font={"Body/Body 1 Long"}>{error?.message}</T>
      </Modal>
    </InnerPage>
  );
});

```

[к оглавлению](#mobx-arch-v2)


## GET-запрос элементов с пагинацией
### Создать сервис
```typescript
import { makeObservable } from "mobx";
import { 
  FetchResource,
  PaginationQuery,
  PaginationResponse,
  QueryParams,
  QueryStatus,
} from "wd-front-core";

export type ConfigItemResponse = {
  id: number;
  name: string;
};

export const CONFIG_PAGE_LIMIT = 10;
// Создать запросы
const queries: Record<CommonKey, Query | PaginationQuery> = {
  // Создать GET-запрос c пагинацией
  config: new PaginationQuery({
    url: `${BASE_URL}/config`,
    limit: { limit: CONFIG_PAGE_LIMIT },
  }),
};

export type CommonKey = "config"; // Ключи из queries
export type CommonServiceType = ConfigItemResponse[] | boolean;

export class CommonService extends FetchResource<CommonServiceType, CommonKey> {
  constructor() {
    super(queries);
    makeObservable(this);
  }

  fetchConfig = async (params?: QueryParams): Promise<QueryStatus<PaginationResponse<ConfigItemResponse>>> => {
    const query = this.queries.config.copyWith() as PaginationQuery;

    if (params) {
      query.setParams(params);
    }

    this.setQuery("config", query);

    return this.rest.request<PaginationResponse<ConfigItemResponse>>({
      query: query,
      adaptResponse: (response: unknown) => {
        const data = response as PaginationResponse<ConfigItemResponse>;
        
        return {
          ...data,
          page: query.page,
          limit: query.limit["limit"] as number,
        };
      },
    });
  };
}

export const commonService = new CommonService();
```

[к оглавлению](#mobx-arch-v2)


### Создать view

```typescript
import { makeObservable } from "mobx";

import { QueryData, View } from "wd-front-core";

import { CommonKey, CommonService, commonService, commonService } from "@stores/services";


export type ConfigData = Awaited<ReturnType<typeof commonService.fetchConfig>>["data"];

class CommonView extends View<CommonService, CommonKey> {
  constructor() {
    super(commonService);
    makeObservable(this);
  }

  public createConfigData = (): QueryData<ConfigData, typeof commonService.fetchConfigItem> => {
    const query = this.service.queries.config as unknown as PaginationQuery;

    const status = this.service.getPaginationStatus<ConfigData>(query.keys);
    const helpers = this.createPaginationHelpers("config");

    return {
      ...status,
      ...helpers,
      fetchData: this.service.fetchConfig,
    };
  };
}

export const commonView = new CommonView();
```

[к оглавлению](#mobx-arch-v2)


### Создать hook
```typescript
import { commonView } from "@stores";

export const useGetConfig = () => {
  return commonView.createConfigData();
};

```
[к оглавлению](#mobx-arch-v2)


### Применение
```typescript
import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { observer } from "mobx-react";
import { Modal, T } from "wd-front-core";
import { Column, Table as TableUI } from "@admiral-ds/react-ui";
import { InnerPage } from "@components";
import { useGetConfig } from "@hooks";

const columns: Column[] = [
  {
    name: "id",
    title: "ID",
    width: "20%",
    renderCell: (data, row) => <Link to={`/config/${row.id}`}>{data}</Link>,
  },
  {
    name: "name",
    title: "Name",
    width: "80%",
  },
];

const Table = styled(TableUI)`
  height: 320px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  width: 100%;
`;

export const ConfigPage: React.FC = observer(() => {
  const { id = "" } = useParams();
  const { isFetching, fetchData, nextPage, data, resetQuery, error, clearError } = useGetConfig();

  React.useEffect(() => {
    fetchData();

    return () => resetQuery();
  }, []);

    const { data: config } = data ?? {};
  const rowsCount = data?.count ?? 0;
  const rowsAmount = (data?.page ?? 0) * (data?.limit ?? 0);

  const onUploadNewRows = () => {
    if (!isFetching && rowsAmount < rowsCount) {
      if (nextPage({ after_id: data?.lastId ?? "", after_value: data?.lastValue ?? "" })) {
        fetchData();
      }
    }
  };

  const renderRowWrapper = (row: TableRow, index: number, rowNode: React.ReactNode) => {
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
    <InnerPage title="Config page">
      {isFetching && (data?.page ?? 0) < 1 ? (
        <p>Loading data ...</p>
      ) : (
        <>
          <Table
            ref={ref}
            columnList={columns}
            rowList={config ?? []}
            renderRowWrapper={renderRowWrapper}
            virtualScroll={{ fixedRowHeight: 40 }}
          />
          <Footer>
            {isFetching ? <Spinner /> : `${config?.length ?? 0}/${rowsCount}`}
          </Footer>
        </>
      )}
      <Modal
        isOpen={Boolean(error?.message)}
        title={"Ошибка"}
        onClose={clearError}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onAfterClose={clearError}
        width={480}
      >
        <T font={"Body/Body 1 Long"}>{error?.message}</T>
      </Modal>
    </InnerPage>
  );
});

```

[к оглавлению](#mobx-arch-v2)

## PUT-запрос (редактирование элемента)
### Создать сервис
```typescript
import { makeObservable } from "mobx";
import { FetchResource, QueryStatus } from "wd-front-core";

export type ConfigItemResponse = {
  id: number;
  name: string;
};

// Создать запросы
const queries: Record<CommonKey, Query | PaginationQuery> = {
  // Создать GET-запрос
  configItemEditor: new Query({
    url: `${BASE_URL}/config`,
    method: "PUT",
  }),
};

export type CommonKey = "configItemEditor"; // Ключи из queries
export type CommonServiceType = ConfigItemResponse | boolean;

export class CommonService extends FetchResource<CommonServiceType, CommonKey> {
  constructor() {
    super(queries);
    makeObservable(this);
  }

  editConfigItem = async (configItem: ConfigItemResponse): Promise<QueryStatus<ConfigItemResponse>> => {
    const query = this.queries.configItemEditor.copyWith({ id, configItem.id });

    return this.rest.request<ConfigItemResponse | null>({
      query,
      data: configItem,
    });
  };
}

export const commonService = new CommonService();
```

[к оглавлению](#mobx-arch-v2)


### Создать view

```typescript
import { makeObservable } from "mobx";

import { QueryData, View } from "wd-front-core";

import { CommonKey, CommonService, commonService, commonService } from "@stores/services";


export type ConfigItemData = Awaited<ReturnType<typeof commonService.editConfigItem>>["data"];

class CommonView extends View<CommonService, CommonKey> {
  constructor() {
    super(commonService);
    makeObservable(this);
  }

  public createEditConfigItemData = (id: string): QueryData<ConfigItemData, typeof commonService.editConfigItem> => {
    const query = this.service.queries.configItemEditor.copyWith({ id });

    const status = this.service.getStatus<ConfigItemData>(query.key);
    const helpers = this.createHelpers("configItemEditor");

    return {
      ...status,
      ...helpers,
      fetchData: this.service.editConfigItem,
    };
  };
}

export const commonView = new CommonView();
```

[к оглавлению](#mobx-arch-v2)


### Создать hook
```typescript
import { commonView } from "@stores";


export const useEditConfigItem = (id: string) => {
  const { isFetching, isFetched, data, error, fetchData, resetQuery, ...cbs } = commonView.createEditConfigItemData(id);

  const helpers = React.useMemo(() => {
    return {
      clearError: () => cbs.clearError({ id }),
      reset: () => cbs.reset({ id }),
    };
  }, [id]);

  return {
    isFetching,
    isFetched,
    fetchData,
    data,
    error,
    resetQuery,
    ...helpers,
  };
};

```
[к оглавлению](#mobx-arch-v2)


### Применение
```typescript
import React from "react";

import { observer } from "mobx-react";
import { Modal, T } from "wd-front-core";
import { InnerPage } from "@components";
import { useEditConfigItem } from "@hooks";
import { ConfigItemResponse } from "@stores";

export const ConfigItemEditor: React.FC<{item: ConfigItemResponse}> = observer((props) => {
  const { item } = props;
  const { isFetching, isFetched, fetchData: edit, data, error, clearError } = useEditConfigItem(item.id);
  const [name, setName] = React.useState(item.name);

  return (
    <InnerPage title="Config item page">
      {isFetching &&  <p>Submitting data ...</p>}
      {!isFetched && !error?.message && (
        <div>
          <input value={name} onChange={(evt) => setName(evt.target.value)} />
          <button onClick={() => edit({...item, name })}>Submit</button>
        </div>
      )}
      {isFetched && !error?.message && <p>The configuration item has been updated</p>}
      
      <Modal
        isOpen={Boolean(error?.message)}
        title={"Ошибка"}
        onClose={clearError}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onAfterClose={clearError}
        width={480}
      >
        <T font={"Body/Body 1 Long"}>{error?.message}</T>
      </Modal>
    </InnerPage>
  );
});

```

[к оглавлению](#mobx-arch-v2)
