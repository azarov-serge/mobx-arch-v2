import React from 'react';
import {
  createBrowserRouter,
  RouterProvider as Provider,
} from 'react-router-dom';

import { routerConfig } from './config';

export const RouterProvider: React.FC = () => {
  const router = createBrowserRouter(routerConfig);

  return <Provider router={router} />;
};
