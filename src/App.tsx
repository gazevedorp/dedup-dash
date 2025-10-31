import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '@/layouts';
import Login from '@/pages/Login';
import Solicitacoes from '@/pages/Solicitacoes';
import Parametros from '@/pages/Parametros';
import Usuarios from '@/pages/Usuarios';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<AdminLayout />}>
          <Route path="/" element={<Solicitacoes />} />
          <Route path="/parametros" element={<Parametros />} />
          <Route path="/usuarios" element={<Usuarios />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
