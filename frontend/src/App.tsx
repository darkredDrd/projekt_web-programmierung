import "./App.css";
import Dashboard from "./components/dashboard/Dashboard";
import { ErrorProvider } from "./services/ErrorContext";
import { RoleProvider } from "./services/RoleContext";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import MenuContent from './components/dashboard/components/MenuContent';
//import OffersList from './components/dashboard/components/OffersList';
//import OffersGrid from './components/dashboard/components/OffersGrid';
//import CustomerList from './components/dashboard/components/CustomerList';
//import CustomerGrid from './components/dashboard/components/CustomerGrid';
//import { Menu } from "@mui/material";
import React from 'react';

function App() {
  return (
    <ErrorProvider>
      <RoleProvider>
        <Router>
         <Routes>
          <Route path="/*" element={<Dashboard />} />
        </Routes>
       </Router>
      </RoleProvider>
    </ErrorProvider>
  );
}

export default App;
