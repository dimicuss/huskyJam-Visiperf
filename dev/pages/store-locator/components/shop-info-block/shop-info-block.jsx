import ShopInfo    from '../shop-info/shop-info.jsx'
import Result      from '../result/result.jsx'
import { between } from '../../resizeHandler.jsx'
import PinBlock    from '../pin-block/pin-block.jsx'

const TweenLite = Gsap;


function toString(ReactComponent) {
	return ReactDOMServer.renderToStaticMarkup(ReactComponent)
}


export default class ShopInfoBlock extends React.Component {
	constructor(props) {
		super();
		this.state = {
			maxColumns: 1,
			mapExpanded: false,
			selectedShop: null
		};
		this.shopClick         = this.shopClick.bind(this);
		this.crossClick        = this.crossClick.bind(this);
		this.dropShopSelection = this.dropShopSelection.bind(this);
		this.resizeRightMap    = props.resizeRightMap;
		this.mapNames          = props.mapNames;
		this.mapStash          = props.mapStash;
		this.google            = props.google;
	}


	componentDidMount() {
		const max = 10000;
		const min = 1;
		const cb  = () => {
			this.setPin(this.state.selectedShop)
		};

		between(920, max, (mq) => {
			if(mq) {
				this.setState({
					maxColumns: 1
				}, cb)
			}
		}, 'landscape');


		between(749, 920, (mq) => {
			if(mq) {
				this.setState({
					maxColumns: 1
				}, cb)
			}
		}, 'portrait');

		between(1, 749, (mq) => {
			if(mq) {
				this.setState({
					maxColumns: 1
				}, cb)
			}
		}, 'landscape');

		between(400, 749, (mq) => {
			if (mq) {
				this.setState({
					maxColumns: 2
				}, cb)
			}
		}, 'portrait');

		between(min, 400, (mq) => {
			if (mq) {
				this.setState({
					maxColumns: 1
				}, cb)
			}
		}, 'portrait')


	}


	shopClick(id) {
		return () => this.setState({
			selectedShop: id,
			mapExpanded: true
		}, () => this.setPin(id) )
	}


	setPin(id) {
		const mapStash = this.mapStash;
		const mapNames = this.mapNames;

		if(typeof(id) !== 'number') {
			mapStash.removeMarker(mapNames.leftMap, (map) => {
				this.rollUpLeftMap()
			});
			mapStash.removeMarker(mapNames.rightMap, (map) => {
				this.resizeRightMap()
			});
			return
		}

		const shop    = this.props.shops[ id ];
		const klass   = '--js-pancarte-hidden';
		const shopPos = new this.google.maps.LatLng(shop.lat, shop.lng);

		function createPin(cb) {
			const pin     = document.createElement('div');
			pin.innerHTML = toString( <PinBlock number={id + 1} shop={shop}/> );
			cb && cb(pin.querySelector('.pin'), pin.querySelector('.pancarte'));
			return pin
		}

		mapStash.replaceMarker(mapNames.leftMap, {
			flat: true,
			content: createPin( pin => {
				$(pin).removeClass(klass)
			}),
			position: shopPos
		}, () => {
			this.resetLeftMap(shopPos);
		});

		mapStash.replaceMarker(mapNames.rightMap, {
			flat: true,
			content: createPin( (pin, pancarte) => {
				pin.addEventListener( 'mouseenter', () => {
					$(pin).removeClass(klass)
				}, false);

				pancarte.addEventListener( 'mouseleave', event => {
					$(pin).addClass(klass)
				}, false);
			}),
			position: shopPos
		}, () => {
			this.resizeRightMap(shopPos);
		});
	}


	renderShopInfo() {
		const shops      = Object.create(this.props.shops);
		const maxColumns = this.state.maxColumns;
		let trIndex = 0;
		let index   = 0;
		let table   = [];

		while(shops.length) {
			let tr = [];
			for (let i = 0; i < maxColumns && shops.length; i++, index++) {
				const shop         = shops.shift();
				const selectedShop = this.state.selectedShop;
				let className;

				if( typeof(selectedShop) == 'number' && (selectedShop == index) ) {
					className = 'shop-info-block__cell --selected'
				} else {
					className = 'shop-info-block__cell --unselected'
				}

				tr.push(<td key={index} className={ className }>
					<ShopInfo number={index + 1} shop={shop} onClick={this.shopClick(index)}/>
				</td>);
			}
			table.push(<tr key={trIndex++}>{tr}</tr>)
		}
		return table
	}


	rollUpLeftMap(center) {
		const result = this.result.domRef;
		const height = result.offsetHeight;
		const map    = this.mapStash.getMap(this.mapNames.leftMap);

		TweenLite.to (this.map, 0.5, {
			height,
			ease: Power2.easeInOut,
			onComplete: () => {
				if(center) {
					map.resize(gMap => gMap.setCenter(center))
				} else {
					map.resize(gMap => gMap.setCenter(this.mapCenter))
				}
			}
		});
	}


	resetLeftMap(center) {
		const onComplete = () => {
			const map = this.mapStash.getMap(this.mapNames.leftMap);
			map.resize((gMap) => {
				gMap.setCenter(center);
			});
		};

		if(!this.state.mapExpanded) {
			this.rollUpLeftMap(onComplete)
		} else {
			const height = window.innerHeight;
			TweenLite.to (this.map, 0.5, {
				height,
				ease: Power2.easeInOut,
				onComplete
			});
			this.runScroll();
		}

	}


	runScroll() {
		const target     = $( this.map );
		const corrective = window.innerWidth > 768 ? 100 : 50;
		$( 'html, body' ).animate({
			scrollTop: target.offset().top - corrective
		}, 500 );
	}


	crossClick() {
		this.setState({
			mapExpanded: false,
			selectedShop: null
		}, () => {
			this.mapStash.removeMarker(this.mapNames.leftMap);
			this.mapStash.removeMarker(this.mapNames.rightMap);
			this.setPin(this.state.selectedShop)
		})
	}


	dropShopSelection() {
		this.setState({
			selectedShop: null,
			mapExpanded: false
		}, () => this.setPin(this.state.selectedShop) )
	}


	render() {
		const count      = this.props.shops.length;
		const address    = this.props.address;
		const crossState = this.state.mapExpanded ? '' : ' --js-hidden';

		return <div className='shop-info-block'>
			<Result
			    address={address}
				count={count}
				searchCb={this.props.searchCb}
				getAddressLocation={this.props.getAddressLocation}
				onEnd={this.props.onEnd}
				dropShopSelection={this.dropShopSelection}
				ref={(result) => this.result = result}
			/>
			<div className="shop-info-block__google-map" id="google-map" ref={(map) => this.map = map}>
				<div className="shop-info-block__google-map__map-entry"></div>
				<div className={'shop-info-block__google-map__cross' + crossState}
					 onClick={this.crossClick}
					 ref={(cross) => this.cross = cross} ></div>
			</div>
			<div className="shop__info">
				<table className='shop-info-block__shops'>
					<tbody>
					{this.renderShopInfo()}
					</tbody>
				</table>
			</div>
		</div>
	}
}
