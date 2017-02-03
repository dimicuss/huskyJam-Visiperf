export default class Pancarte extends React.Component {
	render () {
		const
		props = this.props,
		imageAlt = `Image not found. URL="${props.imageUrl}"`;

		return <div className="pancarte">
			<div className="pancarte__header">
				<span className="pancarte__header__text">{props.header}</span>
			</div>
			<div className="pancarte__container">
				<img className="pancarte__container__image" src={props.imageUrl} alt={imageAlt}/>

				<p className="pancarte__container__description">
					<span>{props.street}</span>
					<span>{props.index}</span>
				</p>
				<a className='pancarte__container__link' href={props.link}>
					<span className='pancarte__container__link__text'>Site</span>

					<div className='pancarte__container__link__background --blue'></div>
					<div className='pancarte__container__link__background --dark'></div>
				</a>
			</div>
		</div>
	}
}