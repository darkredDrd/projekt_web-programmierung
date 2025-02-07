import "./App.css";
import Dashboard from "./components/dashboard/Dashboard";
import { ErrorProvider } from "./services/ErrorContext";
import { RoleProvider } from "./services/RoleContext";

function App() {
  return (
    <ErrorProvider>
      <RoleProvider>
        <Dashboard />
      </RoleProvider>
    </ErrorProvider>
  );
}

export default App;
