import { useRoutes, Outlet, RouteObject } from 'react-router';
import React from 'react';
import { SimplePreview } from "simple-markdown-preview"



const useSimplePreview = () => {
  return {
    leftRender: <div style={{ width: 200, height: 100, background: "red" }}></div>,
    rightRender: <div style={{ width: 200, height: 100, background: "green" }} ></div>,
  }
}


const config: RouteObject[] = [
  {
    path: "/",
    element: <SimplePreview
      footer={<div style={{ height: 100, background: "green", position: "sticky", top: 0 }} ></div>}
      header={<div style={{ height: 100, background: "green", position: "sticky", top: 0 }} ></div>}
      useSimplePreview={useSimplePreview}
      path={() => import("simple-markdown-preview/README.md")} />
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
