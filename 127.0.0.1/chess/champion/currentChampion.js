year = new Date().getFullYear()
if(reigning.children.length === 0)
{
	reigning.innerText += '-' + year
}
else
{
	reigning.lastElementChild.innerText += '-' + year
}
