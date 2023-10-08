$(document).ready(function () {
  getAmenities();
  getApiStatus();
  getPlaces();
});

const host = 'http://' + window.location.hostname + ':5001';

function getAmenities () {
  const selectedAmenities = {};
  $('.amenities .popover input').change(function () {
    const amenityID = $(this).attr('data-id'); // data-id
    const amenityName = $(this).attr('data-name'); // data-name

    // if checkbox is checked
    if ($(this).is(':checked')) {
      // add the amenity id
      selectedAmenities[amenityID] = amenityName;
    } else { // if checkbox is unchecked
      // remove amenity id
      delete selectedAmenities[amenityID];
    }

    // update h4 tag in amenities div with list
    // of checked amenities
    const output = Object.values(selectedAmenities).sort().join(', ');
    $('.amenities h4').text(output);
  });
}

function getApiStatus () {
  // the api endpoint
  const url = host + '/api/v1/status';

  // get request to determine status of the api
  $.get(url, (data, textStatus) => {
    console.log('DATA:');
    console.log(data);
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });
}

function getPlaces () {
  // the api endpoint
  const url = host + '/api/v1/places_search/';

  // Send a POST request with an empty dictionary in body
  $.post({
    url,
    contentType: 'application/json',
    data: JSON.stringify({}),
    success: function (places) {
      // Loop through response and create article tag for each place
      places.forEach(function (place) {
        createPlace(place);
      });
    }
  });
}

function createPlace (place) {
  // Create article tag for the place
  const article = $('<article></article>');

  // Add place details to the article
  article.append(`<div class="title_box"><h2>${place.name}</h2><div class="price_by_night">$${place.price_by_night}</div></div>`);
  article.append(`<div class="information"><div class="max_guest">${place.max_guest} Guests</div><div class="number_rooms">${place.number_rooms} Bedrooms</div><div class="number_bathrooms">${place.number_bathrooms} Bathrooms</div></div>`);
  // article.append(`<div class="user"><strong>Owner: </strong>${place.user.first_name} ${place.user.last_name}</div>`);
  article.append(`<div class="description">${place.description}</div>`);

  // Append the article to places section
  $('section.places').append(article);
}
