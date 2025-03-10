import React from 'react';
import { LastRowWrapperProps } from './types';

export const LastRowWrapper: React.FC<LastRowWrapperProps> = (props) => {
  const { containerRef, rowNode, onVisible } = props;
  const [visible, setVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting && !visible) {
      setVisible(true);
      onVisible?.();
    }

    if (!entries[0].isIntersecting && visible) {
      setVisible(false);
    }
  };

  React.useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: containerRef?.current,
      threshold: [0, 1.0],
    });

    if (containerRef?.current && ref?.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [containerRef, visible]);

  return <div ref={ref}>{rowNode}</div>;
};
