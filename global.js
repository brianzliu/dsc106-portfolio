console.log("IT'S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}



// Site root URL (trailing slash). Derived from this script so it works on GitHub Pages
// for any repo name, and avoids broken relative fetches when the page URL has no
// trailing slash (e.g. /repo-name vs /repo-name/).
const BASE_PATH = new URL('./', import.meta.url).href;

// JSON is always next to this file at lib/projects.json; do not use page-relative paths.
export const PROJECTS_JSON_URL = new URL('lib/projects.json', import.meta.url).href;

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'resume/', title: 'Resume' },
    { url: 'https://github.com/brianzliu', title: 'Profile' }
]

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  if (!url.startsWith('http')) {
    url = new URL(url, BASE_PATH).href;
  }

  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;

  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add('current');
  }

  if (a.host !== location.host) {
    a.target="_blank"
  }

  nav.append(a);
}

// Add light mode/dark mode switcher
document.body.insertAdjacentHTML(
  'afterbegin',
  `
  <label class="color-scheme">
    Theme:
    <select>
      <option>Automatic</option>
      <option>Light</option>
      <option>Dark</option>
    </select>
  </label>`,
);

let select = document.querySelector("select")

select.addEventListener('input', function (event) {
  console.log('color scheme changed to', event.target.value);
  document.documentElement.style.setProperty('color-scheme', event.target.value);
  localStorage.colorScheme = event.target.value
});

if ("colorScheme" in localStorage) {
  document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
  select.value = localStorage.colorScheme;
}



  
// dynamically change project data content from JSON
export async function fetchJSON(url, init) {
  try {
    const response = await fetch(url, init);

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    const data = await response.json();
    return data;  

  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  containerElement.innerHTML = '';

  for (const project of projects) {
    const article = document.createElement('article');

    article.innerHTML = `
      <${headingLevel}>${project.title}</${headingLevel}>
      <img src="${project.image}" alt="${project.title}">
      <p>${project.description}</p>
    `;

    containerElement.appendChild(article);
  }
}

export function fetchGithubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`, {
    headers: { Accept: 'application/vnd.github+json' },
  });
}


