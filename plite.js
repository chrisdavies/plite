function Plite() {

    var result,
        completed,
        thenFn,
        catchFn = function (err) { console.log(err); return err; },
        finallyFn = function () { },
        me;

    function then(fn) {
        var prevThen = thenFn || function (o, fn) { fn && fn(o); };

        thenFn = function (o, then) {
            prevThen(o, function (res) {
                try {
                    result = fn(res);

                    if (!then) {
                        completed = true;
                        finallyFn(result);
                    } else if (result && result.then) {
                        result.then(then).catch(function (err) {
                            reject(err);
                        });
                    } else {
                        then(result);
                    }
                } catch (err) {
                    reject(err);
                }
            });
        };

        completed && resolve(result);

        return result && result.then ? result : me;
    }

    function _catch (fn) {
        catchFn = fn;
        return me;
    }

    function _finally (fn) {
        finallyFn = fn;
        completed && fn(result);
        return me;
    }
        
    function resolve (obj) {
        result = obj;

        if (!(completed = (thenFn === undefined))) {
            var fn = thenFn;
            thenFn = undefined;
            fn(obj);
        }
    }

    function reject (err) {
        result = err;
        then = function () { return this; };
        result = catchFn(result);
        finallyFn(result);

        function callInstantly(fn) {
            fn(result);
            return this;
        }
            
        me.catch = me.finally = function (fn) {
            result = fn(result);
            return this;
        }
    }

    return me = {
        'catch': _catch,
        'finally': _finally,
        then: then,
        reject: reject,
        resolve: resolve
    }
}
