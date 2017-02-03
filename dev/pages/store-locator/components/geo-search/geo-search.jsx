import { GoogleInterface }  from '../google-map/google-map.jsx'
import ShopInfoBlock from '../shop-info-block/shop-info-block.jsx'
import ErrorBlock    from '../error-block/error-block.jsx'



export default class GeoSearch extends React.Component {
	constructor(props) {
		super();
		this.state = {
			shops: [],
			error: '',
			address: '',
			orientation: screen.orientation.angle
		};
		this.resizeRightMap = this.resizeRightMap.bind(this);
		this.getNearShops   = this.getNearShops.bind(this);
		this.onEnd          = this.onEnd.bind(this);
		this.google         = props.google;
		this.mapStash       = props.mapStash;
		this.mapCenter      = props.mapCenter;
		this.mapNames       = {
			leftMap: 'left-map',
			rightMap: 'right-map'
		};
	}


	componentDidMount() {
		const address = this.props.address;
		this.setMaps();
		if(address)  {
			this.getNearShops( this.getAddressLocation(address), this.onEnd )
		} else {
			this.getNearShops( this.getGeolocation, this.onEnd );
		}
	}



	getAddressLocation ( address ) {
		return ({ google }) => {
			return new Promise((res ,rej) => {
				const geocoder = new google.maps.Geocoder;
				geocoder.geocode( { address }, (results, status) => {
					const location = {};
					if(status === google.maps.GeocoderStatus.OK) {
						location.lat = results[0].geometry.location.lat();
						location.lng = results[0].geometry.location.lng();
						res({
							address: address,
							location
						})
					} else {
						const err = new Error(status + 'GEO');
						rej(err)
					}
				})
			})
		}
	}


	getGeolocation({ google }) {
		return new Promise( (res, rej) => {
			const geoTimeout = setTimeout(() => {
				const err = new Error('GEO_TIMEOUT');
				rej(err)
			}, 5000);

			navigator.geolocation.getCurrentPosition( geoposition => {
				clearInterval(geoTimeout);
				res( geoposition )
			})
		})
		.withPromise( (res, rej, geoposition) => {
			const geocoder = new google.maps.Geocoder;
			res({ geocoder, geoposition });
		})

		.withPromise( (res, rej, { geocoder, geoposition }) => {
			const location = {
				lat: geoposition.coords.latitude,
				lng: geoposition.coords.longitude
			};
			geocoder.geocode( { location }, (results, status) => {
				if(status === google.maps.GeocoderStatus.OK) {
					const addrComp = results[0].address_components;
					const address = [
						addrComp[1].long_name,
						addrComp[0].long_name,
						addrComp[4].long_name,
						addrComp[5].long_name
					];
					res({
						address: address.join(', '),
						location
					})
				} else {
					const err = new Error(status + 'GEO');
					rej(err)
				}
			})
		})
	}


	setMaps() {
		this.mapStash.addMap(this.mapNames.leftMap, {
			selector: '.shop-info-block__google-map__map-entry',
			scrollwheel: false,
			draggable: true,
			fullscreenControl: false,
			zoomControl: false,
			zoom: 8,
			center: this.mapCenter
		});

		this.mapStash.addMap(this.mapNames.rightMap, {
			selector: '.geo-search__cols__right-col__google-map',
			scrollwheel: false,
			draggable: true,
			fullscreenControl: false,
			zoomControl: false,
			zoom: 8,
			center: this.mapCenter
		});
	}


	getNearShops(cb, onEnd) {
		cb({ google: this.google })

		.withPromise( ( res, rej, { address, location }) => {
			const shops = this.props.shops;
			const promises = shops.map( shop => {
				const fn = (res, rej) => {
					const service = new google.maps.DistanceMatrixService();
					const origin = {
						lat: shop.lat,
						lng: shop.lng
					};
					const destination = location;

					service.getDistanceMatrix({
						origins:      [ origin ],
						destinations: [ destination ],
						travelMode: google.maps.TravelMode.DRIVING,
						unitSystem: google.maps.UnitSystem.METRIC,
						avoidHighways: false,
						avoidTolls: false
					}, (result, status) => {
						if( status === google.maps.DistanceMatrixStatus.OK ) {
							res({ result, status, shop })
						} else {
							const err = new Error(status  + 'DM');
							rej(err)
						}
					})
				};
				return new Promise( fn )
			});

			Promise.all( promises ).then( results => {
				res({ results, address })
			}).catch( err => {
				rej(err)
			});
		})

		.then( ({ results, address }) => {
			const maxDistance = 4000;
			const shops       = results.filter( ({ result }) => {
				const status = result.rows[ 0 ].elements[ 0 ].status;
				return status == 'OK'
			})

			.map( ({ result, shop }) => {
				const _shop = Object.assign( shop );
				const km    = result.rows[ 0 ].elements[ 0 ].distance.text;
				_shop.km    = km.replace(/\s/g, '').replace('km', ' km');
				return _shop
			})

			.filter( shop => {
				return parseInt(shop.km) <= maxDistance
			});

			this.setState({
				address,
				shops,
				error: ''
			}, () => {
				onEnd && onEnd({ google })
			})
		})

		.catch( err => {
			let frName;
			const message = err.message;

			console.error(err);

			switch(message) {
				case google.maps.GeocoderStatus.ERROR  + 'GEO':
					frName = 'Un problème est survenu lors du contact avec les serveurs Google.';
					break;
				case google.maps.GeocoderStatus.INVALID_REQUEST  + 'GEO':
					frName = 'Ce GeocoderRequest était invalide.';
					break;
				case google.maps.GeocoderStatus.OVER_QUERY_LIMIT  + 'GEO':
					frName = 'La page Web a dépassé la limite des demandes dans une période de temps trop courte.';
					break;
				case google.maps.GeocoderStatus.REQUEST_DENIED  + 'GEO':
					frName = "La page Web n'est pas autorisée à utiliser le géocodeur.";
					break;
				case google.maps.GeocoderStatus.UNKNOWN_ERROR  + 'GEO':
					frName = "Une requête de géocodage n'a pas pu être traitée en raison d'une erreur de serveur. La demande peut réussir si vous essayez à nouveau.";
					break;
				case google.maps.GeocoderStatus.ZERO_RESULTS  + 'GEO':
					frName = "Aucun résultat n'a été trouvé pour GeocoderRequest.";
					break;

				case google.maps.DistanceMatrixStatus.INVALID_REQUEST  + 'DM':
					frName = "La demande fournie était incorrecte.";
					break;
				case google.maps.DistanceMatrixStatus.OVER_QUERY_LIMIT  + 'DM':
					frName = "Trop d'éléments ont été demandés dans le délai autorisé.";
					break;
				case google.maps.DistanceMatrixStatus.REQUEST_DENIED  + 'DM':
					frName = "Le service a refusé l'utilisation du service Distance Matrix par votre page Web.";
					break;
				case google.maps.DistanceMatrixStatus.UNKNOWN_ERROR  + 'DM':
					frName = "Une demande de matrice de distance n'a pas pu être traitée en raison d'une erreur de serveur.";
					break;

				case 'GEO_TIMEOUT':
					frName = 'Temps limite de géolocalisation. Veuillez recharger la page.';
					break;

				default:
					frName = err.message
			}

			this.setState({
				error: frName
			})
		});
	}


	ifError() {
		const error = this.state.error;
		if(error) {
			return  <ErrorBlock message={error} />
		}
	}


	resizeRightMap(center) {
		const height = $(this.leftCol).height();
		const map    = this.mapStash.getMap(this.mapNames.rightMap);
		$(this.rightCol).height(height);
		if(center) {
			map.resize((gMap) => gMap.setCenter(center))
		} else {
			map.resize((gMap) => gMap.setCenter(this.mapCenter))
		}
	}


	onEnd() {
		this.mapStash.removeMarker(this.mapNames.leftMap);
		this.mapStash.removeMarker(this.mapNames.rightMap);
		this.resizeRightMap()
	}


	render() {
		const shops   = this.state.shops;
		const address = this.state.address || this.props.address;
		return <section className='geo-search'>
			<div className='geo-search__cols'>
				<div className='geo-search__cols__left-col' ref={(leftCol) => this.leftCol = leftCol}>
					{this.ifError()}
					<ShopInfoBlock
					    shops={shops}
						address={address}
						searchCb={this.getNearShops}
						getAddressLocation={this.getAddressLocation}
						onEnd={this.onEnd}
						mapStash={this.mapStash}
						mapNames={this.mapNames}
						google={this.google}
						resizeRightMap={this.resizeRightMap}
						mapCenter={this.mapCenter}/>
				</div>
				<div className='geo-search__cols__right-col' ref={(rightCol) => this.rightCol = rightCol}>
					<div className="geo-search__cols__right-col__google-map"></div>
				</div>
			</div>
		</section>
	}
}
