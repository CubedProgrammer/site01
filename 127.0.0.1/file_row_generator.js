output = document.getElementById('output')
ninput = document.getElementById('name')
tinput = document.getElementById('type')
button = document.getElementById('generate')
function gen(e)
{
	r = document.createElement('tr')
	namecell = document.createElement('td')
	typecell = document.createElement('td')
	link = document.createElement('a')
	link.href = ninput.value
	link.append(ninput.value)
	namecell.append(link)
	typecell.append(tinput.value)
	r.append(namecell)
	r.append(typecell)
	output.append(r.outerHTML)
}
button.addEventListener('click', gen)
