const URL = "navigation.txt"
const getPages = async function()
{
	const response = await fetch(URL)
	if(response.ok)
	{
		const responseText = await response.text()
		const fileArray = responseText.split('\n')
		fileArray.pop()
		return fileArray
	}
	else
	{
		return null;
	}
}
const buildMenu = function(files, element, callback)
{
	let path = ''
	for(const fname of files)
	{
		if(fname === '..')
		{
			const ind = path.lastIndexOf('/')
			path = path.substring(0, ind + (ind === -1 ? 1 : 0))
			element = element.parentElement.parentElement
		}
		else
		{
			const isDirectory = fname.at(-1) === '/'
			if(isDirectory)
			{
				if(path.length)
				{
					path += '/'
				}
				path += fname.substring(0, fname.length-1)
			}
			element = callback(element, path + (isDirectory || path.length === 0 ? '' : '/'), isDirectory ? '' : fname)
		}
	}
}
const buildHoverMenu = function(files)
{
	const callback = function(e, p, d)
	{
		const linkdiv = document.createElement('div')
		const link = document.createElement('a')
		linkdiv.className = 'top'
		link.href = p + d
		link.append(p + d)
		linkdiv.append(link)
		if(d.length === 0)
		{
			const child = document.createElement('div')
			child.className = 'deeper'
			child.append(linkdiv)
			e.append(child)
			e = child
		}
		else
		{
			e.append(linkdiv)
		}
		return e
	}
	buildMenu(files, navigationHoverMenu, callback)
}
const buildToggleMenu = function(files)
{
	const addDirectory = function(parent, name, target)
	{
		const rootDiv = document.createElement('div')
		const label = document.createElement('label')
		const checkbox = document.createElement('input')
		const linkParent = document.createElement('div')
		const link = document.createElement('a')
		const plus = document.createElement('p')
		const minus = document.createElement('p')
		rootDiv.className = 'top'
		checkbox.type = 'checkbox'
		plus.className = 'plus'
		plus.append('+')
		minus.className = 'minus'
		minus.append('-')
		link.href = target
		link.append(name)
		linkParent.className = 'linkParent'
		linkParent.append(link)
		label.append(checkbox, plus, minus, linkParent)
		rootDiv.append(label)
		parent.append(rootDiv)
		return rootDiv
	}
	const callback = function(e, p, d)
	{
		const target = p + d
		if(d.length === 0)
		{
			const linkdiv = addDirectory(e, target, target)
			e.firstChild.append(linkdiv)
			return linkdiv
		}
		else
		{
			const linkdiv = document.createElement('div')
			const link = document.createElement('a')
			linkdiv.className = 'deeper'
			link.href = p + d
			link.append(p + d)
			linkdiv.append(link)
			e.firstChild.append(linkdiv)
			return e
		}
	}
	const r = addDirectory(navigationToggleMenu, '/', 'index.html')
	buildMenu(files, r, callback)
}
const main = async function()
{
	let pageArray = null
	if(navigationHoverMenu)
	{
		pageArray = await getPages()
		if(pageArray)
		{
			//buildHoverMenu(pageArray)
		}
	}
	if(navigationToggleMenu)
	{
		pageArray ??= await getPages()
		if(pageArray)
		{
			buildToggleMenu(pageArray)
		}
	}
}
main()
