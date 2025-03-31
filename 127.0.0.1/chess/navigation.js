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
const buildHoverMenu = function(files)
{
	let element = navigationHoverMenu
	let path = ''
	for(const fname of files)
	{
		if(fname.at(-1) === '/')
		{
			const child = document.createElement('div')
			const linkdiv = document.createElement('div')
			const link = document.createElement('a')
			child.className = element === navigationHoverMenu ? 'top' : 'deeper'
			linkdiv.className = 'top'
			link.href = path += fname.substring(0, fname.length-1)
			link.append(path)
			path += '/'
			linkdiv.append(link)
			child.append(linkdiv)
			element.append(child)
			element = child
		}
		else if(fname === '..')
		{
			const ind = path.lastIndexOf('/')
			path = path.substring(0, ind + (ind === -1 ? 1 : -1))
			element = element.parentElement
		}
		else
		{
			const linkdiv = document.createElement('div')
			const link = document.createElement('a')
			link.href = path + fname
			link.append(path + fname)
			linkdiv.className = 'deeper'
			linkdiv.append(link)
			element.append(linkdiv)
		}
	}
}
const main = async function()
{
	if(navigationHoverMenu)
	{
		const pageArray = await getPages()
		if(pageArray)
		{
			buildHoverMenu(pageArray)
		}
	}
}
main()
