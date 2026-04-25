import { fetchJSON, renderProjects, PROJECTS_JSON_URL } from '../global.js';

const projects = (await fetchJSON(PROJECTS_JSON_URL)) ?? [];

const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');

const projectsTitleContainer = document.querySelector('.projects-title')
projectsTitleContainer.innerHTML = `${projects.length} Projects`