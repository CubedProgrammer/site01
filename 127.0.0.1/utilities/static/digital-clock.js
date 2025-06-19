const padText = function(n)
{
	const m = n.toString()
	return m.length < 2 ? '0' + m : m;
}
const clearElement = function(elem)
{
	for(; elem.lastChild; elem.removeChild(elem.lastChild));
}
const displayTime = function()
{
	const currentMillis = Date.now()
	const current = Math.floor(currentMillis / 1000)
	const second = current % 60, minute = Math.floor(current / 60) % 60, hour = Math.floor(current / 3600) % 24
	const text = padText(hour) + ':' + padText(minute) + ':' + padText(second)
	clearElement(timetext)
	timetext.append(text)
	const remaining = 1000 - Date.now() % 1000
	setTimeout(displayTime, remaining)
}
displayTime()
