# plite

Tiny, fast, light-weight JavaScript promises.

## Stats

size: roughly 600 bytes gzipped and minified

perf: http://jsperf.com/plite/14

## Usage

Include `plite.min.js`

Plite should work as a shim for ES6 promises, if you do this:

    !this.Promise && (this.Promise = Plite);

Create a resolved promise:

    Plite.resolve(data);

Create a rejected promise:

    Plite.reject(err);

Resolve a promise after a bit:

    Plite(function (resolve) {
      setTimeout(function () {
        resolve('all done!');
      }, 100);
    });

Reject a promise after a bit:

    Plite(function (resolve, reject) {
      setTimeout(function () {
        reject('Ruh roh!');
      }, 100);
    });

Promises supports chaining:

    var p = Plite.resolve('Hurrah!');

    p.then(function (msg) {
      return msg + ' on ' + new Date().toString();
    }).then(function (msg) {
      alert('GOOD: ' + msg);
    }).catch(function (err) {
      alert('ERR: ' + err);
    });

## Race and All

All works as documented in [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all).

So does [race](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race).

With the caveat that the iterable argument is treated as an array. So:

    Plite.all([promise1, promise2]).then(function (data) {
      // data is the array of values that the promises resolved to...
    }).catch(function (err) {
      // err is the error of to the first failed promise in the array
    });


## Minification

Minified using:

    uglifyjs plite.js --source-map plite.min.js.map -m -c -o plite.min.js

## License MIT

Copyright (c) 2015 Chris Davies

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
