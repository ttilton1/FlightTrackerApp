import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Router, RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import { ListedFlights } from './pages/ListedFlights';
import { FlightsMap } from './pages/FlightsMap';

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path: "/",
    element:<App />,
    errorElement: <ErrorPage/>
  },
  {
    path: "/flights",
    element: <ListedFlights />,
    errorElement: <ErrorPage/>
  },
  {
    path: "/map",
    element: <FlightsMap />,
    errorElement: <ErrorPage/>
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
