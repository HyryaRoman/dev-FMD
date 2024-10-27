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

      if (acc.price.max < current.price) {
        acc.price.max = current.price;
      }

      if (acc.price.min > current.price){
        acc.price.min = current.price;
      }

      if (acc.length.max < current.length) {
        acc.length.max = current.length;
      }

      if (acc.length.min > current.length){
        acc.length.min = current.length;
      }

      return acc;
    }, {
      category: [],
      rating: [],
      price: {
        min: Infinity,
        max: 0,
      },
      length: {
        min: Infinity,
        max: 0,
      },
    }
  );
}

function updateDisplayedMovies(movieList) {
  const movieTable = document.getElementById('movie-search-results');
  movieTable.innerHTML = movieList.reduce((html, movie) => html + `
    <tr>
      <td class="title">${movie.title}</td>
      <td class="category">${movie.category}</td>
      <td class="description">${movie.description}</td>
      <td class="length">${movie.length} m</td>
      <td class="rating">${movie.rating}</td>
      <td class="price">$${movie.price}</td>
    </tr>
  `, '');
}

function applyFilters(movieList) {
  const filterData = new FormData(document.getElementById('filters'));

  let result = movieList;

  const title = filterData.get('title');
  if (title) {
    result = result.filter((m) => m.title.toLowerCase().includes(title.toLowerCase()));
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

  const minLength = filterData.getAll('length-from');
  if (minLength) {
    result = result.filter((m) => m.length >= minLength);
  }

  const maxLength = filterData.getAll('length-to');
  if (maxLength) {
    result = result.filter((m) => m.length <= maxLength);
  }

  return result;
}

function showMovies(movieList) {
  const {
    category: categories,
    rating: ratings,
    price: price,
    length: length,
  } = uniqueValues(movieList);

  const categoryList = document.getElementById('category-list');
  categoryList.innerHTML = categories.reduce((html, category) =>
    html + `
      <li class="toggle primary">
        <input id="category-${category}" name="category" value="${category}" type="checkbox">
        <label for="category-${category}">${category}</label>
      </li>
    `, '');

  const ratingList = document.getElementById('rating-list');
  ratingList.innerHTML = ratings.reduce((html, rating) =>
    html + `
      <li class="toggle primary">
        <input id="category-${rating}" name="rating" value="${rating}" type="checkbox">
        <label for="category-${rating}">${rating}</label>
      </li>
    `, '');

  const priceFrom = document.getElementById('price-from');
  priceFrom.defaultValue = price.min;
  priceFrom.min = price.min;
  priceFrom.max = price.max;

  const priceTo = document.getElementById('price-to');
  priceTo.defaultValue = price.max;
  priceTo.min = price.min;
  priceTo.max = price.max;

  const lengthFrom = document.getElementById('length-from');
  lengthFrom.defaultValue = length.min;
  lengthFrom.min = length.min;
  lengthFrom.max = length.max;

  const lengthTo = document.getElementById('length-to');
  lengthTo.defaultValue = length.max;
  lengthTo.min = length.min;
  lengthTo.max = length.max;

  const filters = document.getElementById('filters');
  const onUpdate = () => updateDisplayedMovies(applyFilters(movieList));

  // The form data is reset AFTER the event was fired,
  // so we delay updating until a millisecond later
  filters.addEventListener("reset", () => setTimeout(onUpdate, 1));

  [...filters.querySelectorAll('input')].forEach((e) => {
    let update = onUpdate;

    // We need to ensure that 'from' value is smaller or equal to 'to' value
    switch (e) {
      case priceFrom:
        update = () => {
          priceTo.value = Math.max(priceTo.value, priceFrom.value);
          onUpdate();
        };
        break;

      case priceTo:
        update = () => {
          priceFrom.value = Math.min(priceFrom.value, priceTo.value);
          onUpdate();
        };
        break;

      case lengthFrom:
        update = () => {
          lengthTo.value = Math.max(lengthTo.value, lengthFrom.value);
          onUpdate();
        };
        break;

      case lengthTo:
        update = () => {
          lengthFrom.value = Math.min(lengthFrom.value, lengthTo.value);
          onUpdate();
        };
        break;

    }

    e.addEventListener("change", update);
    e.addEventListener("input", update);
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
