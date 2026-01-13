
import { SocketProvider } from './context/SocketContext';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <SocketProvider>
      <AppRoutes />
      <Toaster position="top-right" />
    </SocketProvider>
  );
}

export default App;
