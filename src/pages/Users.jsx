import { useEffect, useState } from "react"
import { allUsersList } from "../utils/authUtils"
import img1 from "../assets/img/refresh.png"
import img2 from "../assets/img/apps.png"

const Users = () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODFlM2RiM2U0YWRlYjdhMWJmYTg0YzIiLCJpYXQiOjE3NDg3NzE2MDZ9.Ikw6eqHNrQ_bDDS9nbAeqdcxPSQRLRuKBT1q9WD3wvA"
    const [userData, setUsersData] = useState([]);
    const [limit, setLimit] = useState(10);
    const [loading, setLoading] = useState(false);
    const [filtered, setFiltered] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [searchParams, setSearchParams] = useState({
        name: "",
        number: "",
        email: "",
        gender: "",
        location: "",
        pp: "",
        country: ""
    });

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setDeleteModalOpen(true);
        setOpenDropdownId(null);
    };

    const handleDeleteConfirm = async (e) => {
        e.preventDefault();

        if (!userToDelete) return;

        try {
            setLoading(true);

            const response = await fetch(
                `https://server.rmmbr.me/api/v1/user/delete-account/${userToDelete._id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            setUsersData(prev => prev.filter(user => user._id !== userToDelete._id));
            if (filtered.length > 0) {
                setFiltered(prev => prev.filter(user => user._id !== userToDelete._id));
            }

            setDeleteModalOpen(false);
            setUserToDelete(null);

        } catch (error) {
            console.error("Delete failed:", error);
            alert(`Delete failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const toggleDropdown = (userId) => {
        setOpenDropdownId(prev => (prev === userId ? null : userId));
    };

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

    const handleDelete = (e) => {
        e.preventDefault();

        if (!selectedUserId) return;
        setUsersData(prev => prev.filter(user => user._id !== selectedUserId));

        window.$('#delete').modal('hide');
    };

    const filteredUsers = userData.filter(user => {
        const matchesName = user.fullName?.toLowerCase().includes(searchParams.name.toLowerCase());
        const matchesNumber = user.phone?.includes(searchParams.number);
        const matchesEmail = user.email?.toLowerCase().includes(searchParams.email.toLowerCase());
        const matchesGender = user.gender?.toLowerCase().includes(searchParams.gender.toLowerCase());
        const matchesLocation = user.city?.toLowerCase().includes(searchParams.location.toLowerCase());
        const matchesPP = user.pps?.toString().includes(searchParams.pp);
        const matchesCountry = user.country?.toLowerCase().includes(searchParams.country.toLowerCase());

        return (
            matchesName &&
            matchesNumber &&
            matchesEmail &&
            matchesGender &&
            matchesLocation &&
            matchesPP &&
            matchesCountry
        );
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".action-dropdown")) {
                setOpenDropdownId(null);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const calculateAge = (dob) => {
        if (!dob) return "N/A";
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const exportToCSV = () => {
        const headers = [
            "Full Name",
            "Bio",
            "Gender",
            "Email",
            "Linked By",
            "Phone",
            "Country Code",
            "Is Email Verified",
            "Is Phone Verified",
            "Is Verified",
            "City",
            "Country",
            "DOB",
            "Age",
            "Relation Requests Count",
            "Sended Requests Count",
            "Is Linked",
            "Profile Image URL Available",
            "Account Privacy",
            "Green Tick",
            "Is Blocked"
        ];

        const rows = (filtered.length > 0 ? filtered : userData).map(user => [
            user.fullName || "N/A",
            user.bio || "N/A",
            user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : "N/A",
            user.email || "N/A",
            user.linkedBy || "N/A",
            user.phone || "N/A",
            user.countryCode || "N/A",
            user.isEmailVerified ? "Yes" : "No",
            user.isPhoneVerified ? "Yes" : "No",
            user.isVarified ? "Yes" : "No",
            user.city || "N/A",
            user.country || "N/A",
            user.dob ? new Date(user.dob).toLocaleDateString() : "N/A",
            calculateAge(user.dob),
            (user.relationRequests?.length ?? 0).toString(),
            (user.sendedRequests?.length ?? 0).toString(),
            user.isLinked ? "Yes" : "No",
            user.profileImageUrl ? "Yes" : "No",
            user.account_privacy || "N/A",
            user.greenTick ? "Yes" : "No",
            user.isBlocked ? "Yes" : "No"
        ]);

        const csvContent =
            [headers, ...rows]
                .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
                .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "users_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        userList();
    }, []);

    console.log("First User:", userData);

    return (
        <>
            <div className="breadcrumbs-area">
                <div className="heading">Users</div>
                <p style={{ fontSize: "13px" }}>Lorem ipsum dolor sit amet consectetur adipiscing</p>
            </div>
            <div className="container-fluid p-4">
                <div className="card height-auto">
                    <div className="card-body">
                        <div className="d-flex justify-content-between border-bottom pb-3 flex-wrap">
                            <div
                                className="search-header"
                                data-toggle="collapse"
                                href="#searchCollapse"
                                role="button"
                            >
                                <i className="fa fa-chevron-down mr-2" />
                                Advance Search
                            </div>
                            <div className="d-flex">
                                {/* <button className="btn btn-outline-secondary btn-sm mr-2" style={{ fontSize: "13px" }}>
                                    <img src={img2} /> Choose Search Options
                                </button> */}
                                <button
                                    className="btn btn-danger-outline btn-sm mr-2" style={{ fontSize: "13px", border: "red" }}
                                    onClick={() => {
                                        setSearchParams({
                                            name: "",
                                            number: "",
                                            email: "",
                                            gender: "",
                                            location: "",
                                            pp: "",
                                            country: ""
                                        });
                                        setFiltered([]);
                                    }}
                                >
                                    Clear
                                </button>
                                <button className="btn btn-dark btn-sm" style={{ fontSize: "13px" }} onClick={() => setFiltered(filteredUsers)}>Search</button>
                            </div>
                        </div>
                        <div className="collapse show mt-3" id="searchCollapse">
                            <div className="row mb-2">
                                <div className="col-md-2 mb-2">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={searchParams.name}
                                        onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-2 mb-2">
                                    <label>Number</label>{" "}
                                    <input type="number"
                                        className="form-control"
                                        value={searchParams.number}
                                        onChange={(e) => setSearchParams({ ...searchParams, number: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-2 mb-2">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={searchParams.email}
                                        onChange={(e) => setSearchParams({ ...searchParams, email: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-2 mb-2">
                                    <label>Gender</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={searchParams.gender}
                                        onChange={(e) => setSearchParams({ ...searchParams, gender: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-2 mb-2">
                                    <label>Location</label>
                                    <input
                                        className="form-control"
                                        value={searchParams.location}
                                        onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-2 mb-2">
                                    <label>PP</label>
                                    <input
                                        className="form-control"
                                        value={searchParams.pp}
                                        onChange={(e) => setSearchParams({ ...searchParams, pp: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-2 mb-2">
                                    <label>Country</label>
                                    <input
                                        className="form-control"
                                        value={searchParams.country}
                                        onChange={(e) => setSearchParams({ ...searchParams, country: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card height-auto">
                    <div className="card-body">
                        {/* Table Header Controls */}
                        <div className="d-flex justify-content-between align-items-center mt-3 mb-2 flex-wrap">
                            <div className="d-flex justify-content-between align-items-center flex-wrap">
                                <div className="section-controls mr-5">
                                    <button
                                        onClick={userList}
                                        style={{
                                            border: "none",
                                            outline: 0,
                                            background: "transparent"
                                        }}
                                    >
                                        <img
                                            src={img1}
                                            alt="Refresh"
                                            className={loading ? "rotate" : ""}
                                        />
                                    </button>
                                    Total Records: <strong>{userData?.length || 0}</strong>
                                </div>
                                <div className="section-controls">
                                    Display up to:
                                    <select
                                        className="custom-select d-inline-block w-auto ml-1"
                                        value={limit}
                                        onChange={(e) => setLimit(Number(e.target.value))}
                                    >
                                        <option value={10}>10</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                    </select>
                                    <button className="btn btn-dark btn-sm ml-2" onClick={exportToCSV} style={{ fontSize: "13px" }}>
                                        <i className="fa fa-download" /> Export
                                    </button>
                                </div>
                            </div>
                            {/* <button
                                className="btn btn-outline-secondary btn-sm"
                                data-toggle="modal"
                                data-target="#manage" style={{ fontSize: "13px" }}
                            >
                                <img src={img2} /> Manage Column
                            </button> */}
                        </div>
                        {/* User Table */}
                        <div className="table-responsive bg-white">
                            <table className="table table-bordered table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th style={{ fontSize: "13px" }}>Profile</th>
                                        <th style={{ fontSize: "13px" }}>Name</th>
                                        <th style={{ fontSize: "13px" }}>Number</th>
                                        <th style={{ fontSize: "13px" }}>Email</th>
                                        <th style={{ fontSize: "13px" }}>Gender</th>
                                        <th style={{ fontSize: "13px" }}>Location</th>
                                        <th style={{ fontSize: "13px" }}>DOB</th>
                                        <th style={{ fontSize: "13px" }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="8" align="center">
                                                <div className="spinner-border text-dark" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        (filtered.length > 0 ? filtered : userData)?.slice(0, limit).map((user, index) => (
                                            <tr key={user._id || index}>
                                                <td>
                                                    <img
                                                        src={user.profileImageUrl || "https://i.pravatar.cc/32"}
                                                        className="table-avatar"
                                                        alt="avatar"
                                                    />
                                                </td>
                                                <td style={{ fontSize: "11px" }}>{user.fullName}</td>
                                                <td style={{ fontSize: "11px" }}>{user.countryCode} {user.phone}</td>
                                                <td style={{ fontSize: "11px" }}>{user.email}</td>
                                                <td style={{ fontSize: "11px" }}>{user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : "N/A"}</td>
                                                <td style={{ fontSize: "11px" }}>{user.city ? `${user.city}, ${user.country}` : user.country || "N/A"}</td>
                                                <td style={{ fontSize: "11px" }}>{user.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}</td>
                                                <td align="center">
                                                    <div className="dropdown action-dropdown position-relative">
                                                        <span
                                                            className="ellipsis-btn"
                                                            onClick={() => toggleDropdown(user._id)}
                                                            style={{ cursor: "pointer" }}
                                                        >
                                                            <i className="fa fa-ellipsis-v" />
                                                        </span>

                                                        {openDropdownId === user._id && (
                                                            <div className="dropdown-menu mb-3 show position-absolute" style={{ left: "-121px" }}>
                                                                {/* <a
                                                                    className="dropdown-item"
                                                                    href="#"
                                                                    // data-toggle="modal"
                                                                    // data-target="#delete"
                                                                    onClick={() => {
                                                                        setSelectedUser(user);
                                                                        setOpenDropdownId(null);
                                                                    }}
                                                                >
                                                                    Delete
                                                                </a> */}
                                                                <a
                                                                    className="dropdown-item"
                                                                    href="#"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleDeleteClick(user);
                                                                    }}
                                                                >
                                                                    Delete
                                                                </a>
                                                                <a
                                                                    className="dropdown-item"
                                                                    href="#"
                                                                    data-toggle="modal"
                                                                    data-target="#deductpp"
                                                                    onClick={() => {
                                                                        setSelectedUser(user);
                                                                        setOpenDropdownId(null);
                                                                    }}
                                                                >
                                                                    Profile
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="modal fade" id="delete" role="dialog">
                <div className="modal-dialog">
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
            </div> */}
            {/* {deleteModalOpen && (
                <div className="modal show" style={{ display: 'block' }} id="delete" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Delete User</h4>
                                <button
                                    type="button"
                                    className="close"
                                    onClick={() => setDeleteModalOpen(false)}
                                >
                                    ×
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <label>
                                            Confirm delete user: <strong>{userToDelete?.fullName}</strong>?
                                        </label>
                                        <p className="text-muted small mt-2">
                                            This action cannot be undone.
                                        </p>
                                    </div>
                                    <div className="form-group text-center d-flex justify-content-between mt-5">
                                        <button
                                            type="button"
                                            className="radius-30 btn-cancel w-50 mr-2"
                                            onClick={() => setDeleteModalOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="radius-30 btn-add w-50"
                                            onClick={handleDeleteConfirm}
                                            disabled={loading}
                                        >
                                            {loading ? 'Deleting...' : 'Confirm Delete'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </div>
            )} */}
            {deleteModalOpen && (
                <>
                    <div className={`modal-top ${deleteModalOpen ? 'show' : ''}`}>
                        <div className="modal-header">
                            <h4 className="modal-title">Delete User</h4>
                            <button
                                type="button"
                                className="close"
                                onClick={() => setDeleteModalOpen(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-group">
                                    <label>
                                        Confirm delete user: <strong>{userToDelete?.fullName}</strong>?
                                    </label>
                                    <p className="text-muted small mt-2">
                                        This action cannot be undone.
                                    </p>
                                </div>
                                <div className="form-group text-center d-flex justify-content-between mt-5">
                                    <button
                                        type="button"
                                        className="radius-30 btn-cancel w-50 mr-2"
                                        onClick={() => setDeleteModalOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="radius-30 btn-add w-50"
                                        onClick={handleDeleteConfirm}
                                        disabled={loading}
                                    >
                                        {loading ? 'Deleting...' : 'Confirm Delete'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div
                        className={`modal-top-backdrop ${deleteModalOpen ? 'show' : ''}`}
                        onClick={() => setDeleteModalOpen(false)}
                    />
                </>
            )}
            <div className="modal fade" id="deductpp" role="dialog">
                <div className="modal-dialog">
                    {/* Modal content*/}
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
            <div className="modal fade" id="manage" role="dialog">
                <div className="modal-dialog" style={{ maxWidth: 750 }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Manage Column</h5>
                            <button type="button" className="close" data-dismiss="modal">
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row justify-content-center">
                                {/* All Filters */}
                                <div className="col-md-4">
                                    <div
                                        className="filter-box"
                                        style={{ background: "#F7F8FA" }}
                                    >
                                        <div className="checkbox-label">
                                            <input type="checkbox" /> First Name
                                        </div>
                                        <div className="checkbox-label">
                                            <input type="checkbox" /> Last Name
                                        </div>
                                        <div className="checkbox-label">
                                            <input type="checkbox" /> Email Address
                                        </div>
                                        <div className="checkbox-label">
                                            <input type="checkbox" /> Contact Number
                                        </div>
                                    </div>
                                </div>
                                {/* Arrows */}
                                <div className="col-md-3 filter-actions">
                                    <button className="btn btn-sm btn-light">Add &gt;</button>
                                    <button className="btn btn-sm btn-light">
                                        &lt; Remove
                                    </button>
                                </div>
                                {/* Filters Added */}
                                <div className="col-md-4">
                                    <div className="filter-box">
                                        <div className="checkbox-label">
                                            <input type="checkbox" /> Location
                                        </div>
                                        <div className="checkbox-label">
                                            <input type="checkbox" /> PP
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Footer */}
                        <div className="modal-footer">
                            <button className="btn-cancel1">Cancel</button>
                            <button className="btn-submit1">Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Users