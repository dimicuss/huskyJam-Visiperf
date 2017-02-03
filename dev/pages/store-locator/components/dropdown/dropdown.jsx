export default class Dropdown extends React.Component {
	constructor() {
		super();
		this.addressClick = this.addressClick.bind(this)
	}


	addressClick(event) {
		let target = event.target;
		let value;
		if(target.className !== 'dropdown__address') {
			target = target.parentNode;
		}
		value = target.children[0].innerText;
		this.props.setInputQuery(value)
	}


	getShops() {
		if(!this.props.query) {
			return []
		}

		const
			shops = this.props.shops,
			query = this.props.query.trim().toLowerCase(),

			filterFn = shop => {
				return shop.street.toLowerCase().indexOf(query) > -1 ||
					shop.index.toLowerCase().indexOf(query) > -1
			};

		return shops.filter(filterFn).map( (shop, i) => {
			return <li key={i} className='dropdown__address' onClick={this.addressClick}>
				<div className='dropdown__address__street'>{shop.street}</div>
				<div className='dropdown__address__index'>{shop.index}</div>
			</li>
		});
	}


	render() {
		const shops        = this.getShops();
		const showDropdown = this.props.showDropdown;
		if(shops.length) {
			return <ul className={'dropdown' + (showDropdown ? '' : ' --js-hidden')}>
				{shops}
			</ul>
		}
		return <ul className='dropdown --empty'></ul>
	}
}
