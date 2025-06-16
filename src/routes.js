import { Navigate, useRoutes } from 'react-router-dom';
import { About, Api, Checkout, Contact, Documentation, Enquiry, ErrorPage, GetStarted, HomePage, Login, Payments, Services } from './pages';
import { Auth, CheckoutLayout, Dashboard, Main } from './layout';
import LoadingMiddleware from './LoadingMiddleware';
import LazyLoadingMiddleware from './LazyLoadingMiddleware copy';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase';

export default function Router() {
  const [user, loading] = useAuthState(auth);
  const isAdmin = JSON.parse(localStorage.getItem('isAdmin'));
  const hasViewed = localStorage.getItem('hasViewedGetStarted');
  const hasViewedGetStarted = hasViewed ? hasViewed : false;

  const routes = useRoutes([
    {
      path: '/get-started',
      element: <LoadingMiddleware element={GetStarted} />,
    },
    {
      path: '/',
      element: <Main />,
      children: [
        { element: hasViewedGetStarted ? 
          <LoadingMiddleware element={HomePage} /> : 
          <Navigate to={"get-started"} />, 
          index: true 
        },
        { path: "services", element: <LoadingMiddleware element={Services} /> },
        { path: "about", element: <LoadingMiddleware element={About} /> },
        { path: "integration", element: <LoadingMiddleware element={Documentation} /> },
        { path: "contact", element: <LoadingMiddleware element={Contact} /> },
        { path: "*", element: <Navigate to="/404" /> }
      ]
    },
    {
      path: '/app/',
      element: loading ? <LazyLoadingMiddleware /> : (user ? <Dashboard /> : <Navigate to="/404" />),
      children: [
        { element: <Navigate to={"payments"} />, index: true },
        { path: "payments", element: <LoadingMiddleware element={Payments} /> },
        { path: "api", element: <LoadingMiddleware element={Api} /> },
        { path: "integration", element: <LoadingMiddleware element={Documentation} /> },
        { path: "*", element: <Navigate to="/404" /> }
      ]
    },
    {
      path: '/admin/',
      element: loading ? <LazyLoadingMiddleware /> : ((isAdmin && isAdmin === true) && user ? <Dashboard /> : <Navigate to="/404" />),
      children: [
        { element: <Navigate to="payments" />, index: true },
        { path: "payments", element: <LoadingMiddleware element={Payments} /> },
        { path: "api", element: <LoadingMiddleware element={Api}  /> },
        { path: "integration", element: <LoadingMiddleware element={Documentation} /> },
        { path: "*", element: <Navigate to="/404" /> }
      ]
    },
    {
      path: '/checkout/',
      element: <CheckoutLayout />,
      children: [
        { path: ":service", element: <LoadingMiddleware element={Checkout} /> },
        { path: "*", element: <Navigate to="/404" /> }
      ]
    },
    {
      path: '/enquire/',
      element: <CheckoutLayout />,
      children: [
        { path: ":service", element: <LoadingMiddleware element={Enquiry} /> },
        { path: "*", element: <Navigate to="/404" /> }
      ]
    },
    {
      path: '/auth/',
      element: <Auth />,
      children: [
        { element: <Navigate to="signin" />, index: true },
        { path: "signin", element: <LoadingMiddleware element={Login} /> },
        // { path: "signup", element: <LoadingMiddleware element={Register} /> },
        { path: "*", element: <Navigate to="/404" /> }
      ]
    },
    {
      path: '*',
      element: <Navigate to="/404" />,
    },
    {
      path: '404',
      element: <ErrorPage />,
    }
  ]);

  return routes;
};
