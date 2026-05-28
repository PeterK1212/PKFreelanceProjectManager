import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import ProjectForm from '../components/ProjectForm';
import ProjectList from '../components/ProjectList';
import { useAuth } from '../context/AuthContext';

// Frontend for user (freelance) project panel
// Implment and test Add/Create method functionality (Jira FPM-4)
const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get('/api/projects', {
            headers: { Authorization: `Bearer ${user.token}`, },
          });
        setProjects(response.data);
      } catch (error) {
        alert('Failed to fetch projects.');
      }
    };

    fetchProjects();
  }, [user]);

  return (

    <div className="container mx-auto p-6">
      <ProjectForm
        projects={projects}
        setProjects={setProjects}
        editingProject={editingProject}
        setEditingProject={setEditingProject}
      />

      <ProjectList projects={projects} setProjects={setProjects} setEditingProject={setEditingProject} />
    </div>
  );
};

export default Projects