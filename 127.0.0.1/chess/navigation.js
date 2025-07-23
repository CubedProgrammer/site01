const URL = navigationEntryFile.innerText.toString()
const BASE_DIRECTORY = navigationBaseDirectory.innerText.toString()
const current = location.href.substring(location.origin.length + (BASE_DIRECTORY.length === 0 ? 7 : BASE_DIRECTORY.length))
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
			element = element.parentElement
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
		const target = p + d
		const linkdiv = document.createElement('div')
		const child = document.createElement('div')
		const link = document.createElement('a')
		linkdiv.className = 'top'
		link.href = BASE_DIRECTORY + target
		link.append(target.substring(target.lastIndexOf('/')+1))
		linkdiv.append(link)
		child.className = 'deeper'
		e.append(linkdiv, child)
		if(d.length === 0)
		{
			e = child
		}
		return e
	}
	buildMenu(files, navigationHoverMenu, callback)
}
const buildToggleMenu = function(files)
{
	i = 0
	const addDirectory = function(parent, name, target, index)
	{
		const rootDiv = document.createElement('div')
		const label = document.createElement('label')
		const checkbox = document.createElement('input')
		const labelParent = document.createElement('div')
		const link = document.createElement('a')
		const plus = document.createElement('p')
		const minus = document.createElement('p')
		const oldname = name
		if(name.length > 1)
		{
			name = name.substring(name.lastIndexOf('/')+1)
		}
		rootDiv.className = 'top'
		checkbox.type = 'checkbox'
		checkbox.id = 'togglebox' + index
		checkbox.checked = oldname.length < 2 || current.startsWith(oldname)
		label.htmlFor = checkbox.id
		plus.className = 'plus'
		plus.append('+')
		minus.className = 'minus'
		minus.append('-')
		link.href = BASE_DIRECTORY + target
		link.append(name)
		label.append(plus, minus)
		labelParent.className = 'labelParent'
		labelParent.append(label)
		rootDiv.append(checkbox, labelParent, link)
		parent.append(rootDiv)
		return rootDiv
	}
	const callback = function(e, p, d)
	{
		const target = p + d
		if(d.length === 0)
		{
			const linkdiv = addDirectory(e, target, target, i++)
			e.append(linkdiv)
			return linkdiv
		}
		else
		{
			const linkdiv = document.createElement('div')
			const link = document.createElement('a')
			const space = document.createElement('p')
			linkdiv.className = 'deeper'
			space.append('+')
			link.href = BASE_DIRECTORY + target
			link.append(d)
			linkdiv.append(space, link)
			e.append(linkdiv)
			return e
		}
	}
	const r = addDirectory(navigationToggleMenu, '/', 'index.html', i++)
	buildMenu(files, r, callback)
}
const main = async function()
{
	let pageArray = null
	if(document.getElementById('navigationHoverMenu'))
	{
		pageArray = await getPages()
		if(pageArray)
		{
			buildHoverMenu(pageArray)
		}
	}
	if(document.getElementById('navigationToggleMenu'))
	{
		pageArray ??= await getPages()
		if(pageArray)
		{
			buildToggleMenu(pageArray)
		}
	}
}
main()
