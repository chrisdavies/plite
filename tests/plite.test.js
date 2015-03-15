// TODO:
// Test chaining off original promise
// Test chaining off subsequent promise
// Throw exception in .then
// Throw exception in .catch
// Return promise from .then, which returns a promise from its .then, etc
// Return promise from .catch
// Throw in then with delayed resolve

﻿asyncTest('resolve last', function () {
  var p = new Plite(function (resolve) {
    setTimeout(function () {
      resolve('hello');
    });
  });

  p.then(function (result) {
    ok(result == 'hello');
    start();
  });
});

test('resolve first', function () {
  var p = Plite.resolve('world');

  p.then(function (result) {
    ok(result == 'world');
  });
});

asyncTest('resolve chain', function () {
  var p = new Plite(function (resolve) {
    setTimeout(function () {
      resolve('hello');
    });
  });

  p.then(function (result) {
    return result + ' chris';
  }).then(function (result){
    ok(result == 'hello chris');
    start();
  });
});

asyncTest('resolve multi-promise', function () {
  var p = Plite(function (resolve) {
    setTimeout(function () {
      resolve('chris');
    });
  });

  p.then(function (result) {
    return Plite(function (resolve) {
      setTimeout(function () {
        resolve('hi ' + result);
      }, 10);
    });
  }).then(function (result) {
    ok(result == 'hi chris');
    start();
  });
});

asyncTest('reject last', function () {
  var p = Plite(function (resolve, reject) {
    setTimeout(function () {
      reject('doh');
    });
  });

  p.then(function (result) {
    ok(false, 'Should not have gotten to then');
  }).catch(function (err) {
    ok(err == 'doh', 'Err should have been doh');
    start();
  });
});

test('reject first', function () {
  var p = Plite.reject('doh');

  p.then(function (result) {
    ok(false, 'Should not have gotten to then');
  }).catch(function (err) {
    ok(err == 'doh');
  });
});

test('catch is triggered when then excepts', function () {
  var p = Plite.resolve('mkay');

  p.then(function () {
    throw 'ruh roh!';
  }).catch(function (err) {
    ok(err == 'ruh roh!');
  });
});

test('then does not require return value', function () {
  var p = Plite.resolve('mkay');

  p.then(function () {
  }).then(function () {
    ok('The second then was called');
  });
});

asyncTest('error chain', function () {
  var p = Plite.resolve('done');

  p.then(function () {
    return Plite(function (resolve, reject) {
      setTimeout(function () {
        reject('errorz');
      });
    });
  }).then(function (r) {
    ok(false, 'Should not have gotten to then');
  }).catch(function (e) {
    ok(e == 'errorz', 'errorz expected');
    start();
  });

});

test('all without promises', function () {
  Plite.all([1, 2]).then(function (arr) {
    ok(arr[0] === 1);
    ok(arr[1] === 2);
  });
});

test('all empty', function () {
  Plite.all().then(function (arr) {
    ok(arr === undefined);
  });
});

test('all mixed', function () {
  Plite.all([Plite.resolve('hoi'), 2]).then(function (arr) {
    ok(arr[0], 'hoi');
    ok(arr[1], 2);
  });
});

asyncTest('all with promises', function () {
  var p2 = Plite(function (resolve) {
    setTimeout(function () { resolve('two'); })
  });

  Plite.all([Plite.resolve('hoi'), p2]).then(function (arr) {
    ok(arr[0], 'hoi');
    ok(arr[1], 'two');
    start();
  });
});

test('race empty', function () {
  Plite.race().then(function () {
    ok(true);
  });
});

asyncTest('race resolve times', function () {
  var count = 0;
  var p1 = Plite(function (resolve) {
    setTimeout(resolve, 100);
  });
  var p2 = Plite(function (resolve) {
    setTimeout(function () {
      resolve('uno');
    }, 10);
  });

  Plite.race([p1, p2]).then(function (data) {
    ok(++count === 1, 'Count = 1');
    ok(data === 'uno', 'Uno');
    start();
  });
});

asyncTest('race reject times', function () {
  var count = 0;
  var p1 = Plite(function (resolve, reject) {
    setTimeout(function () {
      reject('doh!');
    }, 10);
  });
  var p2 = Plite(function (resolve) {
    setTimeout(resolve, 100);
  });

  Plite.race([p1, p2]).catch(function (data) {
    ok(++count === 1, 'Count = 1');
    ok(data === 'doh!', 'Doh');
    start();
  });
});
