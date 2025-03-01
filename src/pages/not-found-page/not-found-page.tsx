import React from 'react';
import { Link } from 'react-router';

export const NotFoundPage: React.FC = () => {
  return (
    <>
      <h1>404. Page not found</h1>
      <Link to="/">{'<-- Go home'}</Link>
    </>
  );
};
