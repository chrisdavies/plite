asyncTest('resolve last', function () {
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
