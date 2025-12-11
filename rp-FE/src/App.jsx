import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Nav from './components/Nav';
import Footer from './components/Footer';
import AppRoutes from './AppRoutes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider> 
        <AuthProvider>
          <div className="app-layout">
            <Nav />
            <main className='main-content'>
              <AppRoutes />
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;