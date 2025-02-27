names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
button = document.getElementById('compute')
iyear = document.getElementById('year')
imonth = document.getElementById('month')
iday = document.getElementById('day')
out = document.getElementById('result')
act = (e) =>
{
	d = new Date(iyear.value, imonth.value - 1, iday.value).getUTCDay()
	out.innerText = names[d]
}
button.addEventListener('click', act)
document.addEventListener('keyrelease', (e) => {
	if(e.keyCode === 13)
		act(e)
})
