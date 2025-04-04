thislink.append(location.href)
target = null
visitlink = (e) =>
{
	target ??= destination.value
	setTimeout(() => location.href = target, 2000)
}
go.addEventListener('click', visitlink)
