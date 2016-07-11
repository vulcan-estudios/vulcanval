(function () {

  const settings = window.settings;
  const $form = $('form');

  $form.vulcanval(settings);

  $form.on('submit', function (e) {

    const map = $form.vulcanval('getMap');
    const invalids = $form.vulcanval('inspect');

    if (invalids) {
      alert('There are errors in your form.');
    } else {
      $.ajax({
        url: '/api/login',
        type: 'post',
        data: map
      })
      .then(function (result) {
        if (result.success) {
          alert('Now you are logged in!');
        } else {
          alert('Error: '+ JSON.stringify(result.data));
        }
      }, function (xhr) {
        alert('Error: '+ xhr.responseText);
      });
    }

    e.preventDefault();
    return false;
  });

})();
