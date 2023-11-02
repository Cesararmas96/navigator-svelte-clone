export function filterPrograms(programs, allowedSlugs) {
	/**
	 * Filters an array of programs by allowed program slugs.
	 *
	 * @param {Array} programs - Array of program objects
	 * @param {Array} allowedSlugs - Array of allowed program slug strings
	 *
	 * @returns {Array} Filtered array of allowed program objects
	 */

	return programs.filter((program) => {
		return allowedSlugs.includes(program.program_slug)
	})
}

export function sortPrograms(programs) {
	/**
	 * Sorts an array of program objects alphabetically by name.
	 *
	 * @param {Array} programs - Array of program objects
	 *
	 * @returns {Array} Sorted array of program objects
	 */

	return programs.slice().sort((a, b) => {
		return a.program_name.localeCompare(b.program_name)
	})
}
