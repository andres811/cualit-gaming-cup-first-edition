/**
 * Created by cualit on 10/31/16.
 */

/**
 * Asynchronous each
 * @param {!*[]} arr
 * @param {function(arrItem, i, next)} fn - each
 * @param {function} cb - callback
 */
function asyncEach (arr, fn, cb){
    var validArray = true;
    var i = 0;
    var keys;
    var max;
    var _onFinished = null;

    if(!arr || !arr.length) {
        validArray = false;
    } else {
        keys = Object.keys(arr);
        max = arr.length;
    }

    function doFn(){
        fn.call(arr[keys[i]], arr[keys[i]],i, next);
    }
    function next(){
        i++;
        if(i != max)
            doFn();
        else
            if(_onFinished && _onFinished.call)
                _onFinished();
            else if (cb && cb.call) {
                cb();
            }

    }
    function goToThen () {setTimeout(function(){if (_onFinished.call) _onFinished()}, 100);}

    this.then = function(cb){
        _onFinished = cb;
        return this;
    };

    // first call
    if(validArray)
        doFn();
    else {
        goToThen();
    }

    return this;
}

module.exports = asyncEach;


// usage
/*
asyncEach([1,3,2], function(d, i, next){
    console.log(d)
    setTimeout(function(){
        // async code
        next()
    },1000)
}).then(function(){
    console.log('finished');
});
*/
