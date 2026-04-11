
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
import SeeAllPage from "@pages/books/see-all";
import BooksPage from "@pages/books/BooksPage";
import ProfilePage from "@pages/profile/profile";
import BookPage from "@pages/books/individual-book";
import ResubscribePage from "@pages/auth/Resubscribe";

import VerifyEmailPage from "@pages/auth/VerifyEmailPage";
import ResetPasswordPage from "@pages/auth/ResetPasswordPage";
import { DiscussionHubPage } from "@pages/books/DiscussionHub";
import NotificationsPage from "@pages/profile/Notifications";
import DiscoveryPage from "@pages/books/discover/DiscoveryPage";

{/* =============== component ============ */ }
import Spinner from "@components/skeleton/spinner/spinner";

{/* =============== utils ============ */ }
import PublicRoute from "@utils/PublicRoute";
import { PageTemplate } from '@utils/PageTemplate';
import ProtectedRoute from "@utils/ProtectedRoute";

{/* =============== context ============ */ }
import { useAuth } from "@context/AuthContext";

{/* =============== models ============ */ }
import { RelationshipType } from "@models/Book";

{/* =============== service ============ */ }
import { request } from "@utils/ApiRequest";

const AppRoutes = () => {
  const { user, logout, loading } = useAuth();
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    // Connect API service to Auth Context
    request.onLogout(logout);

    // Set initial token if exists
    if (token) {
      request.setAuthToken(token);
    }
  }, [logout]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Spinner loadingLabel="Loading..." />
      </div>
    );
  }

  return (
    <Routes>
      <Route path='/home' element={<PublicRoute><HomePage /></PublicRoute>} />
      <Route path='/auth/verify' element={<PublicRoute><VerifyEmailPage /></PublicRoute>} />
      <Route path='/auth/reset-password' element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
      <Route path='/auth/resubscribe' element={<PublicRoute><ResubscribePage /></PublicRoute>} />
      <Route path='/auth' element={<PublicRoute><AuthPage /></PublicRoute>} />

      {/* protected routes */}
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/books" element={<ProtectedRoute><BooksPage /></ProtectedRoute>} />
      <Route path="/book/:id" element={<ProtectedRoute><BookPage /></ProtectedRoute>} />
      <Route path="/discovery" element={<ProtectedRoute><DiscoveryPage /></ProtectedRoute>} />

      {/* Routes that depend on user ID - only render if user exists */}
      {user && (
        <>
          <Route path="/books/recommends" element={<SeeAllPage title="Books recommended for you" endpoint={`/recs/user/${user.id}`} />} />
          <Route path="/books/alsoLike" element={<SeeAllPage title="Readers also like" endpoint={`/recs/user/${user.id}/collaborative`} />} />
          <Route path="/books/discover" element={<SeeAllPage title="Discover New Universes of Material" endpoint={`/recs/random`} filterable />} />
          <Route path="/books/week/trending" element={<SeeAllPage title="Books Trending this week" endpoint={"/recs/trending/week"} filterable />} />
          <Route path="/books/authors" element={<SeeAllPage title="More from your favorite authors" endpoint={`/recs/user/${user.id}/author`} />} />
          <Route path="/books/genres" element={<SeeAllPage title="Books Recommendations based on you favourite genres" endpoint={`/recs/user/${user.id}/genre`} />} />

          <Route path="/books/library" element={<SeeAllPage title="Library Books" endpoint={`/auth/${user.id}/books/${RelationshipType.LIBRARY}`} />} />
          <Route path="/books/wishlist" element={<SeeAllPage title="Wishlist Books" endpoint={`/auth/${user.id}/books/${RelationshipType.WISHLIST}`} />} />

          <Route path="/books/userGenreClassics" element={<SeeAllPage title="Classics from your favourite genres" endpoint={`/recs/classics/user/${user.id}`} filterable />} />
        </>
      )}

      <Route path="/books/classics" element={<SeeAllPage title="Universally known classics" endpoint={`/recs/classics`} filterable />} />
      <Route path="/books/NewReleases" element={<SeeAllPage title="Be the first to read it!" endpoint={`/recs/new-releases`} filterable />} />

      {/* error pages */}
      <Route path="*" element={<E404 />} />
      <Route path='/unauthorised' element={<E403 />} />
      <Route path='/not-found' element={<E404 />} />
      <Route path="/unauthorised" element={<E401 />} />
      <Route path="/too-many-requests" element={<E429 />} />
    </Routes>
  );
};

function App() {
  const { user } = useAuth();
  return (
    <Router>
      <AuthProvider>
        <PageTemplate>
          <Routes>
            <Route path='/home' element={<PublicRoute><HomePage /></PublicRoute>} />
            <Route path='/auth/verify' element={<PublicRoute><VerifyEmailPage /></PublicRoute>} />
            <Route path='/auth/reset-password' element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
            <Route path='/auth/resubscribe' element={<PublicRoute><ResubscribePage /></PublicRoute>} />
            <Route path='/auth' element={<PublicRoute><AuthPage /></PublicRoute>} />

            {/* protected routes */}
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/books" element={<ProtectedRoute><BooksPage /></ProtectedRoute>} />
            <Route path="/book/:id" element={<ProtectedRoute><BookPage /></ProtectedRoute>} />
            <Route path="/discovery" element={<ProtectedRoute><DiscoveryPage /></ProtectedRoute>} />
            <Route path="/hub" element={<ProtectedRoute><DiscussionHubPage /></ProtectedRoute>} />
            <Route path='/notifications' element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

            <Route path="/books/recommends" element={<SeeAllPage title="Books recommended for you" endpoint={`/recs/user/${user?.id}`} />} />
            <Route path="/books/alsoLike" element={<SeeAllPage title="Readers also like" endpoint={`/recs/user/${user?.id}/collaborative`} />} />
            <Route path="/books/discover" element={<SeeAllPage title="Discover New Universes of Material" endpoint={`/recs/random`} filterable />} />
            <Route path="/books/week/trending" element={<SeeAllPage title="Books Trending this week" endpoint={"/recs/trending/week"} filterable />} />
            <Route path="/books/authors" element={<SeeAllPage title="More from your favorite authors" endpoint={`/recs/user/${user?.id}/author`} />} />
            <Route path="/books/genres" element={<SeeAllPage title="Books Recommendations based on you favourite genres" endpoint={`/recs/user/${user?.id}/genre`} />} />

            <Route path="/books/library" element={<SeeAllPage title="Library Books" endpoint={`/auth/${user?.id}/books/${RelationshipType.LIBRARY}`} />} />
            <Route path="/books/wishlist" element={<SeeAllPage title="Wishlist Books" endpoint={`/auth/${user?.id}/books/${RelationshipType.WISHLIST}`} />} />

            <Route path="/books/userGenreClassics" element={<SeeAllPage title="Classics from your favourite genres" endpoint={`/recs/classics/user/${user?.id}`} filterable />} />

            <Route path="/books/classics" element={<SeeAllPage title="Universally known classics" endpoint={`/recs/classics`} filterable />} />
            <Route path="/books/NewReleases" element={<SeeAllPage title="Be the first to read it!" endpoint={`/recs/new-releases`} filterable />} />

            {/* error pages */}
            <Route path="*" element={<E404 />} />
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
