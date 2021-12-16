// Variables
const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies'))

const dataPanel = document.querySelector('#data-panel')


//Function
function renderFavoriteList (data){
 let rawHTML = ''

 data.forEach((item)=>{
   rawHTML += `
   <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src=${POSTER_URL + item.image}
              class="card-img-top" alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
              <a href="#" class="btn btn-primary btn-more-info" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</a>
              <a href="#" class="btn btn-danger btn-delete" data-id="${item.id}">x</a>
            </div>
          </div>
        </div>
      </div>
 `
 
 })
 
  dataPanel.innerHTML = rawHTML
} 


function showFavorite (id){
  const movieTitle = document.querySelector('#movie-modal-title')
  const movieImage = document.querySelector('#movie-modal-image')
  const movieDate = document.querySelector('#movie-modal-date')
  const movieDescription = document.querySelector('#movie-modal-description')

  movieTitle.innerHTML = ''
  movieImage.src = ''
  movieDate.innerHTML = ''
  movieDescription.innerHTML = ''

  const modalMovie = favoriteMovies.find((movie)=>movie.id === id)

  movieTitle.innerHTML = modalMovie.title
  movieImage.src = POSTER_URL + modalMovie.image
  movieDate.innerHTML = 'Release Date: ' + modalMovie.release_date
  movieDescription.innerHTML = modalMovie.description


}

function deleteFavorite (id) {
  if (!favoriteMovies || !favoriteMovies.length) return

  const deletedIndex = favoriteMovies.findIndex((movie)=> movie.id === id)
  if (deletedIndex === -1) return
  
  favoriteMovies.splice(deletedIndex, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies))

  renderFavoriteList(favoriteMovies)

}


// DOM Events
// listen to more btn
dataPanel.addEventListener('click', function onMoreBtnClicked(event){
  const target = event.target
  const id = Number(target.dataset.id)
  if (target.matches('.btn-more-info')){
    showFavorite(id)
  } else if (target.matches('.btn-delete')){
    deleteFavorite(id)
  }
})


// Main code
renderFavoriteList(favoriteMovies)