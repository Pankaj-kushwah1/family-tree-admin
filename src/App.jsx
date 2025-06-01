// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import './App.css'
// import Login from './pages/Login'
// import Dashboard from './pages/Dashboard'
// import Users from './pages/Users'
// import HelpSupport from './pages/HelpSupport'

// function App() {

//   return (
//     <Router>
//       <Routes>
//         <Route path='/login' element={<Login />} />
//         <Route path='/' element={<Dashboard />} />
//         <Route path='/users-list' element={<Users />} />
//         <Route path='/help-support' element={<HelpSupport />} />
//       </Routes>
//     </Router>
//   )
// }

// export default App

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import HelpSupport from './pages/HelpSupport'
import MainLayout from './components/MainLayout'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/users-list" element={<MainLayout><Users /></MainLayout>} />
        <Route path="/help-support" element={<MainLayout><HelpSupport /></MainLayout>} />
      </Routes>
    </Router>
  )
}

export default App
