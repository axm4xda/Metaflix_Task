const filmsContainer = document.getElementById("movies");
const loadMoreButton = document.getElementById("loadMore");

loadMoreButton.addEventListener("click", function () {
    console.log("Daha çox yüklə klik olundu!");
    LoadMore();
});

let filmsDatas = [];
let count = 0;
let limit = 12;

fetch("https://api.tvmaze.com/shows")
  .then((res) => res.json())
  .then((data) => {
    filmsDatas = data;
    LoadMore();
  });

function LoadMore() {
  let filmsCount = filmsDatas.length;

  for (let index = count * limit; index < count * limit + limit; index++) {
    if (index < filmsCount) {
      let movie = filmsDatas[index];
      let img = movie.image?.medium || "https://via.placeholder.com/300x450?text=No+Image";
      let genres = movie.genres?.join(", ") || "No genre";

      filmsContainer.innerHTML += `
        <div class="col-6 col-md-3">
            <div class="movie-card">
                <img src="${img}" class="w-75" style="border-radius:6px;">
                <h6 class="mt-2">${movie.name}</h6>
                <small class="text-secondary">${genres}</small>
            </div>
        </div>
      `;
    } else {
      loadMoreButton.style.display = "none";
      break;
    }
  }

  count++;
}
