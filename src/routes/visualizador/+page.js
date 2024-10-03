
/** @type {import('./$types').PageLoad} */
export function load({ params }) {
    console.log(params)
	return {
        protocol: 'http',
        serverName: 'localhost',
        port: '5173'
	};
}