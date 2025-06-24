import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import Swal from "sweetalert2";
import axios from "axios";

const CmsManagement = () => {
  const editorRef = useRef(null);
  const api_key = "552pnak96y1byr4ptd3zlegc8shchhdu4sz4sue4v5gsn2si"; // Optional: your TinyMCE API key

  const [editorContent, setEditorContent] = useState("");
  const [tableData, setTableData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({ editorContent: "" });

  const token =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODFlM2RiM2U0YWRlYjdhMWJmYTg0YzIiLCJpYXQiOjE3NTA2OTg5Mjl9.m_Ub0tXB6AFI9vuj8Wt8N7A76HgJL4LzSN26r3aWDew";

  const fetchPrivacy = async () => {
    try {
      const res = await axios.get(
        "https://backend.rmmbr.me/api/v1/policy/get/privacy"
      );
      const content = res?.data?.data?.content || "";
      setEditorContent(content);

      setTableData([
        {
          srNum: 1,
          title: "Privacy Policy",
          content: content,
          status: "Active",
        },
      ]);
    } catch (error) {
      console.error("Error fetching privacy:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editorContent.trim()) {
      setErrors({ editorContent: "Page Content is required." });
      return;
    }

    setSaving(true);
    try {
      await axios.post(
        "https://backend.rmmbr.me/api/v1/policy/add-or-update",
        {
          type: "privacy",
          title: "Privacy Policy",
          content: editorContent,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      Swal.fire("Success", "Privacy Policy updated successfully", "success");
      fetchPrivacy();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating policy:", error);
      Swal.fire("Error", "Failed to update policy", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchPrivacy();
  }, []);

  return (
    <main className="app-content">
      <div className="app-title tile p-3">
        <h1 className="fw-bold">CMS</h1>
      </div>

      <div className="row">
        <div className="col-md-12 px-5">
          <div className="tile p-3">
            <div className="tile-body">
              <table className="table table-bordered table-hover mt-2">
                <thead>
                  <tr>
                    <th>Sr. num</th>
                    <th>Page name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.length > 0 ? (
                    tableData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.srNum}</td>
                        <td>{item.title}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={handleEdit}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="cross-button"
              aria-label="Close"
              onClick={() => setIsModalOpen(false)}
            >
              <i className="fa fa-times"></i>
            </button>

            <div
              className="case-status d-flex justify-content-center"
              style={{
                backgroundColor: "#00489d",
                color: "#fff",
                height: "50px",
              }}
            >
              <h4 style={{ marginTop: "12px" }}>Edit CMS</h4>
            </div>

            <div className="tile-body p-3">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Page Content</label>
                  <Editor
                    apiKey={api_key}
                    value={editorContent}
                    onEditorChange={(content) => setEditorContent(content)}
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    init={{
                      height: 400,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "help",
                        "wordcount",
                      ],
                      toolbar:
                        "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                    }}
                  />
                  {errors.editorContent && (
                    <div className="invalid-feedback d-block">
                      {errors.editorContent}
                    </div>
                  )}
                </div>

                <div className="text-center mt-3">
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={saving}
                  >
                    {saving ? "Updating..." : "Update Page"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary ml-2"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CmsManagement;
