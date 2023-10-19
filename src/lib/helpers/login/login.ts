export function extractSubdomain() {
	// 	Gets the subdomain from the URL
	const url = window.location.origin
	const subdomainMatch = url.match(/\/\/([^\/.]+)\./)

	if (subdomainMatch && subdomainMatch[1]) {
		return subdomainMatch[1]
	} else {
		return null
	}
}
