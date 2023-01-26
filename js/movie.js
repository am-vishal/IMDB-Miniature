const title = document.getElementById("title");
title.innerHTML = localStorage.getItem("_moviename");
const year = document.getElementById("year");
const runtime = document.getElementById("runtime");
const rating = document.getElementById("rating");
const poster = document.getElementById("poster");
const plot = document.getElementById("plot");
const directorsName = document.getElementById("director-names");
const castName = document.getElementById("cast-names");
const genre = document.getElementById("genre");

window.onload = function () {
  // call the fetchMovies function and pass the movie title
  fetchMovies(title.innerHTML);
};

async function fetchMovies(search) {
  // create the url with the movie title and API key
  const url = `https://www.omdbapi.com/?t=${search}&apikey=82dea6ea`;
  try {
    // fetch the data
    const response = await fetch(url);
    const data = await response.json();
    // check if the response is true
    if (data.Response === "True") {
      // update the HTML elements with the data
      year.innerHTML;
      year.innerHTML = data.Year;
      runtime.innerHTML = data.Runtime;
      rating.innerHTML = `${data.imdbRating}/10`;
      poster.setAttribute("src", data.Poster);
      plot.innerHTML = data.Plot;
      directorsName.innerHTML = data.Director;
      castName.innerHTML = data.Actors;
      genre.innerHTML = data.Genre;
    } else {
      // if the response is false, log the error message
      console.log(data.Error);
    }
  } catch (err) {
    // if there is an error, log the error message
    console.log("Fetch Error :-S", err);
  }
}
