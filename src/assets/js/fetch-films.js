function uniqueValues(movieList) {
  return movieList.reduce(
    (acc, current) => {
      if (!acc.category.includes(current.category)) {
        acc.category.push(current.category);
        acc.category.sort();
      }

      if (!acc.rating.includes(current.rating)) {
        acc.rating.push(current.rating);
        // acc.rating.sort();
      }

      return acc;
    }, {
      category: [],
      rating: [],
    }
  );
}

function updateDisplayedMovies(movieList) {
  const movieTable = document.getElementById('movie-search-results');
  movieTable.innerHTML = movieList.reduce((html, movie) => html + `
    <tr>
      <td>${movie.title}</td>
      <td>${movie.category}</td>
      <td>${movie.description}</td>
      <td>${movie.length} m</td>
      <td>${movie.rating}</td>
      <td>$${movie.price}</td>
    </tr>
  `, '');
}

function applyFilters(movieList) {
  const filterData = new FormData(document.getElementById('filters'));

  let result = movieList;

  const title = filterData.get('title');
  if (title) {
    result = result.filter((m) => m.title.includes(title));
  }

  const categories = filterData.getAll('category');
  if (categories && categories.length > 0) {
    result = result.filter((m) => categories.includes(m.category));
  }

  const ratings = filterData.getAll('rating');
  if (ratings && ratings.length > 0) {
    result = result.filter((m) => ratings.includes(m.rating));
  }

  const minPrice = filterData.getAll('price-from');
  if (minPrice) {
    result = result.filter((m) => m.price >= minPrice);
  }

  const maxPrice = filterData.getAll('price-to');
  if (maxPrice) {
    result = result.filter((m) => m.price <= maxPrice);
  }

  return result;
}

function showMovies(movieList) {
  const {
    category: categories,
    rating: ratings
  } = uniqueValues(movieList);

  const categoryList = document.getElementById('category-list');
  categoryList.innerHTML = categories.reduce((html, category) =>
    html + `
      <label class="option togglebox">
        <span class="text">${category}</span>
        <input type="checkbox" name="category" value="${category}"/>
      </label>
    `, '');

  const ratingList = document.getElementById('rating-list');
  ratingList.innerHTML = ratings.reduce((html, rating) =>
    html + `
      <label class="option togglebox">
        <span class="text">${rating}</span>
        <input type="checkbox" name="rating" value="${rating}"/>
      </label>
    `, '');

  const filters = document.getElementById('filters');

  [...filters.querySelectorAll('input,button')].forEach((e) => {
    e.addEventListener("change", () => updateDisplayedMovies(applyFilters(movieList)))
    e.addEventListener("input", () => updateDisplayedMovies(applyFilters(movieList)))
  });

  updateDisplayedMovies(applyFilters(movieList));
}


function waitForDocument(v) {
  return new Promise((resolve, reject) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => resolve(v));
    }
    else {
      resolve(v);
    }
  });
}

function responseToJson(v) {
  return v.json();
}

function onFetchError(e) {
  console.error("Error:", e);
}

fetch('assets/samples/film_list.json')
  .then(responseToJson)
  .then(waitForDocument)
  .then(showMovies)
  .catch(onFetchError);