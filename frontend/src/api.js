const API_URL = "http://localhost:4000";

// Bug 4: API errors were handled silently.
// How to fix: Added error handling.
async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

// Feature: Support searching projects by client name.
export function getProjects(clientName = "") {
  const query = clientName
    ? `?client=${encodeURIComponent(clientName)}`
    : "";

  return request(`/api/projects${query}`);
}

export function getClients() {
  return request("/api/clients");
}

export function createProject(data) {
  return request("/api/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateStatus(id, status) {
  return request(`/api/projects/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
