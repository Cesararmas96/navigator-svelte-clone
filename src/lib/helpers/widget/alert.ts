/* eslint-disable @typescript-eslint/no-explicit-any */
export const actionBtnMap: { [key: string]: (data: any) => any } = {
	postRenderShowWPU(props: Record<string, any>) {
		props.dashboard.update((d) => {
			d.gridItems.forEach((item: any) => {
				if (props.items.includes(item.data.attributes?.title)) {
					item.data.params.hidden = false
				}
			})
			return d
		})
	}
}
