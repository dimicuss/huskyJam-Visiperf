import 'babel-polyfill';
import SimpleSearch from './components/simple-search/simple-search.jsx'
import GeoSearch    from './components/geo-search/geo-search.jsx'
import { GoogleInterface } from './components/google-map/google-map.jsx'
import './classExtensions.jsx'


const shops = [
	{
		street: 'Some street 1',
		index: 'Some index 1',
		director: 'Some Name 1',
		email: 'some@mail.fr 1',
		open: {
			from: '11:20',
			to:   '22:33'
		},
		telephone: '12 34 56 78 90 10 1',
		title: 'Title 1',
		zIndex: 0,
		lat: 45.139697,
		lng: -0.274255,
		link: '#',
		pancarte: {
			header: 'Some header',
			imageUrl:  'img/store-locator/shop.jpg',
			street: 'Some street',
			index: 'some index',
			link:  '#'
		}
	},
	{
		street: 'Some street 2',
		index: 'Some index 2',
		director: 'Some Name 2',
		email: 'some@mail.fr 2',
		open: {
			from: '11:20',
			to:   '22:30'
		},
		telephone: '12 34 56 78 90 10 2',
		title: 'Title 2',
		zIndex: 0,
		lat: 45.321852,
		lng: -1.053209,
		link: '#',
		pancarte: {
			header: 'Some header',
			imageUrl:  'img/store-locator/shop.jpg',
			street: 'Some street',
			index: 'some index',
			link:  '#'
		}
	},
	{
		street: 'Some street 3',
		index: 'Some index',
		director: 'Some Name 3',
		email: 'some@mail.fr 3',
		open: {
			from: '11:20',
			to:   '22:30'
		},
		telephone: '12 34 56 78 90 10 3',
		title: 'Title',
		zIndex: 0,
		lat: 45.440981,
		lng: -0.948839,
		link: '#',
		pancarte: {
			header: 'Some header',
			imageUrl:  'img/store-locator/shop.jpg',
			street: 'Some street',
			index: 'some index',
			link:  '#'
		}
	},
	{
		street: 'Some street 4',
		index: 'Some index',
		director: 'Some Name 4',
		email: 'some@mail.fr 4',
		open: {
			from: '11:20',
			to:   '22:30'
		},
		telephone: '12 34 56 78 90 10 4',
		title: 'Title',
		zIndex: 0,
		lat: 45.540921,
		lng: -0.948839,
		link: '#',
		pancarte: {
			header: 'Some header',
			imageUrl:  'img/store-locator/shop.jpg',
			street: 'Some street',
			index: 'some index',
			link:  '#'
		}
	},
	{
		street: 'Some street 5',
		index: 'Some index',
		director: 'Some Name 5',
		email: 'some@mail.fr 5',
		open: {
			from: '11:20',
			to:   '22:30'
		},
		telephone: '12 34 56 78 90 10 3',
		title: 'Title',
		zIndex: 0,
		lat: 45.641091,
		lng: -0.948839,
		link: '#',
		pancarte: {
			header: 'Some header',
			imageUrl:  'img/store-locator/shop.jpg',
			street: 'Some street',
			index: 'some index',
			link:  '#'
		}
	},
	{
		street: 'Some street 6',
		index: 'Some index',
		director: 'Some Name 6',
		email: 'some@mail.fr 6',
		open: {
			from: '11:20',
			to:   '22:30'
		},
		telephone: '12 34 56 78 90 10 3',
		title: 'Title',
		zIndex: 0,
		lat: 45.341131,
		lng: -0.948839,
		link: '#',
		pancarte: {
			header: 'Some header',
			imageUrl:  'img/store-locator/shop.jpg',
			street: 'Some street',
			index: 'some index',
			link:  '#'
		}
	}
];



function StoreLocatorRoot(options) {
	return <main className='store-locator-main'>
		{options.children}
	</main>
}



class StoreLocator extends React.Component {
	constructor(props) {
		super();
		this.state = {
			simpleSearch: true
		};
		this.geoClick  = this.geoClick.bind( this );
		this.google    = props.google;
		this.mapCenter = new props.google.maps.LatLng({
			lat: 46.1923845,
			lng: -0.4396394
		});
	}


	renderSearch() {
		if (this.state.simpleSearch) {
			return <SimpleSearch
				geoClick={this.geoClick}
				shops={this.props.shops}
				mapStash={this.props.mapStash}
				mapCenter={this.mapCenter}/>;
		}
		return <GeoSearch
			address={this.state.address}
			shops={this.props.shops}
			google={this.google}
			mapStash={this.props.mapStash}
			mapCenter={this.mapCenter}/>;
	}


	geoClick(address) {
		this.setState( {
			simpleSearch: false,
			address
		})
	}


	render() {
		return <StoreLocatorRoot>
			{this.renderSearch()}
		</StoreLocatorRoot>
	}
}



GoogleInterface().then( ({ google, mapStash }) => {
	ReactDOM.render(
	<StoreLocator shops={shops} google={google} mapStash={mapStash}/>,
	document.querySelector('#react-entry'));
});



