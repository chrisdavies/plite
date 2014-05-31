# plite

Tiny, light-weight JavaScript promises

## Stats

size: ~370 bytes gzipped and minified

perf: http://jsperf.com/plite 
      (pretty darn good compared to jQuery's deferred implementation) 

## Usage
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


## License
None. Do whatever you want with this.

