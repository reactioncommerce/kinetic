import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { RequireAuthRoute, RequireShopRoute, UnauthenticatedRoute } from '@components/Routes';
import { AccountProvider } from '@containers/AccountProvider';
import Layout from '@containers/Layout';
import { ShopProvider } from '@containers/ShopProvider';

import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import CreateShop from './pages/CreateShop';
import PasswordReset from './pages/PasswordReset';
import NewPassword from './pages/NewPassword';

function App() {
  return (
    <BrowserRouter>
      <ShopProvider>
        <AccountProvider>
          <Routes>
            <Route element={<UnauthenticatedRoute />}>
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/password-reset/new" element={<PasswordReset />} />
              <Route path="/password-reset" element={<NewPassword />} />
            </Route>

            <Route element={<RequireAuthRoute />}>
              <Route path="/new-shop" element={<CreateShop />} />
              <Route element={<RequireShopRoute />}>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </AccountProvider>
      </ShopProvider>
    </BrowserRouter>
  );
}

export default App;
