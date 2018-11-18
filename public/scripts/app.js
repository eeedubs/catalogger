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
      console.log("resource = ", resource);
      $(`<div class="resource"><img class="card-img-top" src='${resource.imageURL}'><h3>${resource.title}</h3><a href="${resource.resourceURL}">Source</a><p>${resource.description}</p>`).prependTo($(".category"));
    }
  });;


  $(function() {
    var url = document.location.href;
    $('.list-group form').each(function() {
      if (url === this.action + "?") {
        $(this).children('button.list-group-item').addClass("active");
      }
    });
  });
});
