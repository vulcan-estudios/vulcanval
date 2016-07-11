(function () {

  $('form .card').on('click', function (e) {

    $(e.target).parents('.cards').find('.card').removeClass('card_selected');
    $(e.target).addClass('card_selected');

    // tell the library this field has changed, this is required
    $('form #section').trigger('vv-change');
  });

  $('form').on('reset', function (e) {
    $('form .card').removeClass('card_selected');
  });

  $('form').vulcanval({
    fields: [{
      name: 'email',
      required: true
    }, {
      name: 'pass',
      required: true
    }, {
      name: 'section',
      required: true,

      // define how to get the field value, this is required
      value: function ($field) {
        return $field.find('.card.card_selected').data('value');
      }
    }]
  });

  $('#getData').on('click', function (e) {
    const map = $('form').vulcanval('getMap');
    console.log("$('form').vulcanval('getMap'):", map);
    $('#map').html(JSON.stringify(map));
  });

})();
