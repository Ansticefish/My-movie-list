// variables
const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = []
let filteredMovies = []
const MOVIES_PER_PAGE = 12

const dataPanel = document.querySelector('#data-panel')
const paginator = document.querySelector('#paginator')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

// function
function renderMovieList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML += `<div class="col-sm-3">
      <div class="mb-2">
        <div class="card">
          <img
            src="${POSTER_URL + item.image}"
            class="card-img-top" alt="Movie Poster">
          <div class ="card-body">
          <h5 class ="card-title">${item.title}</h5>
          </div>
          <div class ="card-footer">
          <div class ="card-body">
          <button class ="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
          <button class ="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
          </div>
          </div>
        </div>
      </div>
    </div>
    </div >`
  })

  dataPanel.innerHTML = rawHTML
}

function getMovieByPage (page) {
  const startIndex = (page - 1)*MOVIES_PER_PAGE
  
  const data = filteredMovies.length ? filteredMovies : movies
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

function renderPaginator (amount){
  const totalPages = Math.ceil(amount/MOVIES_PER_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= totalPages; page++ ){
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }

  paginator.innerHTML = rawHTML
}

function showMovieModal (id){
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  modalTitle.innerText = ''
  modalDate.innerText = ''
  modalDescription.innerText = ''
  modalImage.innerHTML = ''

  axios.get(INDEX_URL + id)
    .then ((response)=>{
      const data = response.data.results
      modalTitle.innerText = data.title
      modalDate.innerText = 'Release date: ' + data.release_date
      modalDescription.innerText = data.description 
      modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie poster" class="img-fluid">
      `
    })
}

function addToFavorite (id){
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie)=> movie.id === id)
  if (list.some((movie)=> movie.id === id)){
    console.log(list)
    return alert('The movie is already your favorite movie!')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}


// DOM Event
// listen to dataPanel
dataPanel.addEventListener('click', function onPanelClicked (event){
  const target = event.target
  const id = Number(target.dataset.id)
  if (target.matches('.btn-show-movie')){
    showMovieModal(id)
  } else if (target.matches('.btn-add-favorite')){
    addToFavorite(id)
  }
})


// listen to searchForm
searchForm.addEventListener(('submit'), function onSearchFormSubmitted(event){
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  
  filteredMovies = movies.filter((movie)=>movie.title.toLowerCase().includes(keyword))
   
  if (!filteredMovies.length){
    return alert('We cannot find any movie that matches the keyword. Please enter another keyword!')
  }

  // solution 2
  // const filteredMovies = []
  // for (const movie of movies){
  //   if (movie.title.toLowerCase().includes(keyword)){
  //     filteredMovies.push(movie)
  //   }
  // }

  renderPaginator(filteredMovies.length)
  renderMovieList(getMovieByPage(1))
})


// listen to searchInput : render movies once there is an input
searchInput.addEventListener(('input'), function onInputed(event) {

  const searchInputValue = searchInput.value.trim().toLowerCase()
  let keyword = ''
  const inputValue = event.data
   

  if (inputValue === 'null'){
    keyword = searchInputValue.slice(0, searchInputValue.length-2)
  } else {
    keyword = searchInputValue
  } 

  const inputMovies = movies.filter((movie) => movie.title.toLowerCase().includes(keyword))

  if (!inputMovies.length) {
    return alert('We cannot find any movie that matches the keyword. Please enter another keyword!')
  }
  
  renderMovieList(inputMovies)
})

// listen to paginator
paginator.addEventListener('click', function onPaginatorClicked (event){
  const target = event.target
  if (target.tagName !== 'A') return
  
  const page = Number(target.dataset.page)
  renderMovieList(getMovieByPage(page))
})

// add movies to dataPanel
axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results)
    renderPaginator(movies.length)
    renderMovieList(getMovieByPage(1))
  })
  .catch((err) => console.log(err))


