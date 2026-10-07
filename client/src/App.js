import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Login from "./Login";

function App() {
  // =========================
  // STUDENT REGISTRATION DATA
  // =========================
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [students, setStudents] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [skills, setSkills] = useState([]);
  const [careerGoal, setCareerGoal] = useState("");
  const [gapResults, setGapResults] = useState([]);
  const [analyzedCareer, setAnalyzedCareer] = useState("");
  const [teacherSelectedStudent, setTeacherSelectedStudent] = useState(null);
  const [mentorFeedback, setMentorFeedback] = useState("");
const [supportStatus, setSupportStatus] = useState("Needs Attention");

  // =========================
  // LOGIN
  // =========================
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("token") ? true : false
  );
  const [userRole, setUserRole] = useState(
  localStorage.getItem("userRole") || null
);

const [username, setUsername] = useState(
  localStorage.getItem("username") || ""
);

  // =========================
  // PAGE NAVIGATION
  // =========================
const [activePage, setActivePage] = useState("dashboard");
  // =========================
  // GET STUDENTS
  // =========================
  const fetchStudents = async () => {
  try {
    if (userRole === "teacher") {
      const response = await axios.get(
        "http://localhost:5000/students"
      );

      setStudents(response.data);
    } else {
      const userEmail = localStorage.getItem("userEmail");

      const response = await axios.get(
        `http://localhost:5000/students/user/${userEmail}`
      );

      setStudents([response.data]);
      setSelectedStudent(response.data);
    }
  } catch (error) {
    console.log(error);
  }
};

  useEffect(() => {
  if (loggedIn) {
    fetchStudents();
  }
}, [loggedIn]);

useEffect(() => {
  if (selectedStudent) {
    setSkills(
      selectedStudent.skills && selectedStudent.skills.length > 0
        ? selectedStudent.skills
        : [
            { name: "HTML/CSS", level: "Beginner" },
            { name: "JavaScript", level: "Beginner" },
            { name: "React", level: "Beginner" },
            { name: "Node.js", level: "Beginner" },
            { name: "SQL", level: "Beginner" },
            { name: "REST APIs", level: "Beginner" },
            { name: "Git", level: "Beginner" },
            { name: "Python", level: "Beginner" },
            { name: "Java", level: "Beginner" },
            { name: "DSA", level: "Beginner" },
          ]
    );

    setCareerGoal(selectedStudent.careerGoal || "");
  }
}, [selectedStudent]);
  // =========================
  // ADD / UPDATE STUDENT
  // =========================
  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:5000/students/update/${editingId}`,
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

        await axios.post(
  "http://localhost:5000/students/add",
  {
    name,
    email,
    course,
    userEmail: localStorage.getItem("userEmail"),
  }
);

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

  // =========================
  // EDIT STUDENT
  // =========================
  const editStudent = (student) => {
    setName(student.name);
    setEmail(student.email);
    setCourse(student.course);

    setEditingId(student._id);
    setIsEditing(true);
  };

  // =========================
  // DELETE STUDENT
  // =========================
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/students/delete/${id}`
      );

      alert("Student Deleted Successfully!");

      fetchStudents();
    } catch (error) {
      alert("Error deleting student");
      console.log(error);
    }
  };

  // =========================
  // SEARCH
  // =========================
  const filteredStudents = students.filter((student) =>
    student.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // =========================
  // LOGIN SCREEN
  // =========================
  if (!loggedIn) {
  return (
    <Login
      onLogin={(role, loggedInUsername) => {
        setLoggedIn(true);
        setUserRole(role);
        setUsername(loggedInUsername);

        if (role === "teacher") {
          setActivePage("support");
        } else {
          setActivePage("dashboard");
        }
      }}
    />
  );
}

  // =========================
  // DASHBOARD
  // =========================
  if (activePage === "dashboard") {
 const dashboardCards =
  userRole === "teacher"
    ? [
        {
          title: "Student Registration",
          icon: "👨‍🎓",
          description: "Manage student profiles and registration details.",
          page: "students",
        },
        {
          title: "Student Support",
          icon: "👨‍🏫",
          description: "Monitor students and provide guidance.",
          page: "support",
        },
      ]
    : [
        {
          title: "My Profile",
          icon: "👨‍🎓",
          description: "View your student profile and registration details.",
          page: "students",
        },
        {
          title: "Skill Passport",
          icon: "🪪",
          description: "Record and track your current technical skills.",
          page: "skills",
        },
        {
          title: "Career Goal",
          icon: "🎯",
          description: "Choose your target career and required skills.",
          page: "career",
        },
        {
          title: "Skill Gap Analysis",
          icon: "📊",
          description: "Identify the skills needed for your career.",
          page: "gap",
        },
        {
          title: "Learning Roadmap",
          icon: "📚",
          description: "Get a personalized path to improve your skills.",
          page: "roadmap",
        },
        {
          title: "My Support",
          icon: "💬",
          description: "View mentor feedback and support progress.",
          page: "my-support",
        },
      ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #eef3ff 0%, #f8faff 50%, #eef7f5 100%)",
        padding: "35px 45px",
        fontFamily: "Arial, Helvetica, sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "45px",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span style={{ fontSize: "38px" }}>🎓</span>

            <h1
              style={{
                margin: 0,
                fontSize: "32px",
                color: "#243b53",
                textAlign: "left",
              }}
            >
              Smart Student Platform
            </h1>
          </div>

          <p
            style={{
              margin: "8px 0 0 50px",
              color: "#64748b",
              fontSize: "15px",
            }}
          >
            Smart Education • Skills • Careers • Support
          </p>
        </div>

        <button
          className="logout-btn"
         onClick={() => {
  localStorage.removeItem("token");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userRole");
  localStorage.removeItem("username");

  setLoggedIn(false);
  setUserRole(null);
  setUsername("");
  setSelectedStudent(null);
  setStudents([]);
  setActivePage("dashboard");
}} 
        >
          Logout
        </button>
      </div>

      {/* Welcome Section */}
      <div
        style={{
          marginBottom: "30px",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#243b53",
            fontSize: "28px",
          }}
        >
          Welcome to your Smart Education Dashboard 👋
        </h2>

        <p
          style={{
            color: "#52606d",
            fontSize: "16px",
            marginTop: "10px",
          }}
        >
         {userRole === "teacher"
  ? "Monitor student progress, provide guidance and support in one place."
  : "Track your skills, career goals, learning roadmap and mentor support in one place."}
        </p>
      </div>

      {/* Overview Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "18px",
          marginBottom: "35px",
        }}
      >
        <div
  style={{
    background: "white",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 5px 18px rgba(31, 45, 61, 0.08)",
    border: "1px solid #e5eaf0",
  }}
>
  <div style={{ fontSize: "28px" }}>
    {userRole === "teacher" ? "👥" : "👤"}
  </div>

  <h3 style={{ margin: "8px 0 4px", color: "#243b53" }}>
    {userRole === "teacher" ? "Students" : "My Profile"}
  </h3>

  <p style={{ margin: 0, color: "#64748b" }}>
    {userRole === "teacher"
      ? `${students.length} registered student profile${
          students.length === 1 ? "" : "s"
        }`
      : "Your registered student profile"}
  </p>
</div>
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "14px",
            boxShadow: "0 5px 18px rgba(31, 45, 61, 0.08)",
            border: "1px solid #e5eaf0",
          }}
        >
          <div style={{ fontSize: "28px" }}>🎯</div>
          <h3 style={{ margin: "8px 0 4px", color: "#243b53" }}>
            Career Focus
          </h3>
          <p style={{ margin: 0, color: "#64748b" }}>
            Career-oriented skill development
          </p>
        </div>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "14px",
            boxShadow: "0 5px 18px rgba(31, 45, 61, 0.08)",
            border: "1px solid #e5eaf0",
          }}
        >
          <div style={{ fontSize: "28px" }}>📈</div>
          <h3 style={{ margin: "8px 0 4px", color: "#243b53" }}>
            Skill Growth
          </h3>
          <p style={{ margin: 0, color: "#64748b" }}>
            Identify gaps and improve skills
          </p>
        </div>
      </div>

      {/* Feature Cards */}
      <h2
        style={{
          color: "#243b53",
          marginBottom: "18px",
        }}
      >
        Platform Features
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {dashboardCards.map((card) => (
          <div
            key={card.page}
            onClick={() => setActivePage(card.page)}
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid #e3e8ef",
              boxShadow:
                "0 6px 20px rgba(31, 45, 61, 0.08)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translateY(-4px)";
              e.currentTarget.style.boxShadow =
                "0 10px 25px rgba(31, 45, 61, 0.14)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(31, 45, 61, 0.08)";
            }}
          >
            <div
              style={{
                fontSize: "34px",
                marginBottom: "12px",
              }}
            >
              {card.icon}
            </div>

            <h3
              style={{
                margin: "0 0 8px",
                color: "#243b53",
                fontSize: "19px",
              }}
            >
              {card.title}
            </h3>

            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
            >
              {card.description}
            </p>

            <div
              style={{
                marginTop: "18px",
                color: "#2563eb",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              Open →
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Message */}
      <div
        style={{
          marginTop: "35px",
          padding: "22px",
          background:
            "linear-gradient(135deg, #243b53, #334e68)",
          borderRadius: "16px",
          color: "white",
        }}
      >
        <h3 style={{ margin: "0 0 8px" }}>
          🚀 Build skills. Discover your path. Get support.
        </h3>

        <p
          style={{
            margin: 0,
            opacity: 0.9,
            lineHeight: "1.5",
          }}
        >
          Your student journey is connected from skill assessment
          to career planning, personalized learning and mentor
          guidance.
        </p>
      </div>
    </div>
  );
}
  // =========================
  // STUDENT REGISTRATION PAGE
  // =========================
  if (activePage === "students") {
    return (
      <div
        style={{
          padding: "30px",
          fontFamily: "Arial",
        }}
      >
        <button
  className="back-btn"
  onClick={() => setActivePage("dashboard")}
>
  ← Back to Dashboard
</button>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>👨‍🎓 Student Registration Portal</h1>

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
            onChange={(e) =>
              setName(e.target.value)
            }
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
            onChange={(e) =>
              setEmail(e.target.value)
            }
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
            onChange={(e) =>
              setCourse(e.target.value)
            }
          />
        </div>

        <br />

        <button
          className="register-btn"
          onClick={handleSubmit}
        >
          {isEditing
            ? "Update Student"
            : "Register Student"}
        </button>

        <hr />

        <h2>Student List</h2>

        <h3>
          Total Students:{" "}
          {filteredStudents.length}
        </h3>

        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
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
              {filteredStudents.map(
                (student) => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.course}</td>

                    <td>
                      <button
                        className="edit-btn"
                        onClick={() =>
                          editStudent(student)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(
                            student._id
                          )
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>
    );
  }

  // =========================
  // PLACEHOLDER PAGES
  // =========================
  if (activePage === "skills") {
  const skillList = [
  "Python",
  "JavaScript",
  "Java",
  "HTML/CSS",
  "React",
  "Node.js",
  "SQL",
  "DSA",
  "Git",
  "REST APIs",
];

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <button
  className="back-btn"
  onClick={() => setActivePage("dashboard")}
>
  ← Back to Dashboard
</button>
      <h1>📋 Skill Passport</h1>

      <p>
        Select a student and record their current skill levels.
      </p>

      <select
        value={selectedStudent?._id || ""}
        onChange={(e) => {
          const student = students.find(
            (s) => s._id === e.target.value
          );

          setSelectedStudent(student || null);

          const updatedSkills = skillList.map((skillName) => {
  const existingSkill = student?.skills?.find(
    (skill) => skill.name === skillName
  );

  return {
    name: skillName,
    level: existingSkill?.level || "Beginner",
  };
});

setSkills(updatedSkills);
        }}
        style={{
          padding: "10px",
          width: "300px",
          marginBottom: "25px",
        }}
      >
        <option value="">Select Student</option>

        {students.map((student) => (
          <option
            key={student._id}
            value={student._id}
          >
            {student.name} - {student.email}
          </option>
        ))}
      </select>

      {selectedStudent && (
        <div>
          <h2>
            Skill Passport: {selectedStudent.name}
          </h2>

          {skills.map((skill, index) => (
            <div
              key={skill.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                maxWidth: "500px",
                padding: "12px",
                marginBottom: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              <strong>{skill.name}</strong>

              <select
                value={skill.level}
                onChange={(e) => {
                  const updatedSkills = [...skills];

                  updatedSkills[index] = {
                    ...updatedSkills[index],
                    level: e.target.value,
                  };

                  setSkills(updatedSkills);
                }}
              >
                <option value="Beginner">
                  Beginner
                </option>

                <option value="Intermediate">
                  Intermediate
                </option>

                <option value="Advanced">
                  Advanced
                </option>
              </select>
            </div>
          ))}

          <button
            className="register-btn"
            onClick={async () => {
              try {
                await axios.put(
                  `http://localhost:5000/students/skills/${selectedStudent._id}`,
                  {
                    skills: skills,
                  }
                );

                alert(
                  "Skill Passport saved successfully!"
                );

                fetchStudents();
              } catch (error) {
                console.log(error);

                alert(
                  "Failed to save Skill Passport."
                );
              }
            }}
          >
            Save Skill Passport
          </button>
        </div>
      )}
    </div>
  );
}

  if (activePage === "career") {
  const careerOptions = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "Software Engineer",
  ];

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <button
  className="back-btn"
  onClick={() => setActivePage("dashboard")}
>
  ← Back to Dashboard
</button>

      <h1>🎯 Career Goal</h1>

      <p>
        Select the career you want to prepare for.
      </p>

      <select
        value={careerGoal}
        onChange={(e) => {
  setCareerGoal(e.target.value);
  setGapResults([]);
  setAnalyzedCareer("");
}}
        style={{
          padding: "12px",
          width: "300px",
          fontSize: "16px",
        }}
      >
        <option value="">Select Career</option>

        {careerOptions.map((career) => (
          <option key={career} value={career}>
            {career}
          </option>
        ))}
      </select>

      {careerGoal && (
        <div style={{ marginTop: "30px" }}>
          <h2>Selected Career</h2>

          <div
            style={{
              padding: "20px",
              maxWidth: "500px",
              border: "1px solid #ddd",
              borderRadius: "10px",
            }}
          >
            <h2>🎯 {careerGoal}</h2>

            <p>
              Your selected career goal will be used to
              identify the skills you need to develop.
            </p>

            <button
  className="register-btn"
  onClick={async () => {
    if (!selectedStudent) {
      alert("Please select a student in Skill Passport first.");
      return;
    }

    if (!careerGoal) {
      alert("Please select a career goal.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/students/update/${selectedStudent._id}`,
        {
          careerGoal: careerGoal,
        }
      );

      setSelectedStudent({
        ...selectedStudent,
        careerGoal: careerGoal,
      });

      await fetchStudents();

      alert("Career Goal Saved Successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save Career Goal.");
    }
  }}
>
  Save Career Goal
</button>
          </div>
        </div>
      )}
    </div>
  );
}

  if (activePage === "gap") {
  const careerRequirements = {
  "Frontend Developer": {
    "HTML/CSS": "Advanced",
    JavaScript: "Advanced",
    React: "Intermediate",
    Git: "Intermediate",
  },

  "Backend Developer": {
    Java: "Intermediate",
    "Node.js": "Advanced",
    SQL: "Intermediate",
    "REST APIs": "Advanced",
    Git: "Intermediate",
  },

  "Full Stack Developer": {
    "HTML/CSS": "Intermediate",
    JavaScript: "Advanced",
    React: "Intermediate",
    "Node.js": "Intermediate",
    SQL: "Intermediate",
    "REST APIs": "Advanced",
    Git: "Intermediate",
  },

  "Data Scientist": {
    Python: "Advanced",
    SQL: "Intermediate",
    DSA: "Intermediate",
  },

  "Software Engineer": {
    Java: "Intermediate",
    Python: "Intermediate",
    DSA: "Advanced",
    SQL: "Intermediate",
    Git: "Intermediate",
  },
};
  const levelValue = {
    Beginner: 1,
    Intermediate: 2,
    Advanced: 3,
  };

  const analyzeSkills = () => {
    if (!selectedStudent) {
      alert("Please select a student in Skill Passport first.");
      return;
    }

    if (!careerGoal) {
      alert("Please select a Career Goal first.");
      return;
    }

    const requirements = careerRequirements[careerGoal] || {};

    const results = Object.entries(requirements).map(
      ([skillName, requiredLevel]) => {
        const currentSkill = selectedStudent.skills?.find(
          (skill) => skill.name === skillName
        );

        const currentLevel =
          currentSkill?.level || "Beginner";

        const gap =
          levelValue[requiredLevel] -
          levelValue[currentLevel];

        return {
  name: skillName,
  current: currentLevel,
  required: requiredLevel,
  gap: gap > 0 ? gap : 0,
  priority:
    gap <= 0
      ? "No Gap"
      : gap === 1
      ? "Needs Improvement"
      : "High Priority",
};
      }
    );

    results.sort((a, b) => b.gap - a.gap);

    setGapResults(results);
    setAnalyzedCareer(careerGoal);
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <button
  className="back-btn"
  onClick={() => setActivePage("dashboard")}
>
  ← Back to Dashboard
</button>

      <h1>📊 Skill Gap Analyzer</h1>

      <p>
        Compare your current skills with the skills required
        for your target career.
      </p>

      <h3>
        Student:{" "}
        {selectedStudent
          ? selectedStudent.name
          : "Select a student in Skill Passport"}
      </h3>

      <h3>
        Career: {careerGoal || "Select a Career Goal first"}
      </h3>

      <button
        className="register-btn"
        onClick={analyzeSkills}
      >
        🔍 Analyze Skill Gap
      </button>

      {gapResults.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h2>
            Skill Gap for {analyzedCareer}
          </h2>

<p
  style={{
    fontSize: "16px",
    color: "#52606d",
    marginBottom: "20px",
  }}
>
  {gapResults.filter((skill) => skill.gap > 0).length === 0
    ? "🎉 You meet all the required skill levels for this career."
    : `You have ${
        gapResults.filter((skill) => skill.gap > 0).length
      } skill gap${
        gapResults.filter((skill) => skill.gap > 0).length === 1
          ? ""
          : "s"
      }. Focus first on the high-priority skills.`}
</p>

{gapResults.length > 0 && gapResults[0].gap > 0 && (
  <div
    style={{
      marginBottom: "20px",
      padding: "16px 20px",
      background: "#fff7ed",
      border: "1px solid #fed7aa",
      borderRadius: "10px",
    }}
  >
    <strong style={{ color: "#9a3412" }}>
      🎯 Top Priority Skill
    </strong>

    <p
      style={{
        margin: "8px 0 0",
        color: "#7c2d12",
      }}
    >
      Focus first on <strong>{gapResults[0].name}</strong>.
      Your current level is{" "}
      <strong>{gapResults[0].current}</strong>, while the
      required level is{" "}
      <strong>{gapResults[0].required}</strong>.
    </p>
  </div>
)}

          <table>
            <thead>
              <tr>
                <th>Skill</th>
                <th>Current Level</th>
                <th>Required Level</th>
                <th>Gap</th>
              </tr>
            </thead>

            <tbody>
              {gapResults.map((skill) => (
                <tr key={skill.name}>
                  <td>{skill.name}</td>
                  <td>{skill.current}</td>
                  <td>{skill.required}</td>
                  <td>
  {skill.priority === "No Gap"
    ? "🟢 No Gap"
    : skill.priority === "Needs Improvement"
    ? "🟡 Needs Improvement"
    : "🔴 High Priority"}
</td>
                </tr>
              ))}
            </tbody>
          </table>

          <br />

          <div
  style={{
    marginTop: "20px",
    padding: "16px",
    background: "#f8fafc",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
  }}
>
  <strong>💡 Recommendation:</strong>

  <p
    style={{
      margin: "8px 0 0",
      color: "#52606d",
      lineHeight: "1.5",
    }}
  >
    The platform automatically prioritizes skills with larger
    gaps, so you can focus your learning on the areas that
    need the most improvement first.
  </p>
</div>
        </div>
      )}
    </div>
  );
}

  if (activePage === "roadmap") {
  const roadmapSkills = gapResults
    .filter((skill) => skill.gap > 0)
    .sort((a, b) => b.gap - a.gap);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <button
        className="back-btn"
        onClick={() => setActivePage("dashboard")}
      >
        ← Back to Dashboard
      </button>

      <h1>📚 Personalized Learning Roadmap</h1>

      <p>
        Your learning roadmap is generated from your Skill Gap Analysis.
      </p>

      <h3>
        Career Goal:{" "}
        {careerGoal || "Select a Career Goal first"}
      </h3>

      {roadmapSkills.length === 0 ? (
        <div
          style={{
            marginTop: "25px",
            padding: "20px",
            background: "#f8fafc",
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
          }}
        >
          <h3>📌 No Roadmap Available Yet</h3>

          <p style={{ color: "#52606d" }}>
            Select a career goal and analyze your skill gap first.
            Your personalized learning roadmap will appear here.
          </p>

          <button
            className="register-btn"
            onClick={() => setActivePage("gap")}
          >
            📊 Go to Skill Gap Analysis
          </button>
        </div>
      ) : (
        <div style={{ marginTop: "30px" }}>
          <h2>🎯 Recommended Learning Path</h2>

          {roadmapSkills.map((skill, index) => (
            <div
              key={skill.name}
              style={{
                marginBottom: "20px",
                padding: "20px",
                background: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <h3>
                Step {index + 1}: {skill.name}
              </h3>

              <p>
                <strong>Current Level:</strong>{" "}
                {skill.current}
              </p>

              <p>
                <strong>Target Level:</strong>{" "}
                {skill.required}
              </p>

              <p>
                <strong>Priority:</strong>{" "}
                {skill.priority === "High Priority"
                  ? "🔴 High Priority"
                  : "🟡 Needs Improvement"}
              </p>

              <p style={{ color: "#52606d" }}>
  Focus on improving your {skill.name} skills
  from {skill.current} to {skill.required}.
</p>

<div
  style={{
    marginTop: "12px",
    padding: "12px",
    background: "#f8fafc",
    borderRadius: "8px",
  }}
>
  <strong>📖 Recommended Action:</strong>

  <p style={{ margin: "6px 0 0", color: "#52606d" }}>
    Learn the fundamentals of {skill.name}, practice with
    small exercises, and build a mini project to strengthen
    your skills.
  </p>
</div>
            </div>
          ))}

          <div
            style={{
              marginTop: "25px",
              padding: "18px",
              background: "#f8fafc",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
            }}
          >
            <strong>💡 How this roadmap works</strong>

            <p
              style={{
                marginTop: "8px",
                color: "#52606d",
                lineHeight: "1.5",
              }}
            >
              The platform prioritizes the skills with the
              largest gaps first and creates a step-by-step
              learning path based on your target career.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

if (activePage === "support") {
  const studentsNeedingGuidance = students.filter((student) => {
    return student.skills?.some(
      (skill) => skill.level === "Beginner"
    );
  });

  const studentsOnTrack = students.filter((student) => {
    return (
      student.skills &&
      student.skills.length > 0 &&
      !student.skills.some(
        (skill) => skill.level === "Beginner"
      )
    );
  });

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      <button
        className="back-btn"
        onClick={() => {
          setTeacherSelectedStudent(null);
          setActivePage("dashboard");
        }}
      >
        ← Back to Dashboard
      </button>

      <h1>👨‍🏫 Teacher / Mentor Dashboard</h1>

      <p>
        Monitor student skills and identify students who may
        need additional academic and career guidance.
      </p>

      {/* DASHBOARD SUMMARY */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginTop: "30px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <h2>👥</h2>
          <h2>{students.length}</h2>
          <p>Total Students</p>
        </div>

        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <h2>⚠️</h2>
          <h2>{studentsNeedingGuidance.length}</h2>
          <p>Needs Support</p>
        </div>

        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <h2>🟢</h2>
          <h2>{studentsOnTrack.length}</h2>
          <p>Currently On Track</p>
        </div>
      </div>

      {/* STUDENT LIST */}
      <h2>👥 Student Monitoring</h2>

      {students.length === 0 ? (
        <p>No students registered yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Course</th>
              <th>Skill Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => {
              const beginnerSkills =
                student.skills?.filter(
                  (skill) => skill.level === "Beginner"
                ) || [];

              const needsSupport =
                beginnerSkills.length > 0;

              return (
                <tr key={student._id}>
                  <td>{student.name}</td>

                  <td>{student.course}</td>

                  <td>
                    {needsSupport ? (
                      <strong>
                        ⚠️ Needs Support
                      </strong>
                    ) : (
                      <strong>
                        🟢 On Track
                      </strong>
                    )}
                  </td>

                  <td>
                    <button
                      className="register-btn"
                      onClick={() => {
  setTeacherSelectedStudent(student);
  setMentorFeedback(student.mentorFeedback || "");
  setSupportStatus(
    student.supportStatus || "Needs Attention"
  );
}}
                    >
                      🔍 View Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* STUDENT DETAILS */}
      {teacherSelectedStudent && (
        <div
          style={{
            marginTop: "35px",
            padding: "25px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            maxWidth: "700px",
          }}
        >
          <h2>
            👨‍🎓 Student Details
          </h2>

          <p>
            <strong>Name:</strong>{" "}
            {teacherSelectedStudent.name}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {teacherSelectedStudent.email}
          </p>

          <p>
            <strong>Course:</strong>{" "}
            {teacherSelectedStudent.course}
            </p>
          <p>
  <strong>🎯 Career Goal:</strong>{" "}
  {teacherSelectedStudent.careerGoal || "Not selected"}
</p>

          <hr />

          <h3>📋 Skill Passport</h3>

          {teacherSelectedStudent.skills &&
          teacherSelectedStudent.skills.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Skill</th>
                  <th>Current Level</th>
                </tr>
              </thead>

              <tbody>
                {teacherSelectedStudent.skills.map(
                  (skill) => (
                    <tr key={skill.name}>
                      <td>{skill.name}</td>

                      <td>
                        {skill.level === "Beginner"
                          ? "⚠️ Beginner"
                          : skill.level ===
                            "Intermediate"
                          ? "🟡 Intermediate"
                          : "🟢 Advanced"}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          ) : (
            <p>
              No Skill Passport has been created
              for this student yet.
            </p>
          )}

          <hr />

          <h3>⚠️ Skills Requiring Attention</h3>

          {teacherSelectedStudent.skills?.filter(
            (skill) => skill.level === "Beginner"
          ).length > 0 ? (
            <ul>
              {teacherSelectedStudent.skills
                .filter(
                  (skill) => skill.level === "Beginner"
                )
                .map((skill) => (
                  <li key={skill.name}>
                    <strong>{skill.name}</strong>
                    {" — "}
                    Requires additional learning
                    and mentor guidance.
                  </li>
                ))}
            </ul>
          ) : (
            <p>
              ✅ No beginner-level skills detected.
            </p>
          )}
          <hr />

<h3>📝 Mentor Support</h3>

<label>
  <strong>Support Status:</strong>
</label>

<br />

<select
  value={supportStatus}
  onChange={(e) => setSupportStatus(e.target.value)}
  style={{
    padding: "10px",
    marginTop: "8px",
    marginBottom: "15px",
    width: "250px",
    fontWeight: "bold",
  }}
>
  <option value="Needs Attention">
    🔴 Needs Attention
  </option>

  <option value="In Progress">
    🟡 In Progress
  </option>

  <option value="Improving">
    🔵 Improving
  </option>

  <option value="On Track">
    🟢 On Track
  </option>
</select>

<br />

<label>
  <strong>Mentor Feedback:</strong>
</label>

<br />

<textarea
  value={mentorFeedback}
  onChange={(e) => setMentorFeedback(e.target.value)}
  placeholder="Enter mentor feedback..."
  rows="4"
  style={{
    width: "90%",
    maxWidth: "600px",
    padding: "10px",
    marginTop: "8px",
  }}
/>

<br />
<br />

<button
  className="register-btn"
  onClick={async () => {
    try {
      await axios.put(
        `http://localhost:5000/students/update/${teacherSelectedStudent._id}`,
        {
          mentorFeedback: mentorFeedback,
          supportStatus: supportStatus,
        }
      );

      setTeacherSelectedStudent({
        ...teacherSelectedStudent,
        mentorFeedback: mentorFeedback,
        supportStatus: supportStatus,
      });

      await fetchStudents();

      alert("Mentor Support Updated Successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update mentor support.");
    }
  }}
>
  💾 Save Mentor Support
</button>

          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <h3>💡 Mentor Recommendation</h3>

            <p>
              {teacherSelectedStudent.skills?.filter(
                (skill) => skill.level === "Beginner"
              ).length > 0
                ? "This student may benefit from mentor guidance, additional learning resources, and regular progress reviews."
                : "Continue monitoring the student's progress and encourage development toward their target career skills."}
            </p>
          </div>

          <br />

          <button
            className="back-btn"
            onClick={() =>
              setTeacherSelectedStudent(null)
            }
          >
            ← Close Student Details
          </button>
        </div>
      )}
    </div>
  );
  
}

if (activePage === "my-support") {
  if (!selectedStudent) {
    return (
      <div style={{ padding: "30px", fontFamily: "Arial" }}>
        <button
          className="back-btn"
          onClick={() => setActivePage("dashboard")}
        >
          ← Back to Dashboard
        </button>

        <h1>💬 My Support</h1>
        <p>Please select a student from the Skill Passport first.</p>
      </div>
    );
  }

  const beginnerSkills =
    selectedStudent.skills?.filter(
      (skill) => skill.level === "Beginner"
    ) || [];

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <button
        className="back-btn"
        onClick={() => setActivePage("dashboard")}
      >
        ← Back to Dashboard
      </button>

      <h1>💬 My Support</h1>

      <p>
        View your career goal, mentor feedback, and current support status.
      </p>

      <div
        style={{
          marginTop: "25px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          maxWidth: "700px",
        }}
      >
        <h2>🎯 Career Goal</h2>
        <p>
          {selectedStudent.careerGoal ||
            "Career goal has not been selected yet."}
        </p>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          maxWidth: "700px",
        }}
      >
        <h2>📊 Support Status</h2>
        <h3>
          {selectedStudent.supportStatus || "Needs Attention"}
        </h3>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          maxWidth: "700px",
        }}
      >
        <h2>⚠️ Skills Requiring Attention</h2>

        {beginnerSkills.length > 0 ? (
          <ul>
            {beginnerSkills.map((skill) => (
              <li key={skill.name}>{skill.name}</li>
            ))}
          </ul>
        ) : (
          <p>✅ No beginner-level skills currently detected.</p>
        )}
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          maxWidth: "700px",
        }}
      >
        <h2>📝 Mentor Feedback</h2>

        {selectedStudent.mentorFeedback ? (
          <p>{selectedStudent.mentorFeedback}</p>
        ) : (
          <p>No mentor feedback has been provided yet.</p>
        )}
      </div>
    </div>
  );
}
  return null;
}

export default App;