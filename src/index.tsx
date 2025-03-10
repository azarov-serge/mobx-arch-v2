import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider as MobXProvider } from 'mobx-react';

import { ThemeProvider } from 'styled-components';
import {
  LIGHT_THEME,
  FontsVTBGroup,
  DropdownProvider,
} from '@admiral-ds/react-ui';

import * as servicesStores from './app/stores/services';
import * as viewsStores from './app/stores/views';

import { App } from './app';

import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <ThemeProvider theme={LIGHT_THEME}>
    <DropdownProvider>
      <FontsVTBGroup />
      <MobXProvider {...viewsStores} {...servicesStores}>
        <App />
      </MobXProvider>
    </DropdownProvider>
  </ThemeProvider>
);
