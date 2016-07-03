(function () {

  $('form .card').on('click', function (e) {

    $(e.target).parents('.cards').find('.card').removeClass('card_selected');
    $(e.target).addClass('card_selected');

    // tell the library this field has changed
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

      // define how to get the field value
      value: function ($field) {
        return $field.find('.card.card_selected').data('value');
      }
    }]
  });

  // this is useful when you want to validate and extract data from custom fields
  // you can get the data map with your custom fields with: $('form').vulcanval('getMap');
  $('#getData').on('click', function (e) {
    console.log("$('form').vulcanval('getMap'):", $('form').vulcanval('getMap'));
  });

})();
