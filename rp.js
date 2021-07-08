class RecursiveProxy{
	isProxy = true
	subs = {}
	handler = {
		get: (obj, prop) => {
			if(this[prop]){return this[prop]}

			return obj[prop]
		},
		set: (obj, prop, value) => {
			let old = obj[prop];
			obj[prop] =
				value + '' == {} & !value.isProxy ?
					new RecursiveProxy(value) : value;
			this.subs[prop] && this.subs[prop](old, obj[prop])
		}
	}
	constructor(obj){
		for(let key in obj){
			this.handler.set(this, key, obj[key])
		}

		return new Proxy(this, this.handler)
	}
	subscribe(key, callback){
		this.subs[key] = callback
	}
}