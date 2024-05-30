import * as echarts from 'echarts'

export async function fetchDarkMode() {
	return fetch(`/mock/echarts-theme-dark.json`)
		.then((r) => r.json())
		.then((theme) => {
			echarts.registerTheme('dark', theme)
			return { colorFrom: theme.color[0], colorTo: theme.color[3] }
		})
}

export async function fetchThemeColor(color: string) {
	return fetch(`/mock/echarts-theme-${color}.json`)
		.then((r) => r.json())
		.then((theme) => {
			echarts.registerTheme(color, theme)
			return { colorFrom: theme.color[0], colorTo: theme.color[3] }
		})
}
