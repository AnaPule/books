
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from '@context/AuthContext';
import { BrowserRouter as Router } from "react-router-dom";

{/* =============== PAGES ============ */ }
import E401 from '@pages/errors/E401';
import E403 from '@pages/errors/E403';
import E404 from '@pages/errors/E404';
import E429 from '@pages/errors/E429';

import HomePage from "@pages/home/home"
import AuthPage from "@pages/auth/auth";
import BooksPage from "@pages/books/BooksPage";
import ProfilePage from "@pages/profile/profile";
import BookPage from "@pages/books/individual-book";
import ResubscribePage from "@pages/auth/Resubscribe";
import VerifyEmailPage from "@pages/auth/VerifyEmailPage";
import ResetPasswordPage from "@pages/auth/ResetPasswordPage";

{/* =============== utils ============ */ }
import { request } from '@utils/ApiRequest';
import PublicRoute from "@utils/PublicRoute";
import { PageTemplate } from '@utils/PageTemplate';
import ProtectedRoute from "@utils/ProtectedRoute";

{/* =============== context ============ */ }
import { useAuth } from "@context/AuthContext";

function App() {

  const { logout } = useAuth();

  useEffect(() => {
    // Connect API service to Auth Context
    request.onLogout(logout);

    // Set initial token if exists
    const token = sessionStorage.getItem('token');
    if (token) {
      request.setAuthToken(token);
    }
  }, [logout]);
  return (
    <Router>
      <AuthProvider>
        <PageTemplate>
          <Routes>
            <Route path='/home' element={<PublicRoute><HomePage /> </PublicRoute>} />
            <Route path='/auth/verify' element={<PublicRoute><VerifyEmailPage /></PublicRoute>} />
            <Route path='/auth/reset-password' element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
            <Route path='/auth/resubscribe' element={<PublicRoute><ResubscribePage /></PublicRoute>}></Route>
            <Route path='/auth' element={<PublicRoute><AuthPage /></PublicRoute>} />

            {/* protected routes */}
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/books" element={<ProtectedRoute><BooksPage /></ProtectedRoute>} />
            <Route path="/book/:id" element={<ProtectedRoute><BookPage /></ProtectedRoute>} />

            {/* error pages */}
            <Route path="*" element={<E404 />} /> {/* page not found*/}
            <Route path='/unauthorised' element={<E403 />} />
            <Route path='/not-found' element={<E404 />} />
            <Route path="/unauthorised" element={<E401 />} />
            <Route path="/too-many-requests" element={<E429 />} />

          </Routes>
        </PageTemplate>
      </AuthProvider>
    </Router>
  )
}

export default App
