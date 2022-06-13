import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { RequireAuthRoute } from '@components/RequireAuthRoute';
import { AccountProvider } from '@containers/AccountProvider';
import Layout from '@containers/Layout';
import { RequireShopRoute } from '@components/RequireShopRoute';
import { ShopProvider } from '@containers/ShopProvider';

import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import CreateShop from './pages/CreateShop';

function App() {
  return (
    <BrowserRouter>
      <ShopProvider>
        <AccountProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            <Route element={<RequireAuthRoute />}>
              <Route path="/new-shop" element={<CreateShop />} />
              <Route element={<RequireShopRoute />}>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Dashboard />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AccountProvider>
      </ShopProvider>
    </BrowserRouter>
  );
}

export default App;
