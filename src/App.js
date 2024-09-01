import "./App.css";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Table from 'react-bootstrap/Table';

function App() {
  let [data, setdata] = useState({
    uname: "",
    uemail: "",
    uphone: "",
    umessage: "",
  });
  let [userdata, setuserdata] = useState([]);

  let getvalue = (event) => {
    let olddata = { ...data };
    olddata[event.target.name] = event.target.value;
    setdata(olddata);
  };

  let processdata = (e) => {
    let formempty = () => {
      if (
        data.uname.length === 0 ||
        data.uemail.length === 0 ||
        data.umessage.length === 0
      ) {
        return 1;
      } else {
        return 0;
      }
    };

    let duplicate = userdata.filter((v) => {
      return v.uemail == data.uemail || v.uphone == data.uphone;
    });

    if (duplicate.length >= 1) {
      // there are some duplicate values
      toast.error("Email or Phone Number already exist");
    } else if (formempty() === 1) {
      toast.error("Please fill all the fields");
    } else if (data.uphone.length != 10) {
      toast.error("Please enter 10 digit phone number");
    } else {
      let currentformdata = {
        uname: data.uname,
        uemail: data.uemail,
        uphone: data.uphone,
        umessage: data.umessage,
      };

      let newdata = [...userdata, currentformdata];
      setuserdata(newdata);

      setdata({
        uname: "",
        uemail: "",
        uphone: "",
        umessage: "",
      });
    }
  };

  let editdata = (index) => {
    userdata.map((v, i) => {
      if (i === index) {
        return setdata(v);
      }
    });
    return deldata(index);
  };

  let deldata = (index) => {
    let modi = userdata.filter((v, i) => {
      return i !== index;
    });
    setuserdata(modi);
  };

  return (
    <div className="main">
      <div>
      <div className="head">
        <h1>Enquiry Form</h1>
        </div>
      </div>
     

      <ToastContainer />
      <div className="content">
        <div className="form">
          <form className="">
            <label className="form-label">Name</label>
            <input
              name="uname"
              type="text" placeholder="Enter your name"
              className="form-control"
              value={data.uname}
              onChange={getvalue}
              required
            />

            <label className="form-label">Email</label>
            <input
              name="uemail" placeholder="Enter email-id"
              value={data.uemail}
              onChange={getvalue}
              type="email"
              className="form-control"
              required
            />

            <label className="form-label">Phone</label>
            <input
              className="form-control" placeholder="Enter phone number"
              name="uphone"
              value={data.uphone}
              onChange={getvalue}
              type="number"
              required
            />

            <label className="form-label">Message</label>
            <textarea
              name="umessage" placeholder="Leave a message"
              value={data.umessage}
              onChange={getvalue}
              className="form-control"
              required
            ></textarea>

            <button
              onClick={(e) => {
                processdata();
                e.preventDefault();
              }}
              type="submit"
            >
              Save
            </button>
          </form>
        </div>

{/* table data */}

        <div className="container mt-4">
          <table className=''>
            <thead>
              <tr className="">
                <th className="sp">Name</th>
                <th className="sp">Email</th>
                <th className="sp">Phone</th>
                <th className="sp">Message</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {userdata.length >= 1 ? (
                userdata.map((v, i) => {
                  return (
                    <tr key={i}>
                      <td className="sp">{v.uname}</td>
                      <td className="sp">{v.uemail}</td>
                      <td className="sp">{v.uphone}</td>
                      <td className="sp">{v.umessage}</td>
                      <td className="editdelete">
                        <div className="edit" onClick={() => editdata(i)}>
                          <FontAwesomeIcon
                            beatFade
                            size="xl"
                            icon={faPenToSquare}
                          />
                        </div>
                        <div className="del" onClick={() => deldata(i)}>
                          <FontAwesomeIcon
                            icon={faTrash}
                            beatFade
                            size="xl"
                            
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6}>No data found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
  integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
  crossorigin="anonymous"
/>;


// background transparency, email validation,background padding at top