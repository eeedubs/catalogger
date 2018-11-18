$(() => {

  $.ajax({
    method: "GET",
    url: "api/users"
  }).done((resources) => {
    for(resource of resources) {
      $(`<div class="resource"><img class="card-img-top" src='${resource.imageURL}'><h3>${resource.title}</h3><a href="${resource.resourceURL}">Source</a><p>${resource.description}</p>`).prependTo($(".category"));
    }
  });


  // function searchResources() {
  //   // const searchForm = $('.input-bar .search-form');
  //   const test = window.location.search;
  //   console.log(test);
  //   console.log(searchForm);
  //   const query = window.location.search.substring(1);
  //   console.log('Query variable: ', $query);
  //   const searchInput = $query.split('&');
  //   searchForm.submit((event) => {
  //       knex.select().from('resources')
  //       .where('title', 'LIKE', `%${searchInput}%`)
  //       .orWhere('description', 'LIKE', `%${searchInput}%`)
  //       .asCallback(function(err, result){
  //           console.log("Searching...");
  //           if (err) {
  //               throw err;
  //           }
  //           console.log(`Found ${result.length} articles matching your search for '${command}':`);
  //           result.forEach(function(row) {
  //               console.log(`${row}`);
  //           })
  //       })
  //   });
  // }

  function parseQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}



 // Handles the naming of the category titles
  function renameCategory() {
    let extension = window.location.pathname.split('/');
    for (let i in extension){
      extension[i] = extension[i].charAt(0).toUpperCase() + extension[i].slice(1);
    }
    $('.display-4').text(extension.join(" "));
  };

  // Highlights the selected page as blue on the sidebar
  // Changes the header for each category by calling on renameCategory
  $(function() {
    var url = document.location.href;
    $('.list-group form').each(function() {
      if (url === this.action + "?") {
        $(this).children('button.list-group-item').addClass("active");
        renameCategory();
        $(this).children('button.list-group-item').addClass("active");
      }
    });
  });
});

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
