$(() => {
    $(function () {
        const $searchForm = $('.input-bar .search-form');
        const $query = window.location.search.substring(1);
        console.log('Query variable: ', $query);
        const $searchInput = $query.split('&');
        $searchForm.submit((event) => {
            knex('resources')
            .select(
        })
    });
});