class RecursiveProxy{
	isRecursiveProxy = true
	handler = {
		get: (obj, prop, proxy) => {
			if(this[prop]){return this[prop]}

			return obj[prop]
		},
		set(obj, prop, value){
			obj[prop] =
				value + '' == {} & !value.isRecursiveProxy ?
					new RecursiveProxy(value, obj, prop) : value;
		}
	}
	constructor(obj, parent = false, key = ''){
		for(let key in obj){
			this.handler.set(this, key, obj[key])
		}

		return new Proxy(this, this.handler)
	}
}