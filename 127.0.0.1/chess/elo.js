act = (e) =>
{
	a = parseInt(eloA.value)
	b = parseInt(eloB.value)
	for(; result.lastChild; result.removeChild(result.lastChild));
	result.append(Math.exp((a-b) * 0.0025 * 2.302585092994046))
}
keyact = (e) =>
{
	if(e.keyCode === 13)
	{
		act(e)
	}
}
calcbutton.addEventListener('click', act)
document.addEventListener('keyup', keyact)
