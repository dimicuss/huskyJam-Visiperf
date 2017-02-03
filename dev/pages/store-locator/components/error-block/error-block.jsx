export default class ErrorBlock extends React.Component {
	render() {
		return <div className="error-block">
			<p className="error-block__p">{this.props.message}</p>
		</div>
	}
}