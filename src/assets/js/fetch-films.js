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

function showMovies(movieList) {
  const { category: categories, rating: ratings} = uniqueValues(movieList);

  const categoryList = document.getElementById('category-list');
  categories.forEach((c) => {
    categoryList.innerHTML+=`
      <label>
        <input type="checkbox" name="category-filter" value="${c}"/>
        ${c}
      </label>
    `;
  });

  const ratingList = document.getElementById('rating-list');
  ratings.forEach((c) => {
    ratingList.innerHTML+=`
      <label>
        <input type="checkbox" name="category-filter" value="${c}"/>
        ${c}
      </label>
    `;
  });
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
