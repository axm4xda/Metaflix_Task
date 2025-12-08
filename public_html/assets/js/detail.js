const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

$.ajax({
  url: `https://api.tvmaze.com/shows/${movieId}`,
  method: "GET",
  success: function (movie) {
    $("#moviePoster").attr("src", movie.image?.original || movie.image?.medium);
    $("#movieTitle").text(movie.name);
    $("#movieYear").text(`Premiered: ${movie.premiered}`);
    $("#movieDescription").html(movie.summary);
    $("#movieGenre").text(`Genres: ${movie.genres.join(", ")}`);
    $("#movieRating").text(`Rating: ${movie.rating.average ?? "N/A"}`);
    $("#movieStatus").text(`Status: ${movie.status}`);
    $("#movieType").text(`Type: ${movie.type}`);
    $("#movieLanguage").text(`Language: ${movie.language}`);
    $("#movieRuntime").text(`Runtime: ${movie.runtime} min`);
    $("#movieAverageRuntime").text(`Average Runtime: ${movie.averageRuntime} min`);
    $("#movieNetwork").text(`Network: ${movie.network?.name ?? "N/A"}`);
    $("#movieCountry").text(
      `Country: ${movie.network?.country?.name ?? "Unknown"}`
    );
    $("#movieSchedule").text(
      `Air Time: ${movie.schedule.time} | Days: ${movie.schedule.days.join(", ")}`
    );
    if (movie.officialSite) {
      $("#movieOfficialSite").html(`
        <a href="${movie.officialSite}" target="_blank">Official Site</a>
      `);
    }
    if (movie.externals?.imdb) {
      $("#movieImdb").html(`
        <a href="https://www.imdb.com/title/${movie.externals.imdb}" target="_blank">
          IMDB Page
        </a>
      `);
    }

    if (movie._links?.previousepisode) {
      $("#movieLastEpisode").html(`
        <a href="${movie._links.previousepisode.href}" target="_blank">
          Last Episode: ${movie._links.previousepisode.name}
        </a>
      `);
    }
  },
  error: function () {
    alert("Məlumat tapılmadı!");
  }
});
