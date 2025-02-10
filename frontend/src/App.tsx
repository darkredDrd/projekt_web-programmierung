import "./App.css";
import Dashboard from "./components/dashboard/Dashboard";
import { ErrorProvider } from "./services/ErrorContext";
import { RoleProvider } from "./services/RoleContext";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import NotFoundPage from './components/dashboard/components/PageNotFound';
import CustomerGrid from './components/dashboard/components/CustomerGrid';
import OffersGrid from './components/dashboard/components/OffersGrid';
import OfferDetails from './components/dashboard/components/OfferDetails';


type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
};

function App() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  return (
    <ErrorProvider>
      <RoleProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />}>
              <Route index element={<OffersGrid />} />
              <Route path="customers" element={<CustomerGrid customers={customers} setCustomers={setCustomers} />} />
              <Route path="offers" element={<OffersGrid />} />
              <Route path="offer-details/:id" element={<OfferDetails />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Router>
      </RoleProvider>
    </ErrorProvider>
  );
}

export default App;