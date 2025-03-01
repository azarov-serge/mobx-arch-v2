import { RouteObject } from 'react-router';

import { CocktailsPage, CocktailPage, NotFoundPage } from '../../pages';

export const routerConfig: RouteObject[] = [
  {
    path: '/',
    element: <CocktailsPage />,
  },
  {
    path: '/product',
    children: [{ path: ':id', element: <CocktailPage /> }],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];
