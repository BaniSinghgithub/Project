import Navbar from "./navbar";
import "./App.css";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Form() {
  const API_URL=process.env.REACT_APP_API_URL || "http://localhost:5000";
  const [data, setData] = useState({
    title: "",
    content: "",
    tags: "",
    status: "active",
    // author: ""
  }); // containing only data, present in form

  const [userdata, setUserData] = useState([]); // containing all data of saved threads
  const [showComments, setShowComments] = useState({}); // store data of comments, which is to be shown/hidden
  const [newComment, setNewComment] = useState(""); // add new comment
  const [commentBoxIndex, setCommentBoxIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // collecting data of threads from database on starting of page
    const fetchData = async () => {
      try {
        const databaseData = await axios.get(
          `${API_URL}/api/userRoutes/getthread`
        );
        setUserData(databaseData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
      const user = sessionStorage.getItem("token");
      if (!user) {
        // setUser(user);
        navigate("/login");
      }
    }, []);

  const getvalue = (event) => {
    // on changing any input of form
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const processdata = async (e) => {
    // on form submit
    e.preventDefault();

    if (data.title.length === 0 || data.content.length === 0) {
      toast.error("Please fill all required fields");
      return;
    }

    const tagsArray = data.tags
      ? String(data.tags)
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag)
      : [];

    // const author=localStorage.getItem("user").name;

    const currentformdata = {
      title: data.title,
      content: data.content,
      tags: tagsArray,
      status: data.status,
      comments: [],
      // author: data.author,
      createdAt: new Date().toISOString(),
    };

    setUserData([...userdata, currentformdata]);
    setData({
      title: "",
      content: "",
      tags: "",
      status: "active",
    });

    toast.success("Thread sent for database successfully!");

    try {
      const response = await axios.post(
       `${API_URL}/api/userRoutes/savethread`,
        data
      );
      if (!response.status) {
        toast.error("Failed to store thread in MongoDB");
      } else {
        toast.success("Thread saved in database successfully!");
      }
      // const data = await response.json();
      console.log(response.message);
    } catch (error) {
      console.error("Error storing thread in MongoDB:", error);
      toast.error("Failed to store thread in MongoDB");
    }
  };

  //updating comment of any topic
  const addComment = async (threadIndex, comment) => {
    try {
      if (!comment.trim()) {
        toast.error("Comment cannot be empty");
        return;
      }
      const updatedUserData = await Promise.all(
        // waiting until all promises are resolved

        userdata.map(async (thread, index) => {
          if (index === threadIndex) {
            // toast.success(comment);
            // Sending update request to backend
            const response = await axios.put(
              `${API_URL}/api/userRoutes/updatethread/${thread.content}`,
              { comment }
            );

            if (response.status) {
              toast.success("Comment added successfully in database");
            } else {
              toast.error("Failed to add comment");
            }

            // Updating state with the new comment
            return {
              ...thread,
              comments: [
                ...thread.comments,
                {
                  content: comment,
                  createdAt: new Date().toISOString(),
                },
              ],
            };
          }
          return thread;
        })
      );

      setUserData(updatedUserData);
      setNewComment("");
      toast.success("Comment added successfully in frontend!");
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Failed to update comment.");
    }
  };

  // to show or hide the comment box
  const toggleComments = (index) => {
    setCommentBoxIndex(index);

    setShowComments((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // editing any topic/thread
  const editdata = (index) => {
    setData(userdata[index]);
    deldata(index);
  };

  // delete any topic/thread
  const deldata = async (index) => {
    const resonse = await axios.delete(
      `${API_URL}/api/userRoutes/deletethread/${userdata[index].content}`
    );
    if (resonse.status) {
      toast.success(resonse.message);
    } else return toast.error(resonse.message);

    setUserData(userdata.filter((_, i) => i !== index));
  };

  return (
    <div className="contain">
      <div className="header">
        <Navbar />
      </div>
      <ToastContainer />
      <div className="content">
        <div className="form">
          <form onSubmit={processdata} className="mb-4">
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                name="title"
                type="text"
                placeholder="Title"
                className="form-control"
                value={data.title}
                onChange={getvalue}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Content</label>
              <textarea
                name="content"
                placeholder="Describe your issue here"
                value={data.content}
                onChange={getvalue}
                className="form-control"
                rows="4"
                required
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">Tags (comma-separated)</label>
              <input
                name="tags"
                type="text"
                placeholder="Enter tags (e.g., discussion, question, help)"
                className="form-control"
                value={data.tags}
                onChange={getvalue}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-control"
                value={data.status}
                onChange={getvalue}
              >
                <option value="active">Active</option>
                <option value="closed">Closed</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary bg-info">
              Submit
            </button>
          </form>
        </div>

        <div className="container">
          <div className="threads">
            {userdata.length >= 1 ? (
              userdata.map((thread, i) => (
                <div key={i} className="card mb-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="card-title">{thread.title}</h5>
                      <div>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          title="Edit"
                          onClick={() => editdata(i)}
                        >
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                        <button
                          className="btn btn-sm btn-danger me-2"
                          title="Delete"
                          onClick={() => deldata(i)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                        <button
                          className="btn btn-sm btn-info"
                          title="see / add comments"
                          onClick={() => toggleComments(i)}
                        >
                          <FontAwesomeIcon icon={faComment} />
                        </button>
                      </div>
                    </div>

                    <p className="card-text">{thread.content}</p>

                    <div className="mb-2">
                      {thread.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="badge bg-secondary me-1"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <small className="text-muted">
                      Status: {thread.status} | Created:{" "}
                      {new Date(thread.createdAt).toLocaleDateString()}
                    </small>

                    {showComments[i] && (
                      <div className="mt-3">
                        <h6>Comments</h6>
                        <div className="comments-section">
                          {thread.comments.map((comment, commentIndex) => (
                            <div
                              key={commentIndex}
                              className="comment border-bottom py-2"
                            >
                              <p className="mb-1">{comment.content}</p>
                              <small className="text-muted">
                                {/* By {comment.user} on{" "} */}
                                {new Date(
                                  comment.createdAt
                                ).toLocaleDateString()}
                              </small>
                            </div>
                          ))}
                          {i===commentBoxIndex && (
                            
                            <div className="mt-2">
                            <div 
                             className="input-group">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                              />
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => addComment(i, newComment)}
                                >
                                Comment
                              </button>
                            </div>
                          </div>
                              )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="alert alert-info">
                No question yet, Be the first to create one!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Form;

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
  integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
  crossorigin="anonymous"
/>;
