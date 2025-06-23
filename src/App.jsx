// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import './App.css'
// import Login from './pages/Login'
// import Dashboard from './pages/Dashboard'
// import Users from './pages/Users'
// import HelpSupport from './pages/HelpSupport'
// import MainLayout from './components/MainLayout'

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />

//         <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
//         <Route path="/users-list" element={<MainLayout><Users /></MainLayout>} />
//         <Route path="/help-support" element={<MainLayout><HelpSupport /></MainLayout>} />
//       </Routes>
//     </Router>
//   )
// }

// export default App

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import HelpSupport from './pages/HelpSupport';
import MainLayout from './components/MainLayout';
import PrivateRoute from './components/PrivateRoute';
import ChatBox from './pages/ChatBox';
import CmsManagement from "./pages/Privacy";
import CmsManagements from "./pages/Term";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/users-list" element={<MainLayout><Users /></MainLayout>} />
          <Route path="/help-support" element={<MainLayout><HelpSupport /></MainLayout>} />
           <Route path="/privacy" element={<MainLayout><CmsManagement /></MainLayout>} />
           <Route path="/terms" element={<MainLayout><CmsManagements /></MainLayout>} />

          {/* <Route path="/help-support" element={<MainLayout><AllChatData /></MainLayout>} /> */}
          {/* <Route path="/help-support" element={<MainLayout><ChatBox /></MainLayout>} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
