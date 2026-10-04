import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Login from "./Login";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [students, setStudents] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [loggedIn, setLoggedIn] = useState(
  localStorage.getItem("token") ? true : false
);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://192.168.1.3:5000/students");
      setStudents(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async () => {
    try {
      if (isEditing) {
      await axios.put(
  `http://192.168.1.3:5000/students/update/${editingId}`,
  {
    name,
    email,
    course,
  }
); 

        alert("Student Updated Successfully!");

        setIsEditing(false);
        setEditingId(null);
      } else {
        if (!name || !email || !course) {
  alert("Please fill all fields");
  return;
}

const emailRegex = /\S+@\S+\.\S+/;

if (!emailRegex.test(email)) {
  alert("Enter a valid email");
  return;
}
       await axios.post("http://192.168.1.3:5000/students/add", {
          name,
          email,
          course,
        });

        alert("Student Registered Successfully!");
      }

      setName("");
      setEmail("");
      setCourse("");

      fetchStudents();
    } catch (error) {
      console.log(error);
      alert("Error");
    }
  };

  const editStudent = (student) => {
    setName(student.name);
    setEmail(student.email);
    setCourse(student.course);

    setEditingId(student._id);
    setIsEditing(true);
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`http://192.168.1.3:5000/students/delete/${id}`);

      alert("Student Deleted Successfully!");

      fetchStudents();
    } catch (error) {
      console.log(error);
      alert("Error deleting student");
    }
  };
  const filteredStudents = students.filter((student) =>
  student.name.toLowerCase().includes(search.toLowerCase())
);

const handleDelete = async (id) => {
  try {
    await axios.delete(`http://192.168.1.3:5000/students/delete/${id}`);
    alert("Student Deleted Successfully!");
    fetchStudents();
  } catch (error) {
    alert("Error deleting student");
    console.log(error);
  }
};
if (!loggedIn) {
  return <Login onLogin={() => setLoggedIn(true)} />;
}

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>🎓 Student Registration Portal</h1>
      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
  <h1>🎓 Student Registration Portal</h1>

  <button
  className="logout-btn"
  onClick={() => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  }}
>
  Logout
</button>
</div>

      <div>
        <label>Name</label>
        <br />
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <br />

      <div>
        <label>Email</label>
        <br />
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <br />

      <div>
        <label>Course</label>
        <br />
        <input
          type="text"
          placeholder="Enter Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />
      </div>

      <br />

      <button className="register-btn" onClick={handleSubmit}>
  {isEditing ? "Update Student" : "Register Student"}
</button>
      <hr />

<h2>Student List</h2>

<h3>Total Students: {filteredStudents.length}</h3>

<input
  type="text"
  placeholder="Search by name..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{
    padding: "8px",
    width: "250px",
    marginBottom: "20px",
  }}
/>

{students.length === 0 ? (
  <p>No students found.</p>
) : (
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Course</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      {filteredStudents.map((student) => (
        <tr key={student._id}>
          <td>{student.name}</td>
          <td>{student.email}</td>
          <td>{student.course}</td>
          <td>
            <button
              className="edit-btn"
              onClick={() => editStudent(student)}
            >
              Edit
            </button>

           <button
  className="delete-btn"
  onClick={() => handleDelete(student._id)}
>
  Delete
</button> 

          </td>
        </tr>
      ))}
    </tbody>
  </table>
)}
    </div>
  );
}

export default App;