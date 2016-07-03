(function () {

  const $form = $('form');

  $form.on('vv-modify', function (e, vv) {

    const $field = $(e.target);
    const status = vv.valid === false ? 'invalid' : 'valid';

    // vv.valid as boolean indicates we know if it is valid or invalid
    // but if it is undefined, we don't know just yet

    console.log('Field', vv.name, 'is', status, 'and has a value "'+ vv.value +'" and an error msg "'+ vv.msg +'"');

    if (vv.valid === true || vv.valid === undefined) {
      $field.removeClass('field-error');
    } else {
      $field.addClass('field-error');
    }
  });

  $form.vulcanval({
    intern: true
  });

})();
