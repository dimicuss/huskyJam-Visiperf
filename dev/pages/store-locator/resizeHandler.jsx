export function between(min, max, cb, orientation) {
	const query = `(min-width: ${min}px) and (max-width: ${max}px) and (orientation: ${orientation})`;
	const mq = matchMedia(query);
	cb(mq.matches);
	mq.addListener( mq => cb(mq.matches) )
}