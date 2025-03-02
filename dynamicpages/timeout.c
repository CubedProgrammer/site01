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
int timeout(struct eventqueue*q, int c, const char*sarg)
{
	int failed = 0;
	char*remaining;
	unsigned char cnt = *sarg == '\0' ? 1 : strtoul(sarg + 1, &remaining, 10) & 0xff;
	printf("%u %s\n", cnt, sarg);
	if(cnt)
	{
		struct tcdat*info = malloc(sizeof(struct tcdat));
		failed = info == NULL;
		if(!failed)
		{
			info->buf = malloc(remaining - sarg);
			if(info->buf != NULL)
			{
				time_t curr = time(NULL);
				info->client = c;
				info->size = remaining - sarg;
				((char*)info->buf)[0] = 'F';
				memcpy(info->buf + 1, sarg + 1, remaining - sarg - 1);
				failed = addEvent(q, curr + cnt, timeoutCallback, info);
				if(failed)
				{
					free(info->buf);
					free(info);
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
