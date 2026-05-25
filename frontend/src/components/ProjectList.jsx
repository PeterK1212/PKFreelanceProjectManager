import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ProjectList = ({ projects, setProjects, setEditingProject }) => {
  const { user } = useAuth();

  const handleDelete = async (projectId) => {
    try {
      await axiosInstance.delete(`/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${user.token}`, },
      });
      setProjects(projects.filter((project) => project._id !== projectId));
    } catch (error) {
      alert('Failed to delete project.');
    }
  };

  return (
    <div>
      {projects.map((project) => (
        <div key={project._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold text-xl">{project.title}</h2>
          <p><strong>Client:</strong>{' '}{project.clientName}</p>
          <p><strong>Description:</strong>{' '}{project.description}</p>
          <p><strong>Budget:</strong>{' '}${project.budget}</p>
          <p><strong>Status:</strong>{' '}{project.status}</p>
          <p className="text-sm text-gray-500">Deadline:{' '}{new Date(project.deadline).toLocaleDateString()}</p>
          <div className="mt-2">
            <button
              onClick={() => setEditingProject(project)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(project._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;