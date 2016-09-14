(function (Plite) {

  describe('Plite', function () {

    it('handles resolves at end', function (done) {
      var p = new Plite(function (resolve) {
        setTimeout(function() {
          resolve('hello');
        });
      });

      p.then(function (result) {
        expect(result).toEqual('hello');
        done();
      });
    });

    it('handles resolves at start', function () {
      var p = Plite.resolve('world');

      p.then(function (result) {
        expect(result).toEqual('world');
      });
    });

    it('resolves chains', function (done) {
      var p = new Plite(function (resolve) {
        setTimeout(function () {
          resolve('hello');
        });
      });

      p.then(function (result) {
        return result + ' chris';
      }).then(function (result){
        expect(result).toEqual('hello chris');
        done();
      });
    });

    it('resolves multiple-promises', function (done) {
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
        expect(result).toEqual('hi chris');
        done();
      });
    });

    it('handles rejects at end', function (done) {
      var p = Plite(function (resolve, reject) {
        setTimeout(function () {
          reject('doh');
        });
      });

      p.then(function (result) {
        throw 'Should not have gotten to then';
      }).catch(function (err) {
        expect(err).toEqual('doh');
        done();
      });
    });

    it('handles reject at start', function () {
      var p = Plite.reject('doh');

      p.then(function (result) {
        throw 'Should not have gotten to then';
      }).catch(function (err) {
        expect(err).toEqual('doh');
      });
    });

    it('catches exceptions', function (done) {
      var p = Plite.resolve('mkay');

      p.then(function () {
        throw 'ruh roh!';
      }).catch(function (err) {
        expect(err).toEqual('ruh roh!');
        done();
      });
    });

    it('catches exceptions in the resolver function', function (done) {
      var p = Plite(function () {
        throw 'Doh!'
      });
      var thenCount = 0;

      p.then(function () { ++thenCount })
      .catch(function (err) {
        expect(thenCount).toEqual(0);
        expect(err).toEqual('Doh!');
        done();
      });
    });

    it('does not require that then returns', function () {
      var p = Plite.resolve('mkay'),
          secondRan = false;

      p.then(function () {
      }).then(function () {
        secondRan = true;
      });

      expect(secondRan).toBeTruthy();
    });

    it('chains errors', function (done) {
      var p = Plite.resolve('done');

      p.then(function () {
        return Plite(function (resolve, reject) {
          setTimeout(function () {
            reject('errorz');
          });
        });
      }).then(function (r) {
        throw 'It should not have gotten here';
      }).catch(function (e) {
        expect(e).toEqual('errorz');
        done();
      });
    });

    it('handles all without promises', function () {
      Plite.all([1, 2]).then(function (arr) {
        expect(arr[0]).toEqual(1);
        expect(arr[1]).toEqual(2);
      });
    });

    it('handles nothing passed to all', function () {
      Plite.all().then(function (arr) {
        expect(arr).toBeFalsy();
      });
    });

    it('handles mixed all invocations', function () {
      Plite.all([Plite.resolve('hoi'), 2]).then(function (arr) {
        expect(arr[0]).toEqual('hoi');
        expect(arr[1]).toEqual(2);
      });
    });

    it('handles all with promises', function (done) {
      var p2 = Plite(function (resolve) {
        setTimeout(function () { resolve('two'); })
      });

      Plite.all([Plite.resolve('hoi'), p2]).then(function (arr) {
        expect(arr[0]).toEqual('hoi');
        expect(arr[1]).toEqual('two');
        done();
      });
    });

    it('handles race with no args', function () {
      var called = false;

      Plite.race().then(function () {
        called = true;
      });

      expect(called).toBeTruthy();
    });

    it('resolves race in the right order', function (done) {
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
        expect(++count).toEqual(1);
        expect(data).toEqual('uno');
        done();
      });
    });

    it('rejects race calls in the right order', function (done) {
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
        expect(++count).toEqual(1);
        expect(data).toEqual('doh!');
        done();
      });
    });

  });

})(this.Plite || require('../plite'));
