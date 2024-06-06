export const buildImageUrls = (data, rootLink) => {
	const { branding, slideshow, client, auth_backends: authMethods } = data
	const { favicon, icon, logo_client, logo_home, sidebar } = branding

	const slideshowUrls = slideshow?.map((slide) => `${rootLink}${slide}`) || []
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

export const onCaptchaReady = (event) => {
	console.log('recaptcha init has completed.')
	/*
	 │You can enable your form button here.
	 */
}

export const onCaptchaError = (event) => {
	console.log('recaptcha init has failed.', event)
	/*
	 │Usually due to incorrect siteKey.
	 |Make sure you have the correct siteKey..
	 */
}

export const onCaptchaExpire = (event) => {
	console.log('recaptcha api has expired')
	/*
	 │Normally, you wouldn't need to do anything.
	 │Recaptcha should reinit itself automatically.
	 */
}

export const onCaptchaOpen = (event) => {
	console.log('google decided to challange the user')
	/*
	 │This fires when the puzzle frame pops.
	 */
}

export const onCaptchaClose = (event) => {
	console.log('google decided to challange the user')
	/*
	 │This fires when the puzzle frame closes.
	 │Usually happens when the user clicks outside
	 |the modal frame.
	 */
}
