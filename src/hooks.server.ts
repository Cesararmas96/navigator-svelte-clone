
// export const handle = async ({ event, resolve }) => {
//   if (!('theme-mode' in localStorage)) localStorage.set('theme-mode', 'light')
//   if (!('theme-color' in localStorage)) localStorage.set('theme-color', 'blue')

//   const mode = event.cookies.get('theme-mode')!
//   const color = event.cookies.get('theme-color')!

//   event.locals.theme = { mode, color }

//   return resolve(event, {
//     transformPageChunk: ({html}) => 
//       html.replace('%theme-mode%', mode!).replace('%theme-color%', color!).replace('%class-mode%', mode!)
//   })
// }