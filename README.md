# plite

Tiny, light-weight JavaScript promises

## Stats

size: ~370 bytes gzipped and minified

perf: http://jsperf.com/plite 
      (pretty darn good compared to jQuery's deferred implementation) 

## Usage
Include plite.js

Create a promise:

    var p = Plite();

Resolve a promise:

    p.resolve('Hey, that was successful!');

Reject a promise:

    p.reject('Utter failure.');

Chain stuff along:

    p.then(function (msg) {
        return msg + ' on ' + new Date().toString();
    }).then(function (msg) {
        alert('GOOD: ' + msg);
    }).catch(function (err) {
        alert('ERR: ' + err);
    }).done(function () {
        alert('All done!');
    });

## Limitations
This is a very simple implementation. It is intended to be used to chain promises, resolve, and reject. It really isn't intended for any other use. It does what I need a promise to do, and no more...

## Alite
Alite is an example usage of Plite. It's a basic ajax library that uses Plite promises.

Here's the basic Alite usage:

    // Get and delete take the URL to be retrieved or deleted.
    Alite.get('/api/foos').then(function (result) {
        alert('GOT: ' + JSON.stringify(result.data))
    });


    // Put and post take a url and the object that will
    // be sent to the server as JSON.
    Alite.put('/api/foos/23', {
        name: 'Turd Furguson'
    }).then(function (result) { 
        // Do stuff
    }).catch(function (result) {
        handleErrorResponse(result.data);
    });

There are four methods: get, put, post, and delete. They return a promise, and their callbacks receive an object that looks like this:

    {
       // The raw request/response object
       request: { status: ... },
       
       // The response data, parsed as JSON, if it was a 
       // JSON response, otherwise this is just the raw
       // response string (text, html, or whatever).
       data: { ... }
    }

## License
None. Do whatever you want with this.

