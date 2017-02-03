import MapLoader  from 'google-maps'
import RichMarker from 'googlemaps-js-rich-marker'



MapLoader.LANGUAGE = 'fr';
MapLoader.REGION   = 'FR';
MapLoader.KEY      = 'AIzaSyAUBn95pZykinj5JNOZRTQx74K8-Lm1zvg';



class Map {
	constructor(map, google) {
		this.map    = map;
		this.google = google;
	}

	resize(cb) {
		if(cb) {
			this.google.maps.event.addListenerOnce(this.map, 'resize', cb.addArgs(this.map));
		}
		this.google.maps.event.trigger(this.map, 'resize');
	}
}



class MapStash {
	constructor(google) {
		this.mapStash = {};
		this.markerStash = {};
		this.google = google;
	}


	getMap(name) {
		errorCheck.bind(this)(name);

		return this.mapStash[name]
	}


	addMap(name, options) {
		const map = new this.google.maps.Map(
			document.querySelector(options.selector),
			options);
		this.mapStash[name] = new Map(map, this.google);
	}


	addMarker(name, options, cb) {
		errorCheck.bind(this)(name);
		const marker = new RichMarker.RichMarker( options );
		this.markerStash[name] = marker;
		marker.setMap(this.mapStash[name].map);
		cb && cb(this.mapStash[name])
	}


	addSimpleMarker(name, options) {
		errorCheck.bind(this)(name);
		options.map = this.mapStash[name].map;
		new google.maps.Marker(options)
	}


	replaceMarker(name, options, cb) {
		//errorCheck.bind(this)(name);

		const marker    = this.markerStash[name];
		const newMarker = new RichMarker.RichMarker( options );

		if(marker) {
			marker.onRemove()
		}

		this.markerStash[name] = newMarker;
		newMarker.setMap(this.mapStash[name].map);
		cb && cb(this.mapStash[name])
	}


	removeMarker(name, cb) {
		errorCheck.bind(this)(name);
		const marker = this.markerStash[name];
		if(marker) {
			marker.onRemove()
		}
		this.markerStash[name] = undefined;
		cb && cb(this.mapStash[name])
	}
}



function errorCheck(name) {
	if(!this.mapStash[name]) {
		throw new Error(`There is no such map "${name}"`)
	}
}



export function GoogleInterface() {
	return new Promise( (res, rej) => {
		MapLoader.load( google => {
			res({
				google,
				mapStash: new MapStash(google)
			})
		})
	});
}