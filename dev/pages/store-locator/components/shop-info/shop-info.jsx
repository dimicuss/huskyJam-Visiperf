export default class ShopInfo extends React.Component {
	isOpened(shop) {
		const from = shop.open.from;
		const to   = shop.open.to;
		const open = (() => {
			const now        = getUtcMinutes();
			const fromParsed = (parseInt(from.split(':')[0]) - 1) * 60 + parseInt(from.split(':')[1]);
			const toParsed   = (parseInt(to.split(':')[0])   - 1) * 60 + parseInt(to.split(':')[1]);
			
			return (fromParsed <= now) && (now <= toParsed)
		})();

		if(open) {
			return <div className='shop-info__info__open'>Ouvert en ce moment</div>
		}
		return <div className='shop-info__info__closed'>Fermé en ce moment</div>
	}


	render() {
		const shop = this.props.shop;
		const RenderPair = this.RenderPair;
		return <div className='shop-info'
					onClick={this.props.onClick}>
			<div className="shop-info__km">{shop.km}</div>
			<div className='shop-info__column --first'>
				<div className='shop-info__label'>
					<div className='shop-info__label__logo'>
						<img className='shop-info__label__logo__img' src='img/logo.png' alt='Logo not found'/>
					</div>
					<div className='shop-info__label__counter'>{this.props.number}</div>
				</div>
			</div>

			<div className='shop-info__column'>
				<div className='shop-info__info'>
					<div className='shop-info__info__head --blue'>{shop.title}</div>
					{this.isOpened( shop )}
					<div className='shop-info__info__street-house'>{shop.street}</div>
					<div className='shop-info__info__index-city'>{shop.index}</div>
				</div>
			</div>

			<div className='shop-info__column'>
				<div className='shop-info__telephone'>
					<div className='shop-info__telephone__head'>Téléphone</div>
					<span>{shop.telephone}</span>
				</div>
			</div>

			<div className='shop-info__column'>
				<div className='shop-info__director'>
					<div className='shop-info__director__head'>Nom du Franchisé</div>
					<span>{shop.director}</span>
				</div>
			</div>


			<div className='shop-info__column'>
				<div className='shop-info__mail'>
					<div className='shop-info__mail__head'>E-mail</div>
					<span>{shop.email}</span>
				</div>
			</div>

			<div className='shop-info__column --right'>
				<a className='shop-info__link' href={shop.link}>
					<span className='shop-info__link__text'>Site</span>

					<div className='shop-info__link__background --blue'></div>
					<div className='shop-info__link__background --dark'></div>
				</a>
			</div>
		</div>
	}
}


function getUtcMinutes() {
	const now = new Date();
	const nowUtc = new Date(
		now.getUTCFullYear(),
		now.getUTCMonth(),
		now.getUTCDate(),
		now.getUTCHours(),
		now.getUTCMinutes(),
		now.getUTCSeconds());

	return (nowUtc.getHours() * 60) + nowUtc.getMinutes()
}