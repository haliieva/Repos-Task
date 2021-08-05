const searchBar = document.getElementById("search");
const section = document.getElementById('title_select');

const repositories = {
  reposData: []
};

// Function for displaying repositories
const displayRepositories = (repositories) => {
  const table = document.querySelector(".repos");
  const resRepos = repositories.map(defaultVal);
  const htmlString = repositories
      .map(createReposItem)
      .join("");
  table.innerHTML = htmlString;
};

// Search bar event
searchBar.addEventListener("keyup", (e) => {
  const data = searchByReposName(e.target.value, repositories.reposData);
  // console.log(data)
  displayRepositories(data);
})


//Functions for searching by repository name
function searchByReposName(name, data) {

  const searchString = name.toLowerCase();
  const filteredRepos = data.filter((repos) => {
    return repos.name.toLowerCase().includes(searchString);
  });
  return filteredRepos;
};

// Function for sorting
const sortRepos = (data) => {
  const selectedValue = document.getElementById("title_select").value;
  let sortedRepos = [];

  if (selectedValue == "A-Z") {
    sortedRepos = data.sort((a, b) => {
      const nameA = a.name.toLowerCase(),
          nameB = b.name.toLowerCase();

      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  } else if (selectedValue == "Z-A") {
    sortedRepos = data.reverse();
  }
  return sortedRepos;
};

// sort repositories event
section.addEventListener("change", () => {
  const data = sortRepos(repositories.reposData)
  displayRepositories(data);
});

// function for requesting repositories
const fetchAsyncRepos = async () => {
  const preloader = {
    preloaderEl: document.getElementById('preloader')
  }
  preloader.preloaderEl.classList.add('hidden');
  preloader.preloaderEl.classList.remove('visible');

  const GIT_HUB_API_URL = "https://api.github.com/users/jdsecurity/repos";
  try {
    const response = await fetch(GIT_HUB_API_URL);
    repositories.reposData = await response.json()
    return repositories.reposData;
    // displayRepositories(repositories.reposData);
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
  return repos;
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

fetchAsyncRepos().then((repositories) => {
  displayRepositories(repositories)
});