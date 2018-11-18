$(() => {
    $(function () {
        const searchForm = $('.input-bar .search-form');
        const query = window.location.search.substring(1);
        console.log('Query variable: ', $query);
        const searchInput = $query.split('&');
        $searchForm.submit((event) => {
            knex.select().from('resources')
            .where('title', 'LIKE', `%${searchInput}%`)
            .orWhere('description', 'LIKE', `%${searchInput}%`)
            .asCallback(function(err, result){
                console.log("Searching...");
                if (err) {
                    throw err;
                }
                console.log(`Found ${result.length} articles by searching for '${command}':`);
            })
        })
    });
});