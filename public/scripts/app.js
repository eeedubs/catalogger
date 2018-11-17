$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });;
});


$(document).ready(function() {


  // handles the toggling of the blue background on the sidebar buttons
  // preventDefault would have stopped the page from loading
  $('form .list-group-item').click(function(e) {
    $('form .list-group-item').removeClass('active');
    $(this).addClass('active');
  });
});