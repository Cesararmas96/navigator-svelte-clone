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

export const buildImageUrls = (data, rootLink) => {
	const { branding, slideshow, client, auth_backends: authMethods } = data
	const { favicon, icon, logo_client, logo_home, sidebar } = branding

	const slideshowUrls = slideshow.map((slide) => `${rootLink}${slide}`)
	const favIconUrl = `${rootLink}${favicon}`
	const iconUrl = `${rootLink}${icon}`
	const logoClientUrl = `${rootLink}${logo_client}`
	const logoHomeUrl = `${rootLink}${logo_home}`
	const sidebarUrl = `${rootLink}${sidebar}`

	return {
		slideshowCarouselData: slideshowUrls,
		client,
		authMethods,
		favIconUrl,
		iconUrl,
		logoClientUrl,
		logoHomeUrl,
		sidebarUrl,
		slideshow: slideshowUrls
	}
}

export const filterAuthMethods = (totalAuthMethods, authMethods) => {
	// Checks if the auth method is supported by the client
	return Object.fromEntries(
		Object.entries(totalAuthMethods).filter(([key]) => authMethods.includes(key))
	)
}

export const removeBasicAuth = (authMethods) => {
	// Removes BasicAuth method, as it is applied by default
	delete authMethods.BasicAuth
	return authMethods
}
