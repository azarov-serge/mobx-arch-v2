import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider as MobXProvider } from 'mobx-react';

import { ThemeProvider } from 'styled-components';
import {
  LIGHT_THEME,
  FontsVTBGroup,
  DropdownProvider,
} from '@admiral-ds/react-ui';

import * as viewStores from './app/stores/views';
import * as serviceStores from './app/stores/services';

import { App } from './app';

import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <ThemeProvider theme={LIGHT_THEME}>
    <DropdownProvider>
      <FontsVTBGroup />
      <MobXProvider {...viewStores} {...serviceStores}>
        <App />
      </MobXProvider>
    </DropdownProvider>
  </ThemeProvider>
);
