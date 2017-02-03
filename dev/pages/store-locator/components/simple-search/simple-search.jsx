import styles       from '../google-map/map-styles.jsx'
import Dropdown     from '../dropdown/dropdown.jsx'


class ErrorField extends React.Component {
	render() {
		return <div className="simple-search__form-block__input__wrapper__error-field">
			<span>{this.props.phrase}</span>
		</div>
	}
}


export default class SimpleSearch extends React.Component {
	constructor(props) {
		super();
		this.state = {
			error:        false,
			inputQuery:   '',
			focusInput:   false,
			showDropdown: false
		};
		this.checkError    = this.checkError.bind(this);
		this.hideDropdown  = this.hideDropdown.bind(this);
		this.showDropdown  = this.showDropdown.bind(this);
		this.setInputQuery = this.setInputQuery.bind(this);
		this.setReference  = this.setReference.bind(this);
		this.mapCenter     = props.mapCenter;
	}

	
	componentDidMount() {
		(() => {
			const mapStash    = this.props.mapStash;
			const shops       = this.props.shops;
			const imageWidth  = 44;
			const imageHeight = 48;
			const image = {
				url: '/img/store-locator/pin.png',
				size:   new google.maps.Size(imageWidth, imageHeight),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(
				imageWidth  / 2,
				imageHeight / 2)
			};
			const mapCenter = this.mapCenter;
			const mapName = 'simple-search';

			mapStash.addMap(mapName, {
				selector: '.simple-search__google-map',
				styles,
				disableDefaultUI: true,
				center: mapCenter,
				zoom: 8
			});

			shops.forEach( shop => {
				mapStash.addSimpleMarker(mapName, {
					position: {lat: shop.lat, lng: shop.lng },
					icon: image,
					title: shop.title,
					zIndex: shop.zIndex
				})
			});
		})();

		this.input.addEventListener('input', () => {
			this.setState({
				error:      false,
				inputQuery: this.input.value
			})
		});

		this.clickOut = (event) => {
			event.stopPropagation();
			if(event.target !== this.input) {
				this.hideDropdown();
			}
		};
		document.addEventListener( 'click', this.clickOut );
	}


	componentWillUnmount() {
		document.removeEventListener('click', this.clickOut)
	}


	checkError() {
		if(this.input.value == '') {
			return this.setState({
				error: true
			});
		}
		this.props.geoClick(this.input.value)
	}


	renderError() {
		if(this.state.error) {
			return <ErrorField phrase='Ce champ doit être rempli'/>
		}
	}


	setReference(name) {
		return (element) => {
			this[name] = element
		}
	}


	showDropdown() {
		this.setState({
			showDropdown: true,
			focusInput: true
		})
	}


	hideDropdown() {
		this.setState({
			showDropdown: false,
			focusInput: false
		})
	}


	setVisibilityClass() {
		return this.state.focusInput ? ' --js-focus' : ''
	}


	setInputQuery(inputQuery) {
		this.setState({ inputQuery, showDropdown: false })
	}



	render() {
		return <div className='simple-search'>
			<div className='simple-search__google-map'></div>
			<div className='simple-search__shadow'></div>
			<h1 className='simple-search__header'>Trouvez le magasin le plus proche de vous</h1>
			<div className='simple-search__form-block'>
				<div className='simple-search__form-block__input'>
					<div className={'simple-search__form-block__input__wrapper' + this.setVisibilityClass()} ref={this.setReference('wrapper')}>
						<input
						     ref={this.setReference('input')}
							 type='text'
							 placeholder='Entrez une adresse'
						     onFocus={this.showDropdown}
							 value={this.state.inputQuery} />
					</div>
					{this.renderError()}
					<Dropdown
					     shops={this.props.shops}
					     query={this.state.inputQuery}
					     setInputQuery={this.setInputQuery}
						 showDropdown={this.state.showDropdown}
					/>
				</div>
				<div className='simple-search__form-block__ou'>ou</div>
				<div className='simple-search__form-block__geo-button' onClick={() => this.props.geoClick() }>
					<span>Géolocalisez-moi</span>
				</div>
				<a className='simple-search__form-block__ok' href="#" onClick={this.checkError}>
					<span>OK</span>
					<span className='simple-search__form-block__ok__shadow --hov-shadow'></span>
				</a>
			</div>
		</div>
	}
}
