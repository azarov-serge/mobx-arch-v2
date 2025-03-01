import { ReactNode, RefObject } from 'react';

export type LastRowWrapperProps = {
  containerRef: RefObject<HTMLElement | null>;
  rowNode: ReactNode;
  onVisible?: () => void;
};
