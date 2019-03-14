module.exports = function installPlugin (md) {
	const fragment = function (state, silent) {
		const max = state.posMax

		if (state.src[state.pos] !== '%' || state.src[state.pos + 1] !== '(') return false

		let pos = state.pos + 2
		let start = pos
		let openBraces = 0
		while (pos < max) {
			const char = state.src[pos]
			if (char === '(') {
				openBraces++
			}
			if (char === ')') {
				if (openBraces <= 0) break
				openBraces--
			}
			pos++
		}
		const end = pos
		pos++

		if (!silent) {
			state.pos = start
			state.posMax = end

			state.push('fragment_open', 'fragment', 1)
			state.md.inline.tokenize(state)
			state.push('fragment_close', 'fragment', -1)
		}

		state.pos = pos
		state.posMax = max
		return true
	}

	const changeTokenOrder = function (state) {
		for (const [index, token] of state.tokens.entries()) {
			if (token.type === 'inline' && token.children[0].type === 'fragment_open' && token.children[token.children.length - 1].type === 'fragment_close') {
				let previousTokenIndex = index - 1
				let previousToken

				while ((previousToken = state.tokens[previousTokenIndex]).hidden) {
					previousTokenIndex--
				}
				if (previousToken.type === 'list_item_open') {
					const fragmentOpen = token.children[0]
					const fragmentClose = token.children[token.children.length - 1]
					token.children = token.children.slice(1, token.children.length - 1)
					let nextTokenIndex = index + 1
					let nextToken
					while ((nextToken = state.tokens[nextTokenIndex]).type !== 'list_item_close') {
						nextTokenIndex++
					}
					fragmentOpen.level = fragmentClose.level = nextToken.level
					fragmentOpen.block = fragmentClose.block = true
					state.tokens.splice(previousTokenIndex, 0, fragmentOpen)
					state.tokens.splice(nextTokenIndex + 2, 0, fragmentClose)
				}
			}
		}
	}
	md.inline.ruler.before('image', 'fragment', fragment)
	md.core.ruler.after('inline', 'fragment_token_order', changeTokenOrder)
}
