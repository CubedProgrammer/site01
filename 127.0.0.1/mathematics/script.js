plist = pagelist
mkelem = (t) => document.createElement(t)
arr = Array.from(plist.children)
rc = Math.floor((arr.length + 6) / 8)
for(let i = 0; i < rc; i++)
{
	var r = mkelem('tr')
	fbody.append(r);
	for(let j = 0; j < 4; j++)
	{
		var k = i*4+j
		var m = arr[k*2]
		var c = mkelem('td')
		if(m)
		{
			var n = m.innerText
			var d = arr[k*2+1].innerText
			var link = mkelem('a')
			var desc = mkelem('div')
			desc.className = 'description'
			desc.append(d)
			link.href = n
			link.append(n)
			c.append(link)
			c.append(desc)
		}
		r.append(c)
	}
}
