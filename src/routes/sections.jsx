import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';
import DashboardLayout from 'src/layouts/dashboard';
import ProtectedRoute from './ProtectedRoute';
import ProtectedRoute2 from './ProtectedRoute2';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const LoginPage2 = lazy(() => import('src/pages/login2'));
export const ReceiptPage = lazy(() => import('src/pages/receipt'));
export const RehabPage = lazy(() => import('src/pages/rehab'));
export const RegularPage = lazy(() => import('src/pages/Regular'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const BloodPage = lazy(() => import('src/pages/blood'));
export const InsuranceView = lazy(() => import('src/pages/insurance'));

export default function Router() {
  const routes = useRoutes([
    { path: '/login', element: <LoginPage /> },
    {
      element: (
        <DashboardLayout>
          {' '}
          <Suspense>
            {' '}
            <Outlet />{' '}
          </Suspense>{' '}
        </DashboardLayout>
      ),
      children: [
        {
          path: '/main',
          element: (
            <ProtectedRoute>
              {' '}
              <IndexPage />{' '}
            </ProtectedRoute>
          ),
          index: true,
        },
        {
          path: 'dashboard',
          element: (
            <ProtectedRoute>
              {' '}
              <UserPage />{' '}
            </ProtectedRoute>
          ),
        },
        { path: 'patient', element: <RegularPage /> },
        { path: 'rehab', element: <RehabPage /> },
        { path: 'Regular', element: <LoginPage /> },
        { path: 'bill', element: <BlogPage /> },
        { path: 'blog', element: <LoginPage /> },
        { path: 'medical', element: <ReceiptPage /> },
        { path: 'bloody', element: <BloodPage /> },
        { path: 'insurance', element: <InsuranceView /> },
      ],
    },
    { path: '404', element: <Page404 /> },
    { path: '*', element: <Navigate to="/login" replace /> },
  ]);

  return routes;
}