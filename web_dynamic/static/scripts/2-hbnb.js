$(document).ready(function () {
  getAmenities();
  getApiStatus();
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
