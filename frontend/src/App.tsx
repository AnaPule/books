import { Routes, Route } from "react-router-dom";
import { AuthProvider } from '@context/AuthContext';
import { BrowserRouter as Router } from "react-router-dom";

{/* =============== PAGES ============ */ }
import HomePage from "@pages/home/home"
import AuthPage from "@pages/auth/auth";

{/* =============== COMPONENTS ============ */ }
import { PageTemplate } from '@utils/PageTemplate';


function App() {
  return (
    <Router>
      <AuthProvider>
        <PageTemplate>
          <Routes>
            <Route path="*" element={<HomePage />} /> {/* page not found -> take to home */}
            <Route path='/home' element={<HomePage/>} />
            <Route path='/auth' element={<AuthPage />} />
          </Routes>
        </PageTemplate>
      </AuthProvider>
    </Router>
  )
}

export default App
