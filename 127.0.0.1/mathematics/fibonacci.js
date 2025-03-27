mkelem = (s) => document.createElement(s)
a = 1
b = 2
i = 3
while(b <= 9007199254740991)
{
    r = mkelem('tr')
	c1 = mkelem('td')
	c2 = mkelem('td')
	c1.append(i)
	c2.append(b)
	r.append(c1, c2)
	fbody.append(r)
	++i
	c = a+b
	a = b, b = c
}
