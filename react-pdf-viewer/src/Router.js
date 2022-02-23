import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import App from './App';
export default function Router() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" component={App}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
