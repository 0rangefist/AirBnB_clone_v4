$('document').ready(function () {
    const api = 'http://' + window.location.hostname;

    $.get(api + ':5001/api/v1/status/', function (response) {
        if (response.status === 'OK') {
            $('DIV#api_status').addClass('available');
        } else {
            $('DIV#api_status').removeClass('available');
        }
    });

    $.ajax({
        url: api + ':5001/api/v1/places_search/',
        type: 'POST',
        data: '{}',
        contentType: 'application/json',
        dataType: 'json',
        success: appendPlaces
    });

    const amenities = {};
    const states = {};
    const cities = {};
    $('.amenities input').change(function () {
        if ($(this).is(':checked')) {
            amenities[$(this).attr('data-id')] = $(this).attr('data-name');
        } else {
            delete amenities[$(this).attr('data-id')];
        }
        if (Object.values(amenities).length === 0) {
            $('.amenities H4').html('&nbsp;');
        } else {
            $('.amenities H4').text(Object.values(amenities).join(', '));
        }
    });

    $('.locations h2 input').change(function () {
        if ($(this).is(':checked')) {
            states[$(this).attr('data-id')] = $(this).attr('data-name');
            console.log("STATE: " + $(this).attr('data-name'))
        } else {
            delete states[$(this).attr('data-id')];
        }
        if (Object.values(states).length === 0) {
            $('.locations H4').html('&nbsp;');
        } else {
            const combined = Object.values(states).concat(Object.values(cities)).join(', ');
            $('.locations h4').text(combined);
        }
    });

    $('.locations li > input').change(function () {
        if ($(this).is(':checked')) {
            cities[$(this).attr('data-id')] = $(this).attr('data-name');
            console.log("CITY: " + $(this).attr('data-name'))
        } else {
            delete cities[$(this).attr('data-id')];
        }
        if (Object.values(cities).length === 0) {
            $('.locations H4').html('&nbsp;');
        } else {
            const combined = Object.values(states).concat(Object.values(cities)).join(', ');
            $('.locations h4').text(combined);
        }
    });

    $('.filters BUTTON').click(function () {
        const filterObject = { amenities: Object.keys(amenities), states: Object.keys(states), cities: Object.keys(cities) }
        console.log("Filter Object:")
        console.log(filterObject)
        $.ajax({
            url: api + ':5001/api/v1/places_search/',
            type: 'POST',
            data: JSON.stringify(filterObject),
            contentType: 'application/json',
            dataType: 'json',
            success: appendPlaces
        });
    });
});

function appendPlaces(data) {
    $('SECTION.places').empty();
    $('SECTION.places').append(data.map(place => {
        return `<ARTICLE>
                  <DIV class="title_box">
                    <H2>${place.name}</H2>
                      <DIV class="price_by_night">
                        $${place.price_by_night}
                      </DIV>
                    </DIV>
                    <DIV class="information">
                      <DIV class="max_guest">
                        <I class="fa fa-users fa-3x" aria-hidden="true"></I>
                        </BR>
                        ${place.max_guest} Guests
                      </DIV>
                      <DIV class="number_rooms">
                        <I class="fa fa-bed fa-3x" aria-hidden="true"></I>
                        </BR>
                        ${place.number_rooms} Bedrooms
                      </DIV>
                      <DIV class="number_bathrooms">
                        <I class="fa fa-bath fa-3x" aria-hidden="true"></I>
                        </BR>
                        ${place.number_bathrooms} Bathrooms
                      </DIV>
                    </DIV>
                    <DIV class="description">
                      ${place.description}
                    </DIV>
                  </ARTICLE>`;
    }));
}
