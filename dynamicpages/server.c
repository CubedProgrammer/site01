#include<stdio.h>
#include<sys/select.h>
#include<sys/socket.h>
#include<sys/un.h>
#include<unistd.h>
#include"eventloop.h"
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
	char cbuf[2601];
	size_t bufsz = sizeof(cbuf);
	size_t bc = read(c, cbuf, bufsz), last = 0;
	char ended = memchr(cbuf, 0, bc) != NULL;
	for(; bc < bufsz && !ended; ended = memchr(cbuf + last, 0, bc - last) != NULL)
	{
		last = bc;
		bc += read(c, cbuf + bc, bufsz - bc);
	}
	char*start = memchr(cbuf, '/', bc);
	puts(cbuf);
	if(start != NULL)
	{
		char fail = 1;
		++start;
		if(memcmp(start, "timeout", 7) == 0)
		{
			if(start[7] == '\0' || start[7] == '/')
			{
				fail = timeout(eq, c, start + 7);
			}
		}
		if(fail)
		{
			char ch = 'A';
			write(c, &ch, sizeof(ch));
			close(c);
		}
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
			ready = select(server + 1, &fds, NULL, NULL, &timeout);
		}
		destroyQueue(evtq.head, NULL);
		getchar();
		close(server);
		unlink(addr.sun_path);
	}
	return 0;
}
