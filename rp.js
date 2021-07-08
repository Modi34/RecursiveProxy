class RecursiveProxy{
	Proxy = true
	subs = {}
	handler = {
		get: (obj, prop) => this[prop] || obj[prop],
		set: (obj, prop, value) => {
			let old = obj[prop];
			obj[prop] =
				value + '' == {} & !value.Proxy ?
					new RecursiveProxy(value, this, prop) : value;

			if(old != obj[prop]){
				let subs = this.getCallbacks(prop)
				for(let callback of subs.callbacks){
					callback(old, obj[prop], subs.path)
				}
			}
		}
	}

	constructor(obj = {}, parent, parentKey){
		this.parent = parent
		this.parentKey = parentKey

		for(let key in obj)
			this.handler.set(this, key, obj[key]);

		return this.Proxy = new Proxy(this, this.handler)
	}

	subscribe(callback, key){
		if(!callback){return false}
		let subs = this.subs;
		if(!key){
			subs = this.parent.subs
			key = this.parentKey
		}
		if(!subs[key]){subs[key] = []}
		subs[key].push(callback)
		return subs[key].length - 1
	}

	getParents(){
		let parent = this, key = this.parentKey, parents = [];
		while(parent = parent.parent){
			parents.push({parent, key})
			key = parent.parentKey
		}
		return parents.reverse()
	}

	getCallbacks(targetKey=''){
		let parents = this.getParents()
		let path = '/'
		let callbacks = [];
		for(let records of parents){
			let {parent, key} = records
			parent.subs[key] &&
				callbacks.push(...parent.subs[key])
			path += key + '/';
		}

		if(targetKey&&this.subs[targetKey]){
			callbacks.push(...this.subs[targetKey])
			path += targetKey
		}

		return {callbacks, path}
	}
}