import React from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

const HelpSupport = () => {
    return (
        <>
            <div className="breadcrumbs-area">
                <div className="d-flex flex-wrap justify-content-between align-items-center">
                    <div>
                        <div className="heading">Help &amp; Support</div>
                        <p>Lorem ipsum dolor sit amet consectetur adipiscing</p>
                    </div>
                    <div>
                        <a
                            href="javascript:void()"
                            className="btn-add"
                            data-toggle="modal"
                            data-target="#addnewtopic"
                        >
                            Add New Topic
                        </a>
                    </div>
                </div>
            </div>
            <div className="container-fluid p-4">
                <div className="topic-card">
                    <div>Topic 1</div>
                    <div className="d-flex">
                        <button className="btn btn-edit">Edit</button>
                        <button className="btn btn-delete">Delete</button>
                    </div>
                </div>
                <div className="topic-card">
                    <div>Topic 2</div>
                    <div className="d-flex">
                        <button className="btn btn-edit">Edit</button>
                        <button className="btn btn-delete">Delete</button>
                    </div>
                </div>
                <div className="topic-card">
                    <div>Topic 3</div>
                    <div className="d-flex">
                        <button className="btn btn-edit">Edit</button>
                        <button className="btn btn-delete">Delete</button>
                    </div>
                </div>
                <div className="topic-card">
                    <div>Topic 4</div>
                    <div className="d-flex">
                        <button className="btn btn-edit">Edit</button>
                        <button className="btn btn-delete">Delete</button>
                    </div>
                </div>
                <div className="topic-card">
                    <div>Topic 5</div>
                    <div className="d-flex">
                        <button className="btn btn-edit">Edit</button>
                        <button className="btn btn-delete">Delete</button>
                    </div>
                </div>
                <div className="topic-card">
                    <div>Topic 6</div>
                    <div className="d-flex">
                        <button className="btn btn-edit">Edit</button>
                        <button className="btn btn-delete">Delete</button>
                    </div>
                </div>
                <div className="topic-card">
                    <div>Topic 7</div>
                    <div className="d-flex">
                        <button className="btn btn-edit">Edit</button>
                        <button className="btn btn-delete">Delete</button>
                    </div>
                </div>
                <div className="topic-card">
                    <div>Topic 8</div>
                    <div className="d-flex">
                        <button className="btn btn-edit">Edit</button>
                        <button className="btn btn-delete">Delete</button>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="addnewtopic" role="dialog">
                <div className="modal-dialog">
                    {/* Modal content*/}
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Add New Topic</h4>
                            <button type="button" className="close" data-dismiss="modal">
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-group">
                                    <label>Title</label>
                                    <input className="form-control" placeholder="Enter here " />
                                </div>
                                <div className="form-group">
                                    <label>Text</label>
                                    <textarea
                                        className="form-control"
                                        placeholder="Enter here "
                                        style={{ height: 100 }}
                                        defaultValue={""}
                                    />
                                </div>
                                <div className="form-group text-center d-flex justify-content-between mt-5">
                                    <button className="radius-30 btn-cancel w-50 mr-2">
                                        Cancel
                                    </button>
                                    <button className="radius-30 btn-add w-50">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HelpSupport