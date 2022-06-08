import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { RequireAuthRoute } from '@components/RequireAuthRoute';
import { AccountProvider } from '@containers/AccountProvider';
import Layout from '@containers/Layout';

import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <AccountProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<RequireAuthRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AccountProvider>
    </BrowserRouter>
  );
}

export default App;
