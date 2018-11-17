$(() => {

  $(function () {
    //still selects all forms for some reason
    $form = $("#submitNew");
    $text = $(".form-control");

    $url = $text[1];
    $title = $text[2];
    

    $form.submit((event) => {
      event.preventDefault();
      console.log("Button Clicked!");

      $.ajax({
        method: "POST",
        url: "/submit",
        data: $form.serialize()
      })
      .then(
        () => {
          console.log("wow this is some text ====> : ",
           `${$text[0].value}, 
            ${$text[1].value}, 
            ${$text[2].value}, 
            ${$text[3].value}, 
            ${$text[4].value}`);
        }
      )
    })
  })
  
  // .done(() => {
  //   for(id of resources) {
  //     $("<div>").addClass("resource").text(user.name).appendTo($("body"));
  //   }
  // });;


  // function createPost({
  //   id,
  //   title,
  //   description,
  //   resourceURL,
  //   imageURL
  // }) {

  //   console.log("Resource Found!", id, title, description,resourceURL, imageURL);
  // };
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