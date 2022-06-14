import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { RequireAuthRoute, RequireShopRoute, UnauthenticatedRoute } from '@components/Routes';
import { AccountProvider } from '@containers/AccountProvider';
import Layout from '@containers/Layout';
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
            <Route element={<UnauthenticatedRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
            </Route>

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
