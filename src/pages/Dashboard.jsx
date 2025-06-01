import React, { useEffect, useState } from 'react'
import flatpickr from "flatpickr";
import img1 from "../assets/img/welcome.png"
import img2 from "../assets/img/bg-1.png"
import { Link, useNavigate } from 'react-router-dom'
import { allUsersList } from '../utils/authUtils'

const Dashboard = () => {
    const navigate = useNavigate();
    const [userData, setUsersData] = useState([]);

    const userList = async () => {
        setLoading(true);
        try {
            const response = await allUsersList();
            if (response?.success) {
                console.log("Response", response.users);
                setUsersData(response.users);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        userList()
    }, [])

    useEffect(() => {
        flatpickr("#calendar", {
            inline: true,
            enableTime: false,
            dateFormat: "Y-m-d"
        });
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <>
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css"
            />
            <div className="breadcrumbs-area">
                <div className="heading">Dashboard</div>
                <p>Hi, welcome to task management dashboard</p>
            </div>
            <div className="container-fluid p-4">
                <div className="row">
                    <div className="col-md-8">
                        <div className="card-box  pb-0">
                            <div className="d-flex">
                                <img
                                    src={img1}
                                    width={150}
                                    style={{ transform: "translateY(-35px)" }}
                                />
                                <img
                                    src={img2}
                                    width={150}
                                    style={{
                                        position: "absolute",
                                        right: 15,
                                        width: "45.5%",
                                        top: 0
                                    }}
                                />
                                <div className="ml-3">
                                    <h5 className="mb-1">Hi, Vanshika Pandey</h5>
                                    <h4 className="title text-left">Welcome to Management</h4>
                                    <p className="mb-0">
                                        Project activity will be updated here. Click on the name
                                        section to set your configuration.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-3">
                                <div className="card-box">
                                    <h6 className="mb-0 fw-bold">Total Users</h6>
                                    <h4 className="mb-0">
                                        <strong>856</strong> <small>Users</small>
                                    </h4>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card-box">
                                    <h6 className="mb-0 fw-bold">Reported Users</h6>
                                    <h4 className="mb-0">
                                        <strong>698</strong> <small>Users</small>
                                    </h4>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card-box">
                                    <h6 className="mb-0 fw-bold">Users Requests</h6>
                                    <h4 className="mb-0">
                                        <strong>568</strong> <small>Requests</small>
                                    </h4>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card-box">
                                    <h6 className="mb-0 fw-bold">Total Emails</h6>
                                    <h4 className="mb-0">
                                        <strong>235</strong> <small>Emails</small>
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <div className="card-box px-2">
                            <div className="d-flex justify-content-between mb-3">
                                <h5>Total Users</h5>
                                <Link to="/users-list">View All</Link>
                            </div>
                            <div className="table-responsive">
                                <table className="table user-table">
                                    <thead>
                                        <tr>
                                            <th>Profile</th>
                                            <th>Name</th>
                                            <th>Number</th>
                                            <th>Email</th>
                                            <th>Location</th>
                                            {/* <th>Action</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="calendar-box mb-4">
                            <div id="calendar" />
                            <div className="activity-card">
                                <div className="activity-header">
                                    <span>Activity</span>
                                    <Link to="/users-list" style={{ fontSize: 14 }}>
                                        View All
                                    </Link>
                                </div>
                                <div className="activity-item">
                                    <div className="activity-avatar">EK</div>
                                    <div>
                                        <div className="activity-text">Lorem Ipsum is simply</div>
                                        <div className="activity-date">
                                            04 April, 2021 | 04:00 PM
                                        </div>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <div className="activity-avatar">EK</div>
                                    <div>
                                        <div className="activity-text">Lorem Ipsum is simply</div>
                                        <div className="activity-date">
                                            04 April, 2021 | 04:00 PM
                                        </div>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <div className="activity-avatar">EK</div>
                                    <div>
                                        <div className="activity-text">Lorem Ipsum is simply</div>
                                        <div className="activity-date">
                                            04 April, 2021 | 04:00 PM
                                        </div>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <div className="activity-avatar">EK</div>
                                    <div>
                                        <div className="activity-text">Lorem Ipsum is simply</div>
                                        <div className="activity-date">
                                            04 April, 2021 | 04:00 PM
                                        </div>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <div className="activity-avatar">EK</div>
                                    <div>
                                        <div className="activity-text">Lorem Ipsum is simply</div>
                                        <div className="activity-date">
                                            04 April, 2021 | 04:00 PM
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Dashboard Content End Here */}
            {/* Modal */}
            <div className="modal fade" id="delete" role="dialog">
                <div className="modal-dialog">
                    {/* Modal content*/}
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Delete Member </h4>
                            <button type="button" className="close" data-dismiss="modal">
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-group">
                                    <label>Confirm delete this family member?</label>
                                </div>
                                <div className="form-group text-center d-flex justify-content-between mt-5">
                                    <button className="radius-30 btn-cancel w-50 mr-2">
                                        Cancel
                                    </button>
                                    <button className="radius-30 btn-add w-50">Delete</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="deductpp" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Deduct PP </h4>
                            <button type="button" className="close" data-dismiss="modal">
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-group">
                                    <p>Please enter the number of PP you want to deduct.</p>
                                    <label>PP</label>
                                    <input className="form-control" placeholder="Enter here " />
                                </div>
                                <div className="form-group text-center d-flex justify-content-between mt-5">
                                    <button className="radius-30 btn-cancel w-50 mr-2">
                                        Cancel
                                    </button>
                                    <button className="radius-30 btn-add w-50">Confirm</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard