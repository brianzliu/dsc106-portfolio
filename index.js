import { fetchJSON, renderProjects, fetchGithubData } from './global.js';


// dynamically rendering 3 latest projects
const projects = await fetchJSON('./lib/projects.json');
const latestProjects = projects.slice(0, 3);

const projectsContainer = document.querySelector('.projects');

renderProjects(latestProjects, projectsContainer, 'h2');


// github profile stats
const profileStats = document.querySelector('#profile-stats');

const githubData = await fetchGithubData('brianzliu');

if (profileStats) {
    const stats = [
        { label: 'Public Repos', value: githubData.public_repos },
        { label: 'Public Gists', value: githubData.public_gists },
        { label: 'Followers',    value: githubData.followers },
        { label: 'Following',    value: githubData.following },
    ];
    profileStats.innerHTML = stats.map(s => `
        <div class="stat">
            <span class="stat-value">${s.value}</span>
            <span class="stat-label">${s.label}</span>
        </div>
    `).join('');
}
  