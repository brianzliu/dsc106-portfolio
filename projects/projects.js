import { fetchJSON, renderProjects, PROJECTS_JSON_URL } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = (await fetchJSON(PROJECTS_JSON_URL)) ?? [];

const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');

const projectsTitleContainer = document.querySelector('.projects-title')
projectsTitleContainer.innerHTML = `${projects.length} Projects`

let query = '';
let selectedYear = '';

function renderPieChart(projectsGiven) {
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );
  let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  let sliceGenerator = d3.pie().value((d) => d.value);
  let arcData = sliceGenerator(newData);
  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let arcs = arcData.map((d) => arcGenerator(d));
  let colors = d3.scaleOrdinal(d3.schemeTableau10);

  let svg = d3.select('svg');
  svg.selectAll('path').remove();
  let legend = d3.select('.legend');
  legend.selectAll('li').remove();

  function handleSelection(year) {
    selectedYear = selectedYear === year ? '' : year;
    svg
      .selectAll('path')
      .attr('class', (_, idx) => (
        newData[idx].label === selectedYear ? 'selected' : ''
      ));
    legend
      .selectAll('li')
      .attr('class', (_, idx) => (
        newData[idx].label === selectedYear ? 'selected' : ''
      ));
    filterAndRenderProjects();
  }

  arcs.forEach((arc, i) => {
    svg
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(i))
      .attr('class', () => (newData[i].label === selectedYear ? 'selected' : ''))
      .style('cursor', 'pointer')
      .on('click', () => handleSelection(newData[i].label));
  });

  newData.forEach((d, idx) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(idx)}`)
      .attr('class', () => (d.label === selectedYear ? 'selected' : ''))
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .style('cursor', 'pointer')
      .on('click', () => handleSelection(d.label));
  });
}

function filterAndRenderProjects() {
  let filteredProjects = projects.filter((project) => {
    let matchesQuery = true;
    if (query) {
        let values = Object.values(project).join('\n').toLowerCase();
        matchesQuery = values.includes(query.toLowerCase());
    }
    let matchesYear = true;
    if (selectedYear) {
        matchesYear = project.year === selectedYear;
    }
    return matchesQuery && matchesYear;
  });

  renderProjects(filteredProjects, projectsContainer, 'h2');
  projectsTitleContainer.innerHTML = `${filteredProjects.length} Projects`;
}


renderPieChart(projects);
filterAndRenderProjects();

let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => { 
  query = event.target.value;
  let filteredByQuery = projects.filter((project) => {
      let values = Object.values(project).join('\n').toLowerCase();
      return values.includes(query.toLowerCase());
  });

  renderPieChart(filteredByQuery);
  filterAndRenderProjects();
});
