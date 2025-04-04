#include<arpa/inet.h>
#include<stdint.h>
#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<unistd.h>
#include"eventloop.h"
struct tcdat
{
	int client;
	void*buf;
	size_t size;
};
void timeoutCallback(void*arg)
{
	struct tcdat*d = arg;
	write(d->client, d->buf, d->size);
	free(d->buf);
	close(d->client);
	free(arg);
}
int timeout(void*dat, struct eventqueue*q, int c, const char*sarg)
{
	int failed = 0;
	char*remaining;
	unsigned char cnt = *sarg == '\0' ? 1 : strtoul(sarg + 1, &remaining, 10) & 0xff;
	union
	{
		uint32_t len;
		char bytes[4];
	}dummy;
	if(*sarg == '\0')
	{
		char message[] = "F    Given a file name, parses it into a number N in base ten, waits N seconds before responding.";
		uint32_t len = sizeof(message) - 1;
		dummy.len = htonl(len);
		memcpy(message + 1, dummy.bytes, sizeof(uint32_t));
		write(c, message, len);
		close(c);
		free(dat);
	}
	else if(cnt)
	{
		struct tcdat*info = malloc(sizeof(struct tcdat));
		failed = info == NULL;
		if(!failed)
		{
			size_t sz = sizeof(uint32_t);
			dummy.len = remaining - sarg - 1;
			dummy.len = htonl(dummy.len);
			info->buf = malloc(remaining - sarg + sz);
			if(info->buf != NULL)
			{
				time_t curr = time(NULL);
				info->client = c;
				info->size = remaining - sarg + sz;
				((char*)info->buf)[0] = 'F';
				memcpy(info->buf + 1, dummy.bytes, sz);
				memcpy(info->buf + 5, sarg + 1, remaining - sarg - 1);
				failed = addEvent(q, curr + cnt, timeoutCallback, info);
				if(failed)
				{
					free(info->buf);
					free(info);
				}
				else
				{
					free(dat);
				}
			}
			else
			{
				free(info);
				failed = 1;
			}
		}
	}
	else
	{
		failed = 1;
	}
	return failed;
}
