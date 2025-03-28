mkelem = (s) => document.createElement(s)
for(i = 0; i < 256; ++i)
{
    r = mkelem('tr')
	for(j = 2; j <= 16; ++j)
	{
		c = mkelem('td')
		c.append(i.toString(j).toUpperCase())
		r.append(c)
	}
	fbody.append(r)
}
act = (e) =>
{
	f = parseInt(fr.value)
	t = parseInt(to.value)
	n = parseInt(inumber.value, f)
	for(; result.lastChild; result.removeChild(result.lastChild));
	result.append(n.toString(t))
}
kact = (e) =>
{
	if(e.keyCode === 13)
	{
		act(e)
	}
}
convert.addEventListener('click', act)
document.addEventListener('keyup', kact)
