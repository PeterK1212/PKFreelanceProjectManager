import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

// Implement and test Admin View/Get projects method functionality (Jira FPM-22)
const AdminDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {

      try {
        const response = await axiosInstance.get('/api/admin/projects', {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
        });

        setProjects(response.data);
      } catch (error) {
        alert('Failed to fetch projects');
      }
    };

    fetchProjects();
  }, [user]);

  const handleDelete = async (projectId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this project?'
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axiosInstance.delete(`/api/admin/projects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
      });

      setProjects(
        projects.filter(
          (project) => project._id !== projectId
        )
      );
    } catch (error) {
      alert('Failed to delete project');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Admin Dashboard
      </h1>

      <h2 className="text-2xl font-semibold mb-4">
        All Projects
      </h2>

      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        projects.map((project) => (
          <div
            key={project._id}
            className="bg-gray-100 p-4 mb-4 rounded shadow"
          >
            <h3 className="text-xl font-bold">
              {project.title}
            </h3>

            <p>
              {project.description}
            </p>

            <p className="text-sm text-gray-600 mt-2">
              Client: {project.clientName}
            </p>

            <p className="text-sm text-gray-600">
              Budget: ${project.budget}
            </p>

            <p className="text-sm text-gray-600">
              Status: {project.status}
            </p>

            <p className="text-sm text-gray-600">
              Freelancer:
              {' '}
              {project.userId?.name}
              {' '}
              (
              {project.userId?.email}
              )
            </p>

            <button
              onClick={() => handleDelete(project._id)}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete Project
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminDashboard;