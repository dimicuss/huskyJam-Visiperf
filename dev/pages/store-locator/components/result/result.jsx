class Search extends React.Component {
	componentDidMount() {
		const onEnd    = this.props.onEnd;
		const input    = $( this.textInput );
		const searchCb = this.props.searchCb;
		const searchFocusOut     = this.props.searchFocusOut;
		const getAddressLocation = this.props.getAddressLocation;
		let timeout;
		input.focusout( searchFocusOut );
		input.focus();

		input.bind( 'input', () => {
			if (timeout) {
				clearTimeout( timeout )
			}
			timeout = setTimeout( () => {
				const address = input.val();
				searchCb( getAddressLocation( address ), () => {
					this.props.dropShopSelection();
					onEnd()
				})
			}, 2000 )
		});
	}


	render() {
		return <div className='results__search'>
			<input
				type='text'
				className='results__search__input inline'
				placeholder='Entrez une adresse....'
				ref={ input => this.textInput = input } />
			<div className='results__search__loupe inline'></div>
		</div>
	}
}



export default class Results extends React.Component {
	constructor() {
		super();
		this.state = {
			search: false
		};
		this.onEnd          = this.onEnd.bind(this);
		this.getText        = this.getText.bind(this);
		this.buttonClick    = this.buttonClick.bind(this);
		this.searchFocusOut = this.searchFocusOut.bind(this)
	}


	buttonClick() {
		this.setState({
			search: !this.state.search
		})
	}


	getText() {
		const count = this.props.count;
		return <div className='results__result'>
			<div className='results__result__text'>
				<div className='results__result__text__header'>{`${count} Résultats pour`}</div>
				<p className='results__result__text__address'>{this.props.address}</p>
			</div>
			<div className='results__result__button' onClick={this.buttonClick}></div>
		</div>
	}


	searchFocusOut(cb) {
		if(typeof(cb) == 'function') {
			this.setState({
				search: false
			}, cb);
		} else {
			this.setState({
				search: false
			});
		}

	}


	onEnd() {
		this.searchFocusOut(() => {
			this.props.onEnd();
		});
	}


	getPart() {
		if(this.state.search) {
			return <Search
				onEnd={this.onEnd}
				searchCb={this.props.searchCb}
				getAddressLocation={this.props.getAddressLocation}
				searchFocusOut={this.searchFocusOut}
				dropShopSelection={this.props.dropShopSelection}
			/>
		}
		return this.getText()
	}


	render() {
		return <div className='results clearfix' ref={result => this.domRef = result} >
			{this.getPart()}
		</div>
	}
}
