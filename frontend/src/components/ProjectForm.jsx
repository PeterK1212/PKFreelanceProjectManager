import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

// Frontend for user (freelance) project panel
// Implment and test Add/Create method functionality (Jira FPM-4)
// Implement and test View/Get method functionality (Jira FPM-10)
// Implement and test Update method functionality (Jira FPM-14)
// Implement and test Delete method functionality (Jira FPM-18)
const ProjectForm = ({ projects, setProjects, editingProject, setEditingProject }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ title: '', clientName: '', description: '', budget: '', status: 'Pending', deadline: '' });

  useEffect(() => {
    if (editingProject) {
      setFormData({
        title: editingProject.title,
        clientName: editingProject.clientName,
        description: editingProject.description,
        budget: editingProject.budget,
        status: editingProject.status,
        deadline: editingProject.deadline,
      });
    } else {
      setFormData({ title: '', clientName: '', description: '', budget: '', status: 'Pending', deadline: '' });
    }
  }, [editingProject]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        const response = await axiosInstance.put(`/api/projects/${editingProject._id}`, formData, {
            headers: { Authorization: `Bearer ${user.token}` },
        });
        setProjects(projects.map((project) => (project._id === response.data._id ? response.data : project)));
      } else {
        const response = await axiosInstance.post('/api/projects', formData, {
            headers: { Authorization: `Bearer ${user.token}` },
        });
        setProjects([...projects, response.data]);
      }
      setEditingProject(null);
      setFormData({ title: '', clientName: '', description: '', budget: '', status: 'Pending', deadline: '' });
    } catch (error) {
      alert('Failed to save project.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4"> {editingProject ? 'Edit Project' : 'Add Project'}</h1>
      <input
        type="text"
        placeholder="Project Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Client Name"
        value={formData.clientName}
        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />

      <input
        type="text"
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Budget"
        value={formData.budget}
        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <select
        value={formData.status}
        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        className="w-full mb-4 p-2 border rounded">
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
      <input
        type="date"
        value={formData.deadline}
        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingProject ? 'Update Project' : 'Add Project'}
      </button>
    </form>
  );
};

export default ProjectForm;