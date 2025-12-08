const filmsContainer = document.getElementById("movies");
const loadMoreButton = document.getElementById("loadMore");
const SearchInput = document.getElementById("Search");
const notFound = document.getElementById("notFound");
const searchToggle = document.getElementById("searchToggle");
const searchInput = document.getElementById("Search");
const genreFilter = document.getElementById("genreFilter");

let filmsDatas = [];
let filteredFilms = [];
let count = 0;
let limit = 12;

loadMoreButton.addEventListener("click", function () {
  LoadMore();
});

fetch("https://api.tvmaze.com/shows")
  .then((res) => res.json())
  .then((data) => {
    filmsDatas = data;
    filteredFilms = data;
    loadGenres();
    LoadMore();
    loadGenresCustom();
  });

function LoadMore() {
  let filmsCount = filteredFilms.length;

  for (let index = count * limit; index < count * limit + limit; index++) {
    if (index < filmsCount) {
      let movie = filteredFilms[index];
      let img =
        movie.image?.medium ||
        "https://via.placeholder.com/300x450?text=No+Image";
      let genres = movie.genres?.join(", ") || "No genre";
      let rating = movie.rating?.average ?? "N/A";

      filmsContainer.innerHTML += `
        <div class="col-6 col-md-3">
          <a href="./Details.html?id=${movie.id}" style="text-decoration:none; color:inherit;">
            <div class="movie-card">
              <img src="${img}" class="w-75" style="border-radius:6px;">
              <h6 class="mt-2">${movie.name}</h6>
              <small class="text-secondary">${genres}</small>
              <hr>
              <p class="d-inline-flex align-items-center">${rating}</p>
              <i class="fa-solid fa-star ms-2 text-warning"></i>
            </div>
          </a>
        </div>`;
    } else {
      loadMoreButton.style.display = "none";
      break;
    }
  }

  count++;
}

SearchInput.addEventListener("input", function (e) {
  const searchText = e.target.value.toLowerCase().trim();

  if (searchText === "") {
    filteredFilms = filmsDatas;
  } else {
    filteredFilms = filmsDatas.filter((film) =>
      film.name.toLowerCase().includes(searchText)
    );
  }

  if (filteredFilms.length === 0) {
    filmsContainer.innerHTML = "";
    loadMoreButton.style.display = "none";
    notFound.classList.remove("d-none");
    return;
  }

  notFound.classList.add("d-none");
  loadMoreButton.style.display = "block";

  count = 0;
  filmsContainer.innerHTML = "";
  LoadMore();
});

searchToggle.addEventListener("click", () => {
  searchInput.classList.toggle("open");

  if (searchInput.classList.contains("open")) {
    searchInput.focus();
  } else {
    searchInput.value = "";
    searchInput.dispatchEvent(new Event("input"));
  }
});

searchInput.addEventListener("blur", () => {
  if (searchInput.value.trim() === "") {
    searchInput.classList.remove("open");
  }
});

function loadGenres() {
  let allGenres = new Set();

  filmsDatas.forEach((f) => {
    if (f.genres) {
      f.genres.forEach((g) => allGenres.add(g));
    }
  });

  allGenres.forEach((genre) => {
    genreFilter.innerHTML += `<option value="${genre}">${genre}</option>`;
  });
}

genreFilter.addEventListener("change", function () {
  const selected = genreFilter.value;

  if (selected === "all") {
    filteredFilms = filmsDatas;
  } else {
    filteredFilms = filmsDatas.filter((film) => film.genres.includes(selected));
  }

  const searchText = searchInput.value.toLowerCase().trim();
  if (searchText !== "") {
    filteredFilms = filteredFilms.filter((film) =>
      film.name.toLowerCase().includes(searchText)
    );
  }

  if (filteredFilms.length === 0) {
    filmsContainer.innerHTML = "";
    loadMoreButton.style.display = "none";
    notFound.classList.remove("d-none");
    return;
  }

  notFound.classList.add("d-none");
  loadMoreButton.style.display = "block";

  count = 0;
  filmsContainer.innerHTML = "";
  LoadMore();
});

const genreButtons = document.getElementById("genreButtons");

function loadGenresCustom() {
  let allGenres = new Set();

  filmsDatas.forEach(f => f.genres?.forEach(g => allGenres.add(g)));

  genreButtons.innerHTML = "";

  allGenres.forEach(genre => {
    genreButtons.innerHTML += `
      <button class="genre-btn" data-genre="${genre}">${genre}</button>
    `;
  });
}

const filterBtn = document.getElementById("filterBtn");
const filterPanel = document.getElementById("filterPanel");
const filterClose = document.getElementById("filterClose");
const overlay = document.getElementById("overlay");

filterBtn.addEventListener("click", () => {
  filterPanel.classList.add("open");
  overlay.classList.add("active");
});

filterClose.addEventListener("click", () => {
  filterPanel.classList.remove("open");
  overlay.classList.remove("active");
});

overlay.addEventListener("click", () => {
  filterPanel.classList.remove("open");
  overlay.classList.remove("active");
});

genreButtons.addEventListener("click", (e) => {
  if (!e.target.classList.contains("genre-btn")) return;

  const selected = e.target.dataset.genre;

  document.querySelectorAll(".genre-btn").forEach(btn =>
    btn.classList.remove("active")
  );

  e.target.classList.add("active");

  filteredFilms = filmsDatas.filter(f =>
    f.genres.includes(selected)
  );

  count = 0;
  filmsContainer.innerHTML = "";
  LoadMore();

  filterPanel.classList.remove("open");
  overlay.classList.remove("active");
});
