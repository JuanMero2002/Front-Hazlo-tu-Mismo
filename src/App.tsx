import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';

// Contextos
import { ToastProvider } from './contexts/ToastContext';

// Rutas
import { AppRoutes } from './routes';

function App() {
  return (
    <ToastProvider>
      <Router>
        <AppRoutes />
      </Router>
    </ToastProvider>
  );
}

export default App;
