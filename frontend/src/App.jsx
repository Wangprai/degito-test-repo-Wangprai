import { useEffect, useState } from "react";
import { getProjects, getClients, createProject, updateStatus } from "./api";

const STATUS_OPTIONS = ["planning", "in_progress", "completed"];

export default function App() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [newProject, setNewProject] = useState({ name: "", client_id: "" });
  // Feature: Search projects by client name.
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProjects();
    fetchClients();
  }, []);

  useEffect(() => {
    getProjects(search).then(setProjects);
  }, [search]);

  function fetchProjects() {
    getProjects().then(setProjects);
  }

  function fetchClients() {
    getClients().then(setClients);
  }

  // Bug 1: Status change not updated.
  // How to fixed: using map() for create a new array before update project state.
  function handleStatusChange(projectId, newStatus) {
    updateStatus(projectId, newStatus).then(() => {
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId
            ? { ...project, status: newStatus }
            : project,
        ),
      );
    });
  }

  // Bug 4: API errors not show to users.
  // How to fix: toast notifications to display API error messages.
  function handleCreate(e) {
    e.preventDefault();
    createProject({
      name: newProject.name,
      client_id: Number(newProject.client_id),
    })
      .then(() => {
        setNewProject({ name: "", client_id: "" });
        fetchProjects();
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Client Project Tracker</h1>
        <p>Internal tool for tracking active client projects.</p>
      </header>

      <section className="new-project">
        <h2>Add Project</h2>
        <form onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Project name"
            value={newProject.name}
            onChange={(e) =>
              setNewProject({ ...newProject, name: e.target.value })
            }
          />
          <select
            value={newProject.client_id}
            onChange={(e) =>
              setNewProject({ ...newProject, client_id: e.target.value })
            }
          >
            <option value="">Select client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button type="submit">Add</button>
        </form>
        {/* Feature: Search projects by client name Input. */}
        <input
          type="text"
          placeholder="Search by client name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginTop: "16px" }}
        />
      </section>

      <section className="project-list">
        <h2>Projects</h2>
        <table>
          <thead>
            <tr>
              <th>Project</th>
              <th>Client</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.client_name}</td>
                <td>
                  <span className="status-badge">{p.status}</span>
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) {
                        handleStatusChange(p.id, e.target.value);
                      }
                      e.target.value = "";
                    }}
                  >
                    <option value="">Change status…</option>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
