plist = document.getElementById('pagelist')
fbody = document.getElementById('fbody')
arr = Array.from(plist.children)
rc = (arr.length + 3) / 4;
for(let i = 0; i < rc; i++)
{
	var r = document.createElement('tr')
	fbody.append(r);
	for(let j = 0; j < 4; j++)
	{
		var m = arr[i*4+j]
		var c = document.createElement('td')
		if(m)
		{
			var n = m.innerText
			var link = document.createElement('a')
			link.href = n
			link.append(n)
			c.append(link)
		}
		r.append(c)
	}
}
for(var en of elemarr.map(e => e.innerText).entries())
{
	var ind = en[0], n = en[1]
}
