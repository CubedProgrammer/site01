mkelem = (s) => document.createElement(s)
for(i = 2; i < 11; ++i)
{
    r = mkelem('tr')
	c1 = mkelem('td')
	c2 = mkelem('td')
	c1.append(i)
	c2.append(Math.sqrt(i)-1)
	c2.className = 'bigcolumn'
	r.append(c1, c2)
	radii.append(r)
}
