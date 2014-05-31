function Plite(arg) {

    // 'catch' or 'then', depending on whether the promise was resolved or rejected
    var result, 

        // The next promise in the chain
        next, 

        // Default handler methods, just pass on through to the next promise in the chain
        handler = {
            then: function (arg) { return next && next.resolve(arg); },
            'catch': function (arg) { return next && next.reject(arg); },
            done: undefined
        };

    // Run whenever this promise is complete
    function complete () {
        if (result) {
            handler[result](arg);
            handler.done && handler.done(arg);
        }
    }

    // Creates a function for registering a 'then', 'catch', or 'done' handler
    function handlerRegistrationFn(type) {
        return function (f) {
            handler[type] = function (argument) {
                var nextArg = f(arg);
                if (nextArg && nextArg.then) {
                    nextArg.then(function (arg) {
                        next.resolve(arg);
                    }).catch(function (arg) {
                        next.reject(arg);
                    });
                } else {
                    next.resolve(nextArg);
                }
            };

            next = Plite();
            complete();
            return next;
        }
    }

    // Creates a function for resolving or rejecting this promise
    function createResolveFunction(resolveResult) {
        return function (argument) {
            result = resolveResult;
            arg = argument;
            complete();
        }
    }

    // The actual promise object used for registering, and resolving/rejecting.
    function Inst() { }

    Inst.prototype = {
        then: handlerRegistrationFn('then'),

        'catch': handlerRegistrationFn('catch'),

        done: handlerRegistrationFn('done'),

        resolve: createResolveFunction('then'),

        reject: createResolveFunction('catch')
    }

    return new Inst();
}
