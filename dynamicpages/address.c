#include<arpa/inet.h>
#include<stdint.h>
#include<stdio.h>
#include<string.h>
#include<unistd.h>
int address(int c, uint32_t a)
{
	char cbuf[21];
	uint32_t cnt = sprintf(cbuf + 1 + sizeof(uint32_t), "%u.%u.%u.%u", a >> 24 & 0xff, a >> 16 & 0xff, a >> 8 & 0xff, a & 0xff);
	union
	{
		uint32_t i;
		char b[sizeof(uint32_t)];
	}dummy;
	dummy.i = htonl(cnt);
	cbuf[0] = 'F';
	memcpy(cbuf + 1, dummy.b, sizeof(uint32_t));
	int failed = write(c, cbuf, cnt + 1 + sizeof(uint32_t)) <= 0;
	if(!failed)
	{
		close(c);
	}
	return failed;
}
