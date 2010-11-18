yqlcache
--------

A simple wrapper for YQL to support local storage.

Use like this:

yqlcache.get({
 yql: "select title,link from rss where url='http://feeds.feedburner.com/nczonline'",
 id: 'rssncz',
 cacheage: (60 * 60 * 1000),
 callback: function(data) {
       console.log(data); 
 }
});

yql - the YQL statement
id  - the storage key for localstorage
cachage - how long to store the data
callback - function to call when the data is retrieved

The returned data in the callback is an object with two properties:
    data - the YQL data
    type - the type of data - either 'cached' for cached data, 'freshcache' for newly cached information
           or 'live' when caching is not available.

Demos: [http://thinkphp.ro/apps/js-hacks/yqlcache/demos/](http://thinkphp.ro/apps/js-hacks/yqlcache/demos/)
            
                              
