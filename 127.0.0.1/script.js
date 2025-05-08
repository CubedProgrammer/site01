var getById = (id) => document.getElementById(id)
var ftable = getById('filetable')
var db = getById('detail'), gb = getById('grid'), rb = getById('reverse')
var snb = getById('sortname'), stb = getById('sorttype')
var ftc = ftable.children
var strcmp = (a, b) => a > b ? 1 : a < b ? -1 : 0
var mkelem = (t) => document.createElement(t)
var ael = (n, e, f) => n.addEventListener(e, f)
var rebuild = () =>
{
	var f = ftc.item(0).className === 'detailtable' ? ondetail : ongrid
	files = fixed.concat(movable)
	f()
}
var layout = (f, c) =>
{
	ftable.removeChild(ftc.item(0))
	var b = mkelem('tbody')
	b.className = c
	f(b)
	ftable.append(b)
}
var dlayout = (b) =>
{
	for(var f of files)
	{
		var r = mkelem('tr'), n = mkelem('td'), t = mkelem('td'), l = mkelem('a')
		l.href = f.name
		l.append(f.name)
		n.append(l)
		t.append(f.type)
		r.append(n)
		r.append(t)
		b.append(r)
	}
}
var glayout = (b) =>
{
	for(var i = 0; i < files.length; i += 4)
	{
		var r = mkelem('tr')
		for(var f of files.slice(i, i + 4))
		{
			var c = mkelem('td')
			var l = mkelem('a')
			l.href = f.name;
			l.append(f.name);
			if(f.type[0] !== 'R')
			{
				c.className = f.type[0] + 'cell'
			}
			c.append(l)
			r.append(c)
		}
		b.append(r)
	}
}
var ondetail = (e) => layout(dlayout, 'detailtable')
var ongrid = (e) => layout(glayout, "gridtable")
var onreverse = (e) =>
{
	movable.reverse()
	rebuild()
}
var sortfiles = (f) =>
{
	movable.sort((a, b) => strcmp(f(a), f(b)))
	rebuild()
}
var onsortname = (e) => sortfiles(n => n.name)
var onsorttype = (e) => sortfiles(n => n.type)
var onvisit = (e) => open(urlbox.value)
var filemap = (r) => {return{name: r.children.item(0).children.item(0).innerText, type: r.children.item(1).innerText}}
var temp = Array.from(ftc.item(0).children).map(filemap)
var files = Array.from(temp)
var fixed = files.slice(0, 3)
var movable = files.slice(3)
ael(db, 'click', ondetail)
ael(gb, 'click', ongrid)
ael(rb, 'click', onreverse)
ael(snb, 'click', onsortname)
ael(stb, 'click', onsorttype)
ael(urlbutton, 'click', onvisit)
