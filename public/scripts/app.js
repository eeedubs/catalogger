$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });;

  // $(function() {
  //   var url = document.location.href;
  //   $('.list-group form').each(function() {
  //     if (url === this. 
  //   $('.jumbotron jumbotron-fluid .display-4').
  // });

  $(function() {
    var url = document.location.href;
    $('.list-group form').each(function() {
      if (url === this.action + "?") {
        $(this).children('button.list-group-item').addClass("active"); 
        console.log('.list-group form');       
      }
    });
  });
});