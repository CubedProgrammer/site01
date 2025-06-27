let currentChange = 4
const getDistance = function(time, derivatives)
{
	let denominator = 1
	let distance = 0
	derivatives.reverse()
	for(let i = 0; i < derivatives.length; i++)
	{
		denominator *= i + 1
	}
	for(const [i, v] of derivatives.entries())
	{
		distance += v / denominator
		distance *= time
		denominator /= derivatives.length - i
	}
	return distance
}
const addChange = function(e)
{
	const container = document.createElement('div')
	const txt = document.createElement('p')
	const txtbox = document.createElement('input')
	++currentChange
	txt.append('Change Level ' + currentChange)
	txtbox.type = 'text'
	txtbox.className = 'derivative'
	txtbox.value = 0
	container.append(txt, ' ', txtbox)
	boxes.append(container)
}
const displayResult = function(e)
{
	const allboxes = document.getElementsByClassName('derivative')
	const changes = Array.from(allboxes).map((e) => parseFloat(e.value))
	const time = parseFloat(timebox.value)
	for(; result.lastChild; result.removeChild(result.lastChild));
	result.append(getDistance(time, changes))
}
more.addEventListener('click', addChange)
tocalculate.addEventListener('click', displayResult)
