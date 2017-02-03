Function.prototype.addMethod = function (name, fn) {
	if(typeof(this) === 'function') {
		return this.prototype[name] = fn
	}

	throw new Error('Object is not constructor!')
};

Function.prototype.addArgs = function (...newArgs) {
	return (...args) => {
		return this.apply(null, args.concat(newArgs))
	}
};

Promise.addMethod('withPromise', function (fn) {
	return this.then((...rest) => {
		return new Promise(fn.addArgs.apply(fn, rest))
	})
});


HTMLElement.addMethod('removeChildren', function () {
	console.log(this);
	while (this.hasChildNodes()) {
		this.removeChild(this.lastChild);
	}
});