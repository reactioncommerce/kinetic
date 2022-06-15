import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { RequireAuthRoute, RequireShopRoute, UnauthenticatedRoute } from '@components/Routes';
import { AccountProvider } from '@containers/AccountProvider';
import Layout from '@containers/Layout';
import { ShopProvider } from '@containers/ShopProvider';

import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import SignUp from './pages/SignUp';

function App() {
  return (
    <BrowserRouter>
      <ShopProvider>
        <AccountProvider>
          <Routes>
            <Route element={<UnauthenticatedRoute />}>
              <Route path="/signup" element={<SignUp />} />
            </Route>

            <Route element={<RequireAuthRoute />}>
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
