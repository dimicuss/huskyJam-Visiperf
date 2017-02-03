import Pin from '../pin/pin.jsx'
import Pancarte from '../pancarte/pancarte.jsx'

export default class PinBlock extends React.Component {
	render() {
		const shop = this.props.shop;
		return <div className="pin-block">
			<Pin number={this.props.number} />
			<Pancarte
				header={shop.pancarte.header}
				imageUrl={shop.pancarte.imageUrl}
				street={shop.pancarte.street}
				index={shop.pancarte.index}
				link={shop.pancarte.link} />
		</div>
	}
}