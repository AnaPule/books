import { Routes, Route } from "react-router-dom";
import { AuthProvider } from '@context/AuthContext';
import { BrowserRouter as Router } from "react-router-dom";

{/* =============== PAGES ============ */ }
import HomePage from "@pages/home/home"

{/* =============== COMPONENTS ============ */ }
import { PageTemplate } from '@utils/PageTemplate';


function App() {
  return (
    <Router>
      <AuthProvider>
        <PageTemplate>
          <Routes>
            <Route path='/home' element={<HomePage/>} />
          </Routes>
        </PageTemplate>
      </AuthProvider>
    </Router>
  )
}

export default App
