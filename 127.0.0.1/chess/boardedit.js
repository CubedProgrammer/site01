const pieceNames = []
for(const div of [blackpieces, whitepieces])
{
	const children = Array.from(div.children)
	for(const radiob of children)
	{
		const rbLabel = document.createElement('label')
		const img = document.createElement('img')
		img.src = radiob.id + '.svg'
		img.width = 128
		img.height = 128
		rbLabel.className = 'choice'
		rbLabel.append(img, radiob)
		div.append(rbLabel)
		pieceNames.push(radiob.id)
	}
}
for(let i = 0; i < 8; i++)
{
	const row = document.createElement('tr')
	for(let j = 0; j < 8; j++)
	{
		const cell = document.createElement('td')
		for(const name of pieceNames)
		{
			const pieceLabel = document.createElement('label')
			const checkbox = document.createElement('input')
			const image = document.createElement('img')
			checkbox.type = 'checkbox'
			checkbox.name = name + i + j
			image.src = name + '.svg'
			image.width = 96
			image.height = 96
			pieceLabel.className = name
			pieceLabel.append(checkbox, image)
			cell.append(pieceLabel)
		}
		row.append(cell)
	}
	board.append(row)
}