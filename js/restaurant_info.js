let restaurant;
var map;
//add service worker registration here
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  const id = getParameterByName('id');
  DBHelper.fetchRestaurantById(id, (error, restaurant) => {
    self.restaurant = restaurant;
    if (!restaurant) {
      console.error(error);
      return;
    }
    self.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      center: self.restaurant.latlng,
      scrollwheel: false
    });
    DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
  });
}

/**
 * Get current restaurant from page URL.
 */
const fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) {
    // restaurant already fetched!
   callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
      callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.log('no restataurnt fillRest callback getReviewsByID');
        console.error(error);
        return;
      }
      fillBreadcrumb(restaurant);
      fillRestaurantHTML(restaurant);
      callback(null, restaurant)
      getReviewsByID(restaurant);

    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
const fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;
  console.log(name);

  const favBTN = document.getElementById('favorite-btn');
  let favStatus = self.restaurant.is_favorite;
  //console.log(`The Favorite status:${favStatus}`);
  favBTN.innerHTML = (favStatus === 'true' ? 'Favorite' : 'Not Favorite');

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;
  console.log('address: ' + address);

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img'
  image.src = DBHelper.imageUrlForRestaurant(restaurant);

  const viewportMap = [{
      media: '(max-width: 320px)',
      suffix: '_280.jpg',
      size: '280w',
      slot: '280px'
    },
    {
      media: '(min-width: 375px)',
      suffix: '_385.jpg',
      size: '385w',
      slot: '385px'
    },
    {
      media: '((min-width: 425px) and (max-width: 767px))',
      suffix: '_640.jpg',
      size: '640w',
      slot: ''
    },
    {
      media: '(min-width: 425px)',
      suffix: '_640.jpg',
      size: '640w',
      slot: '432px'
    }
  ];

  DBHelper.generateSrcset(restaurant, viewportMap, image);

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
const fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');

  const caption = document.createElement('caption');
  caption.innerHTML = `${self.restaurant.name}'s Hours of Operation`;
  hours.appendChild(caption)


  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);
    hours.appendChild(row);
    console.log('----key in operatingHours!---------');
  }


}
/**
 * Get all the reviews of a given restaurant
 */
const getReviewsByID = (restaurant = self.restaurant) => {
  DBHelper.getReviewsByID(restaurant.id, (err, reviews) => {
    //console.log(`Reviews for restaurant ${restaurant.id} `, reviews);
    fillReviewsHTML(reviews)
  })
}


/**
 * Create all reviews HTML and add them to the webpage.
 */
 const fillReviewsHTML = (reviews = getReviewsByID(self.restaurant))=>{
  // console.log(reviews);
   const container = document.getElementById('reviews-container');

   if (!reviews) {
     const noReviews = document.createElement('p');
     noReviews.innerHTML = 'No posted reviews!';
     container.appendChild(noReviews);
     return;
   }
   const ul = document.getElementById('reviews-list');
   reviews.forEach(review => {
     ul.appendChild(createReviewHTML(review));
   });
   container.appendChild(ul);
 }

/**
 * Create review HTML and add it to the webpage.
 */
const createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.innerHTML = `Reviewer name: ${review.name}`;

  li.setAttribute('role', 'listitem');
  li.appendChild(name);


    const date = document.createElement('p');
    date.innerHTML = dateTimeFromTimestamp(review.updatedAt);
    li.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
}
//Convert TimeStamp format
const dateTimeFromTimestamp = (timeStamp) => {
  let dT = new Date(timeStamp);
  return dT.getDate() + '-' + (dT.getMonth() + 1) + '-' + dT.getFullYear() + ' ' + dT.getHours() + ':' + dT.getMinutes();
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
const fillBreadcrumb = (restaurant = self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
  //console.log('fillBreadcrumb fn called!!!!');
}

/**
 * Get a parameter by name from page URL.
 */
const getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
 * Add a new review from form
 */
function addReview() {
  const form = document.getElementById('add-review-form');
  let reviewData = {
    restaurant_id: self.restaurant.id,
    name: document.getElementById('reviewerName').value,
    rating: document.getElementById('restaurantRating').value,
    comments: document.getElementById('reviewComment').value
  };
  form.reset();

  if(navigator.onLine){
    DBHelper.postReview(reviewData);
    document.getElementById('reviews-list').innerHTML = '';
    getReviewsByID(restaurant = self.restaurant);
  } else {
    //lets save this data offline to be posted
    //the next time we connect
    reviewData.createdAt = Date.now();
    reviewData.updatedAt = reviewData.createdAt;
    reviewData.id = reviewData.createdAt;
    DBHelper.addReviewsOfflineToDatabase(reviewData);
    let review = [reviewData];
    fillReviewsHTML(review);//works
  }
  console.log(reviewData);
}

/**
 * When we get online, get reviews from IDB and POST them
 * https://medium.com/@MateMarschalko/online-and-offline-events-with-javascript-d424bec8f43
 */
window.addEventListener("online", function(event){
  DBHelper.getOfflineReviewsFromCache().then(reviewsOffline => {
    if (!reviewsOffline || reviewsOffline.length == 0 ) { return; }
    reviewsOffline.forEach(review => {
      DBHelper.postReview(review);
    //  console.log(review);
      //Delete from IDB
      DBHelper.deleteOffRevDatabase(review.id);
    });
  }).catch(error => {
    console.log(error);
  })
});

 /**
 * Toggle restaurant favorite
 */
window.toggleRestaurantFav = () =>{
  let favBTN = document.getElementById("favorite-btn").innerHTML;
  if (favBTN == 'Not Favorite') {
    document.getElementById("favorite-btn").innerHTML = "Favorite";
    DBHelper.setRestFavoriteStat(true, self.restaurant.id);
  }	else {
    document.getElementById("favorite-btn").innerHTML = "Not Favorite";
    DBHelper.setRestFavoriteStat(false, self.restaurant.id);
  }
}

/**
 * Initialise map after the page has loaded
*/

 window.onload = () =>{
   const map = document.getElementById('map-container');
   map.style.display = 'block';
   initMap();
   fillBreadcrumb(restaurant);
   fillRestaurantHTML(restaurant);
   getReviewsByID(restaurant);
 };

//showmap
window.showmap = () => {
  const bread = document.getElementById('breadcrumb');
  const rest = document.getElementById('restaurant-container');
  const rev= document.getElementById('reviews-container');
  const map = document.getElementById('map-container');
  bread.style.width = 'calc(50% - 40px)';
  rest.style.width = 'calc(50% - 20px)';
  rest.style.marginRight = '0';
  rest.style.marginLeft = '0';
  rev.style.width = 'calc(50% - 20px)';
  rev.style.marginRight = '0';
  rev.style.marginLeft = '0';
  map.style.display = 'block';
  initMap();
}
