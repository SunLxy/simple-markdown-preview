import { useRoutes, Outlet, RouteObject } from 'react-router';
import React from 'react';
import { SimplePreview } from "simple-markdown-preview"

const config: RouteObject[] = [
  {
    path: "/",
    element: <SimplePreview path={() => import("simple-markdown-preview/README.md")} />
  }
];

const Route = () => {
  const render = useRoutes(config);
  return (
    <React.Fragment>
      {render}
      <Outlet />
    </React.Fragment>
  );
};
export default Route;
