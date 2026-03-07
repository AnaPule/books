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
import BooksPage from "@pages/books/books";
import ProfilePage from "@pages/profile/profile";

{/* =============== COMPONENTS ============ */ }
import { PageTemplate } from '@utils/PageTemplate';


function App() {
  return (
    <Router>
      <AuthProvider>
        <PageTemplate>
          <Routes>
            <Route path='/home' element={<HomePage/>} />
            <Route path='/auth' element={<AuthPage />} />
            <Route path='/profile' element={<ProfilePage />} />

            <Route path="*" element={<E404 />} /> {/* page not found*/}
              <Route path='/unauthorised' element={<E403 />} />
              <Route path='/not-found' element={<E404 />} />
              <Route path="/unauthorised" element={<E401 />} />
              <Route path="/too-many-requests" element={<E429 />} />

              <Route path='/books' element={<BooksPage />} />
          </Routes>
        </PageTemplate>
      </AuthProvider>
    </Router>
  )
}

export default App
