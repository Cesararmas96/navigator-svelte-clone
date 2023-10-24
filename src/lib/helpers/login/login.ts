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
		slideshowCarouselData: slideshowUrls.map((url) => ({
			original: url,
			thumbnailClass: 'hidden',
			loading: 'lazy'
		})),
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

export const fetchCompanyData = async (subdomain, urlBase) => {
	//
	const rawData = await fetch(`${urlBase}/api/v1/clients?subdomain_prefix=${subdomain}`)
	const [data] = await rawData.json()
	return data
}

// Import Login methods helpers
export const fetchTotalAuthMethods = async (urlBase) => {
	// Gets all auth methods allowed by Navigator
	const response = await fetch(`${urlBase}/api/v1/auth/methods`)
	return await response.json()
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
