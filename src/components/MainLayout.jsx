import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const MainLayout = ({ children }) => {

    return (
        <div id="wrapper" className="wrapper bg-ash">
            <Navbar />
            <div className="dashboard-page-one">
                <Sidebar />
                <div className="dashboard-content-one">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default MainLayout