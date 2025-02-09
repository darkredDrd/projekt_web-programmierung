import "./App.css";
import Dashboard from "./components/dashboard/Dashboard";
import { ErrorProvider } from "./services/ErrorContext";
import { RoleProvider } from "./services/RoleContext";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import NotFoundPage from './components/dashboard/components/PageNotFound';
import AddCustomer from './components/dashboard/components/AddCustomer';
import CustomerList from './components/dashboard/components/CustomerList';
import OffersGrid from './components/dashboard/components/OffersGrid';
import OfferDetails from './components/dashboard/components/OfferDetails';

function App() {
  return (
    <ErrorProvider>
      <RoleProvider>
        <Router>
         <Routes>
          <Route path="/*" element={<Dashboard />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/add-customer" element={<AddCustomer />} />
          <Route path="/" element={<OffersGrid />} />
          <Route path="/offer-details/:id" element={<OfferDetails />} />
        </Routes>
       </Router>
      </RoleProvider>
    </ErrorProvider>
  );
}

export default App;
