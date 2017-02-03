export default class Pin extends React.Component {
	render() {
		return <div className="pin --js-pancarte-hidden">
			<div className="pin__icon"></div>
			<div className="pin__label">{this.props.number}</div>
		</div>
	}
}