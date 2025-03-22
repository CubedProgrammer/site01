#include<arpa/inet.h>
#include<stdint.h>
#include<stdio.h>
#include<stdlib.h>
#include<sys/select.h>
#include<sys/socket.h>
#include<sys/un.h>
#include<unistd.h>
#include"eventloop.h"
#include"redirect.h"
#include"timeout.h"
int makesock(struct sockaddr_un*addr)
{
	int s = socket(AF_UNIX, SOCK_STREAM, 0);
	if(s > 0)
	{
		addr->sun_family = AF_UNIX;
		strcpy(addr->sun_path, "dynamic");
		if(bind(s, (struct sockaddr*)addr, sizeof(*addr)) + listen(s, 3) != 0)
		{
			close(s);
			s = -1;
		}
	}
	return s;
}
void handle(struct eventqueue*eq, int c)
{
	uint32_t len;
	char fail = 1;
	size_t bc = read(c, &len, sizeof(len));
	if(bc == 4)
	{
		len = ntohl(len);
		void*data = malloc(len);
		size_t totbc = read(c, data, len);
		for(size_t bc = totbc; bc > 0 && totbc < len; totbc += bc = read(c, data + totbc, len - totbc))
		{
			printf("%u %zu %zu\n", len, bc, totbc);
		}
		char*start = strchr(data, '/');
		puts(data);
		if(start != NULL)
		{
			++start;
			if(memcmp(start, "timeout", 7) == 0)
			{
				if(start[7] == '\0' || start[7] == '/')
				{
					fail = timeout(data, eq, c, start + 7);
				}
			}
			else if(memcmp(start, "redirect", 8) == 0)
			{
				fail = redirect(data, len, c, start + 8);
			}
		}
		if(fail)
		{
			free(data);
		}
	}
	if(fail)
	{
		char ch = 'A';
		uint32_t zero = 0;
		write(c, &ch, sizeof(ch));
		write(c, &zero, sizeof(zero));
		close(c);
	}
}
int main(int argl, char**argv)
{
	struct sockaddr_un addr;
	socklen_t addrlen = sizeof(addr);
	struct timeval timeout, cpy;
	fd_set fds;
	struct eventqueue evtq = {NULL, NULL};
	int server = makesock(&addr), client;
	timeout.tv_usec = 250000;
	timeout.tv_sec = 0;
	puts("01");
	if(server > 0)
	{
		int ready = 0;
		FD_ZERO(&fds);
		while(ready >= 0 && !FD_ISSET(STDIN_FILENO, &fds))
		{
			if(ready)
			{
				client = accept(server, (struct sockaddr*)&addr, &addrlen);
				if(client > server)
				{
					handle(&evtq, client);
				}
			}
			cpy = timeout;
			applyEvents(&evtq);
			FD_ZERO(&fds);
			FD_SET(server, &fds);
			FD_SET(STDIN_FILENO, &fds);
			ready = select(server + 1, &fds, NULL, NULL, &cpy);
		}
		destroyQueue(evtq.head, NULL);
		getchar();
		close(server);
		unlink(addr.sun_path);
	}
	return 0;
}
