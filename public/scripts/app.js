$(() => {
//   $.ajax({
//     method: "GET",
//     url: "api/users"
//   }).done((users) => {
//     for(user of users) {
//       console.log("!!!!!!!!! user = ", user)
//       $("<div>").text(user.name).appendTo($("body"));
//     }
//   });;
// });

  $.ajax({
    method: "GET",
    url: "api/users"
  }).done((resources) => {
    for(resource of resources) {
      console.log("resource = ", resource)
      $("<div>").text(resource.title).prependTo($("main"));
    }
  });;
});



$(document).ready(function($) {

  $(function() {
    var url = document.location.href;
    $('.list-group form').each(function() {
      if (url === this.action + "?") {
        $(this).children('button.list-group-item').addClass("active");
      }
    });
  });
});
