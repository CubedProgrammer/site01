function toExp(x)
{
	if(x < 17)
	{
		return x * (x + 6);
	}
	else if(x < 32)
	{
		return(5 * x * x - 81 * x + 720) / 2;
	}
	else
	{
		return(9 * x * x - 325 * x + 4440) / 2;
	}
}
function fromExp(x)
{
	if(x < 352)
	{
		return Math.sqrt(9 + x) - 3;
	}
	else if(x < 1507)
	{
		return(Math.sqrt(40 * x - 7839) + 81) / 10;
	}
	else
	{
		return(Math.sqrt(40 * x - 54215) + 81) / 18;
	}
}
function toExpEvent(e)
{
	expi.value = toExp(parseInt(lvli.value));
}
function fromExpEvent(e)
{
	lvli.value = Math.floor(fromExp(parseInt(expi.value)));
}
fromlevel.addEventListener('click', toExpEvent);
tolevel.addEventListener('click', fromExpEvent);
