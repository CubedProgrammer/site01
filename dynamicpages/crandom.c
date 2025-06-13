#include<netinet/in.h>
#include<stdint.h>
#include<stdlib.h>
#include<string.h>
#include<sys/random.h>
#include<time.h>
#include<unistd.h>
void fillrandom(void*data, size_t size)
{
	static char unsigned buf[256];
	static size_t ind = 0;
	static size_t cnt = 0;
	if(ind != cnt)
	{
		size_t fill = size > cnt - ind ? cnt - ind : size;
		memcpy(data, buf, fill);
		size -= fill;
		ind += fill;
		data += fill;
	}
	if(size)
	{
		if(size >= sizeof(buf))
		{
			getrandom(data, size, 0);
		}
		else
		{
			cnt = getrandom(buf, sizeof(buf), 0);
			memcpy(data, buf, size);
			ind += size;
		}
	}
}
int crandom(char*start, int c)
{
	int failed = 0;
	char buf[8192];
	uint16_t cnt;
	if(*start == '\0')
	{
		cnt = time(NULL) & 0xff;
		cnt += (cnt == 0) << 8;
	}
	else
	{
		cnt = atoi(start + 1) & 0x1fff;
		cnt += (cnt == 0) << 13;
	}
	fillrandom(buf, cnt);
	for(uint16_t i=0;i<cnt;++i)
	{
		buf[i] &= 0x7f;
		if(buf[i] < 32)
		{
			buf[i] += 32;
		}
		else if(buf[i] == 127)
		{
			buf[i] = '\n';
		}
	}
	uint32_t writesize = cnt;
	writesize = htonl(writesize);
	char meta[5];
	meta[0] = 'F';
	memcpy(meta + 1, &writesize, sizeof(writesize));
	size_t wcnt = write(c, meta, sizeof(meta)) + write(c, buf, cnt);
	failed = wcnt < 0;
	if(!failed)
	{
		close(c);
	}
	return failed;
}
