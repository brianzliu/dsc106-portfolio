import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');

const projectsTitleContainer = document.querySelector('.projects-title')
projectsTitleContainer.innerHTML = `${projects.length} Projects`