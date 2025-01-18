import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import BlogPost from '../pages/BlogPost';
import DashboardLayout from '../components/admin/layout/DashboardLayout';
import Login from '../pages/auth/Login';
import Posts from '../pages/admin/Posts';
import ProjectsPage from '../pages/Projects';
import AdminProjects from '../pages/admin/Projects';
import BlogListing from '../pages/BlogListing';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/projects',
    element: <ProjectsPage />,
  },
  {
    path: '/blogs',
    element: <BlogListing />,
  },
  {
    path: '/blog/:slug',
    element: <BlogPost />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: <DashboardLayout />,
    children: [
      { path: 'posts', element: <Posts /> },
      { path: 'projects', element: <AdminProjects /> },
    ],
  },
]);