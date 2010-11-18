var yqlcache = function() {
 
    /* Globals for JSON callback, check for cache support */
    var cacheid, cb,
        cancache = (("localStorage" in window) && (window["localStorage"] !== null)); 

   /* get the data - expects a transaction object */ 
   function get(transaction) {

        if(!transaction.id || 
              !transaction.callback || 
                  !transaction.yql || 
                     !transaction.cacheage) {
            return;   
        } 

        var current, data;
        cb = transaction.callback;
        cacheid = transaction.id;

        /* If caching is not supported, just call YQL */ 
        if(!cancache) {
            loadYQL(transaction.yql); 
        }//endif

        /* If caching is supported */  
       if(cancache) {

          /* retrieve the cache and see if it has data */
          current = JSON.parse(localStorage.getItem(cacheid)); 

          if(current !== null) {

             /* If the cache is less than the cacheage then return it */
             if((new Date().getTime() - current.time) < transaction.cacheage) {

                 cb({type: "cached", data: current.data});
 
             /* If the cache is older than the max age, then prime the cache */
             } else {
               loadYQL(transaction.yql); 
             }   

          /* if the cache has not data, load from YQL AGAIN */
          } else {

             loadYQL(transaction.yql);
          }  

       }//endif
   } 

   /* Standard JSON-P call function to get data from YQL*/
   function loadYQL(yql) {

      var old = document.getElementById("yqloadscript");  
      if(old) { old.parentNode.removeChild(old);}

      var format = 'json';
          if(yql.match(/xpath/i)) {
             format = 'xml';
          } 

      var YQL = "http://query.yahooapis.com/v1/public/yql?q=" +
                encodeURIComponent(yql) + "&diagnostics=false&format=" + format + 
                "&callback=yqlcache.cache";

      var s = document.createElement('script');
          s.setAttribute('type','text/javascript');
          s.id = 'yqloadscript';
          s.setAttribute('src', YQL);  
          document.getElementsByTagName('head')[0].appendChild(s);
   }


   /* Caching Function */ 
   function cache(data) {

       /* If YQL was successful, get the data */     
       if(data.query && data.query.results) {

          var out = data.query.results;

          /* if caching is supported, get a timestamp, prime the cache and call the callback */
          if(cancache) {
              var timestamp = new Date().getTime();
              localStorage.setItem(cacheid, JSON.stringify({time: timestamp, data: out}));
              cb({type: "freshcache", data: out});

          //otherwise just call the callback
          } else {
              cb({type: "live", data: out});               
          }//endifelse   

       //if we have XML with callback then begin
       } else if(data.results[0]) {

          var out = data.results[0];

          /* if caching is supported, get a timestamp, prime the cache and call the callback */
          if(cancache) {
              var timestamp = new Date().getTime();
              localStorage.setItem(cacheid, JSON.stringify({time: timestamp, data: out}));
              cb({type: "freshcache", data: out});

          //otherwise just call the callback
          } else {
              cb({type: "live", data: out});               
          }//endifelse   
       }
   } 
return {cache: cache, get: get}; 
}();