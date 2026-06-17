import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import ProjectForm from '../components/ProjectForm';
import ProjectList from '../components/ProjectList';
import { useAuth } from '../context/AuthContext';
import { sortStrategies, sortOptions } from '../strategies';

// Frontend for user (freelance) project panel
// Implment and test Add/Create method functionality (Jira FPM-4)
// Implement and test View/Get method functionality (Jira FPM-10)
// Implement and test Update method functionality (Jira FPM-14)
// Implement and test Delete method functionality (Jira FPM-18)
const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [sortBy, setSortBy] = useState('');

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

  // Strategy pattern: pick the sort algorithm at runtime based on the
  // dropdown selection. With no selection, projects are shown unsorted.
  const strategy = sortStrategies[sortBy];
  const displayedProjects = strategy ? strategy.sort(projects) : projects;

  return (

    <div className="container mx-auto p-6">
      <ProjectForm
        projects={projects}
        setProjects={setProjects}
        editingProject={editingProject}
        setEditingProject={setEditingProject}
      />

      <div className="mb-4">
        <label htmlFor="sortBy" className="mr-2 font-semibold">Sort by:</label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded p-2"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <ProjectList projects={displayedProjects} setProjects={setProjects} setEditingProject={setEditingProject} />
    </div>
  );
};

export default Projects