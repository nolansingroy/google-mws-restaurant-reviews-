/**
 * Common database helper functions.
 */
class DBHelper {
  /**
   * Database URL.
   * Link to the server.
   */
  static get DATABASE_URL() {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}/restaurants`;
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {

    function addRestaurants(data){
      const restaurants = data;
      DBHelper.addToDatabase(restaurants);
      return restaurants;
    }

    function requestError(e, part){
      const error = (`There was a failed request with error ${part}`);
      callback(error, null);
    }

    DBHelper.getRestaurantsFromCache().then(restaurants => {
      if(restaurants.length) {
        return Promise.resolve(restaurants);
        console.log('restaurants.length called');
      } else {
        return fetch(DBHelper.DATABASE_URL).then(response => response.json())
        .then(addRestaurants).catch(e => requestError(e, 'json'));
      }
    }).then(restaurants => {
      callback(null, restaurants);
    }).catch(error => {
      callback(error, null);
    })
  }
  /**
  ---- OLD XHR method depricated Please use Fetch API-------

       static fetchRestaurants(callback) {
       let xhr = new XMLHttpRequest();
       xhr.open('GET', DBHelper.DATABASE_URL);
       xhr.onload = () => {
         if (xhr.status === 200) { // Got a success response from server!
           const json = JSON.parse(xhr.responseText);
           const restaurants = json.restaurants;
           callback(null, restaurants);
         } else { // Oops!. Got an error from server.
           const error = (`Request failed. Returned status of ${xhr.status}`);
           callback(error, null);
         }
       };
       xhr.send();
     }
*/

  /**
   * Fetch a restaurant by its ID.
   */

  static fetchRestaurantById(id, callback) {
   DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) {
          callback(null, restaurant);
        } else {
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/img/${restaurant.photograph}.jpg`);
  }
  //Its more responsive to use the srcset atrribute
 //  static imageSrcSetForRestaurant(restaurant) {
 //    return (`/img/1x/${restaurant.photograph}.webp 1x, /img/2x/${restaurant.photograph}.webp 2x, /img/${restaurant.photograph}.webp 3x`);
 // }

 /**
  * Restaurant srcset URL.
  */
 static srcsetUrlForRestaurant(restaurant, suffix, size) {
   return (`/img/scaled/${restaurant.id}${suffix} ${size}`);
 }

 /**
  * Restaurant srcset.
  */
 static generateSrcset(restaurant, viewportMap, image) {
   let srcsets = [];
   let sizes = [];

   for (const viewport of viewportMap) {
     const size = DBHelper.sizeAttribute(viewport.media, viewport.slot);
     const srcset = DBHelper.srcsetUrlForRestaurant(restaurant, viewport.suffix, viewport.size);
     srcsets.push(srcset)
     sizes.push(size)
   }

   image.alt = restaurant.name;
   image.setAttribute('data-src', DBHelper.imageUrlForRestaurant(restaurant));
   image.setAttribute('data-srcset', srcsets.join());
   image.sizes = sizes.join();
 }

 /**
  * Restaurant size attribute.
  */
 static sizeAttribute(media, slot) {
   return (`${media} ${slot}`);
 }


  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }


  //Base functions
  static openDatabase() {
    // If the browser doesn't support service worker,
    // we don't care about having a database
    if (!navigator.serviceWorker) {
      return Promise.resolve();
    }

    return idb.open('restaurant', 1, upgradeDb => {
      var store = upgradeDb.createObjectStore('restaurants', {
        keyPath: 'id'
      });
    });
  }

  static addToDatabase(restaurantList) {
    var dbPromise = this.openDatabase();

    return dbPromise.then(db => {
      if (!db) return;
      const tx = db.transaction('restaurants', 'readwrite');
      const restaurantStore = tx.objectStore('restaurants');
      restaurantList.forEach(restaurant => {
        restaurantStore.put(restaurant);
      });
    });
    return tx.complete;
  }

  static getRestaurantsFromCache() {
    return DBHelper.openDatabase().then(db => {
      if (!db) return;
      return db.transaction('restaurants').objectStore('restaurants').getAll();
      console.log('get restarurants from cache');
    });
  }

}
