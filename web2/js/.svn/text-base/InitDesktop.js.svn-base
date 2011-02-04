function initDesktop() {

    var bookmarkedRURI, queryRURI, initRURI;
    
    
    // The initial section will be chosen in the following order:
    //
    // URL fragment identifier (it will be there if the user previously
    // bookmarked the application in a specific state)
    //
    //         or
    //
    // "ruri" URL parameter (it will be there if the user accessed
    // the site from a search engine result, or did not have scripting
    // enabled when the application was bookmarked in a specific state)
    //
    //         or
    //
    // "" (default)

    bookmarkedRURI = YAHOO.util.History.getBookmarkedState('ruri');
    queryRURI = YAHOO.util.History.getQueryStringParameter('ruri');
    initRURI = bookmarkedRURI || queryRURI || "";

    // Register our only module. Module registration MUST take place
    // BEFORE calling initializing the browser history management library!
    YAHOO.util.History.register('ruri', initRURI, function (state) {
        // This is called after calling YAHOO.util.History.navigate,
        // or after the user has trigerred the back/forward button.
        // We cannot distinguish between these two situations.
        Desktop.setRURI(state);
    });

    // Use the Browser History Manager onReady method to initialize the application.
    YAHOO.util.History.onReady(function () {
        var currentRURI = YAHOO.util.History.getCurrentState("ruri");
        Ext.onReady(function(){  
          Ext.QuickTips.init();
          Desktop=new RODS.Desktop({init_ruri:currentRURI});
          Desktop.init();
          Desktop.on('RURI_changed', function(ruri){
            // store state, if ruri changed, and only if it's different than current state
            if (ruri!=YAHOO.util.History.getCurrentState("ruri"))
              YAHOO.util.History.navigate("ruri", ruri); 
          },this);
        }); 
    });

    // Initialize the browser history management library.
    try {
        YAHOO.util.History.initialize("yui-history-field", "yui-history-iframe");
    } catch (e) {
        // The only exception that gets thrown here is when the browser is
        // not supported (Opera, or not A-grade) Degrade gracefully.
        // Note that we have two options here to degrade gracefully:
        //   1) Call initializeNavigationBar. The page will use Ajax/DHTML,
        //      but the back/forward buttons will not work.
        //   2) Initialize our module. The page will not use Ajax/DHTML,
        //      but the back/forward buttons will work. This is what we
        //      chose to do here:
        Desktop.setRURI(initRURI);
    }

}