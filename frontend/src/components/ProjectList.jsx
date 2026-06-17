import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { decorateProject } from '../decorators';

// Frontend for user (freelance) project panel
// Implment and test Add/Create method functionality (Jira FPM-4)
// Implement and test View/Get method functionality (Jira FPM-10)
// Implement and test Update method functionality (Jira FPM-14)
// Implement and test Delete method functionality (Jira FPM-18)
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
      {projects.map((project) => {
        // Decorator pattern: enrich the project with computed display fields
        // (isOverdue, budgetLevel) without changing the stored project.
        const decorated = decorateProject(project);

        return (
        <div key={project._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold text-xl">{project.title}</h2>
          <div className="flex gap-2 my-2">
            <span className="bg-blue-200 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
              {decorated.budgetLevel} budget
            </span>
            {decorated.isOverdue && (
              <span className="bg-red-200 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                Overdue
              </span>
            )}
          </div>
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
        );
      })}
    </div>
  );
};

export default ProjectList;