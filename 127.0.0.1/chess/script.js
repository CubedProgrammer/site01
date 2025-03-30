const PAGES = 'pages.txt'
const mkelem = (t) => document.createElement(t)
const req = new XMLHttpRequest()
const maketable = (t) =>
{
	const txtlns = t.split('\n')
	for(const currln of txtlns)
	{
		if(currln.length)
		{
			const values = currln.split(',')
			const tr = mkelem('tr')
			const lcell = mkelem('td')
			const dcell = mkelem('td')
			const link = mkelem('a')
			link.href = values[0]
			link.append(values[0])
			lcell.append(link)
			dcell.append(values[1])
			tr.append(lcell, dcell)
			filebody.append(tr)
		}
	}
}
req.open('GET', PAGES, false)
req.onload = () =>
{
	if(req.readyState === XMLHttpRequest.DONE && req.status === 200)
	{
		maketable(req.responseText)
	}
}
req.send(null)
