const searchBar = document.getElementById("search");
const repositories = {
  reposData: []
};

// Function for displaying repositories
const displayRepositories = (repositories) => {

  const table = document.querySelector(".repos");
  const htmlString = repositories
      .map(createReposItem)
      .join("");
  defaultVal(repositories);
  table.innerHTML = htmlString;
};

// Search bar event
searchBar.addEventListener("keyup", searchByReposName);

//Functions for searching by repository name
function searchByReposName(e) {
  const searchString = e.target.value.toLowerCase();
  const filteredRepos = repositories.reposData.filter((repos) => {
    return repos.name.toLowerCase().includes(searchString);
  });
  displayRepositories(filteredRepos);
};

// Function for sorting
const sortRepos = () => {
  const selectedValue = document.getElementById("title_select").value;
  let sortedRepos = "none";

  if (selectedValue == "A-Z") {
    sortedRepos = repositories.reposData.sort((a, b) => {
      const nameA = a.name.toLowerCase(),
          nameB = b.name.toLowerCase();

      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  } else if (selectedValue == "Z-A") {
    sortedRepos = repositories.reposData.reverse();
  }
  displayRepositories(sortedRepos);
};

// function for requesting repositories
const fetchAsyncRepos = async () => {
  let preloaderEl = document.getElementById('preloader');
  preloaderEl.classList.add('hidden');
  preloaderEl.classList.remove('visible');

  const GIT_HUB_API_URL = "https://api.github.com/users/jdsecurity/repos";
  try {
    const response = await fetch(GIT_HUB_API_URL);
    repositories.reposData = await response.json()

    displayRepositories(repositories.reposData);
  } catch (error) {
    console.error(error);
  }
};

// Function for default value for description and language
function defaultVal(repos) {
  if (repos.language === null) {
    repos.language = " - ";
  } else if (repos.description === null) {
    repos.description = " - ";
  }
};

//Function for creating repository item
function createReposItem(repos) {
  return `
    <tr class="repositories">
    <td> <a href="${repos.html_url}">${repos.name}</a></td>
    <td>${repos.language}</td>
    <td>${repos.description}</td>
    <td>${repos.created_at.split("T")[0]}</td>
    <td>${repos.pushed_at.split("T")[0]}</td>
    <td>${repos.updated_at.split("T")[0]}</td>
</tr>
    `;
};

fetchAsyncRepos();