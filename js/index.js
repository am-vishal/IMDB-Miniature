const searchInput = document.getElementById("search");
const resultsContainer = document.getElementById("card-container");
const favMoviesContainer = document.getElementById("fav-movies-container");
const emptySearchText = document.getElementById("empty-search-text");
const showFavorites = document.getElementById("favorites-section");
const favPara = document.getElementById("fav-para");

addToFavDOM();
showemptySearchText();
let suggestionList = [];
let listOfFavMovies = [];

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
}

function openNav() {
  document.getElementById("mySidebar").style.width = "375px";
  document.getElementById("main").style.marginLeft = "375px";
  document.getElementById("mySidebar").style.display = "block";
}

window.onload = function () {
  document.getElementById("mySidebar").style.display = "none";
};

function isValid(value) {
  if (value === undefined || value === null || value === " " || value === NaN) {
    return "";
  }
  return value;
}

function showemptySearchText() {
  if (favMoviesContainer.innerHTML == "") {
    favPara.style.display = "block";
  } else {
    favPara.style.display = "none";
  }
}

// Event listner on search
searchInput.addEventListener("keyup", function () {
  let search = searchInput.value;
  if (search === "") {
    emptySearchText.style.display = "block";
    resultsContainer.innerHTML = "";
    // clears the previous movies from array
    suggestionList = [];
  } else {
    emptySearchText.style.display = "none";
    (async () => {
      let data = await fetchMovies(search);
      addToResultContainerDOM(data);
    })();
    resultsContainer.style.display = "grid";
  }
});

// Fetches data from api and calls function to add it in
async function fetchMovies(search) {
  const url = `https://www.omdbapi.com/?t=${search}&apikey=82dea6ea`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.warn(err);
  }
}

function addToResultContainerDOM(data) {
  document.getElementById("fav-para").style.display = "none";
  let isPresent = false;

  // to check if the movie is already present in the suggestionList array
  suggestionList.forEach((movie) => {
    if (movie.Title == data.Title) {
      isPresent = true;
    }
  });

  if (!isPresent && data.Title != undefined) {
    suggestionList.push(data);
    const movieCard = document.createElement("div");
    movieCard.setAttribute("class", "text-decoration");
    const getFav = JSON.parse(localStorage.getItem("favMovList"));
    movieCard.innerHTML = `
        <div class="card my-2" data-id = " ${data.Title} ">
        <a href="movie.html" >
          <img
            src="${data.Poster} "
            class="card-img-top"
            alt="Poster"
            onerror="this.src='./images/No_Image_Available.jpg'"
            data-id = "${data.Title} "
            height="220px"
            width="100%"
            style="object-fit:cover"
          />
          <div class="card-body text-start">
            <h5 class="card-title" >
              <a href="movie.html" data-id = "${data.Title} "> ${data.Title.length < 25 ? isValid(data.Title) : data.Title.slice(0, 25) + "..."}  </a>
            </h5>
            <p class="card-text">
              <i class="fa fa-star" aria-hidden="true"></i>
                <span id="rating">&nbsp;${isValid(data.imdbRating)}</span>
              </i>
              <button class="fav-btn">
              <i class="fa-regular fa-heart add-fav" data-id="${isValid(data.Title)}"></i>
              </button>
            </p>
          </div>
        </a>
      </div>
    `;
    resultsContainer.prepend(movieCard);
  }
}

// Add to favourite of localStorage
async function handleFavBtn(e) {
  const target = e.target;
  let data = await fetchMovies(target.dataset.id);
  let getFavMovList = localStorage.getItem("favMovList");
  if (getFavMovList) {
    listOfFavMovies = Array.from(JSON.parse(getFavMovList));
  } else {
    localStorage.setItem("favMovList", JSON.stringify(data));
  }

  // to check if movie is already present in the fav list
  let isPresent = false;
  listOfFavMovies.forEach((movie) => {
    if (data.Title == movie.Title) {
      window.alert("Movie already added to fav");
      isPresent = true;
    }
  });

  if (!isPresent) {
    listOfFavMovies.push(data);
  }

  localStorage.setItem("favMovList", JSON.stringify(listOfFavMovies));
  isPresent = !isPresent;
  addToFavDOM();
}

// Add to favourite list DOM
function addToFavDOM() {
  favMoviesContainer.innerHTML = "";
  let favList = JSON.parse(localStorage.getItem("favMovList"));
  if (favList) {
    favList.forEach((movie) => {
      const div = document.createElement("div");
      div.classList.add("fav-movie-card", "d-flex", "justify-content-between", "align-content-center", "my-2");
      div.innerHTML = `
    <img
      src="${movie.Poster}"
      alt=""
      onerror="this.src='./images/No_Image_Available.jpg'"
      class="fav-movie-poster"
    />
    <div class="movie-card-details position-relative">
      <p class="movie-name mb-0">
       <a href = "movie.html" class="fav-movie-name" data-id="${movie.Title}">${movie.Title.length < 14 ? movie.Title : movie.Title.slice(0, 14) + "..."}<a> 
       </p>
       <p class="position-absolute bottom-0">${movie.Year}</p>
    </div>
    <div class="delete-btn my-4">
        <i class="fa-solid fa-trash-can" data-id="${movie.Title}"></i>
    </div>
    `;
      favMoviesContainer.prepend(div);
    });
  }
}

// Delete from favourite list
function deleteMovie(name) {
  let favList = JSON.parse(localStorage.getItem("favMovList"));
  let updatedList = Array.from(favList).filter((movie) => {
    return movie.Title != name;
  });
  localStorage.setItem("favMovList", JSON.stringify(updatedList));
  addToFavDOM();
  showemptySearchText();
}

// Handles click events
async function handleClickListner(e) {
  const target = e.target;
  if (target.classList.contains("add-fav")) {
    e.preventDefault();
    handleFavBtn(e);
  } else if (target.classList.contains("fa-trash-can")) {
    deleteMovie(target.dataset.id);
  }

  localStorage.setItem("_moviename", target.dataset.id);
}

// Event listner on whole document
document.addEventListener("click", handleClickListner);
