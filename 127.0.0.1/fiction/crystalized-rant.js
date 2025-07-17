const loadParas = function(arr)
{
	for(const p of arr)
	{
		const para = document.createElement('p')
		para.append(p)
		maincont.append(para)
	}
}
const loadEps = function(dat)
{
	const epdat = dat.split('\n\n')
	for(const ep of epdat)
	{
		const ps = ep.split('\n')
		const title = ps[0]
		const titleelem = document.createElement('p')
		titleelem.id = 'ep' + title.substring(0, 3)
		titleelem.className = 'subtitle'
		titleelem.append(title)
		maincont.append(titleelem)
		loadParas(ps.slice(1))
		const linkelem = document.createElement('a')
		linkelem.href = '#ep' + title.substring(0, 3)
		linkelem.append(title.substring(5))
		contents.append(linkelem)
	}
}
const main = async function()
{
	const resp = await fetch('crystalized-rant.txt')
	if(resp.ok)
	{
		const txt = await resp.text()
		const first = txt.indexOf('\n\n')
		const over = txt.substring(0, first)
		const episodes = txt.substring(first + 2)
		const overps = over.split('\n')
		loadParas(overps)
		loadEps(episodes)
	}
}
main();
