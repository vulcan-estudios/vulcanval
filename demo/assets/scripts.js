$(document).ready(function ($) {
  $('form').on('submit', function (e) {

    if ($('form').data('vv-valid') === true) {
      alert('Awesome, the form is valid!');
    }

    e.preventDefault();
    return false;
  });
});
