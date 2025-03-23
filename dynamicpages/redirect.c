#include<arpa/inet.h>
#include<stdio.h>
#include<stdlib.h>
#include<stdint.h>
#include<string.h>
#include<time.h>
#include<unistd.h>
#define MAX_LINK_LEN 512
size_t parselink(char*restrict dest, size_t destlen, const char*restrict src, size_t srclen)
{
	char*outit = dest;
	char percent = 0;
	char ch = 0;
	for(const char*it = src; outit != dest + destlen && it != src + srclen; ++it)
	{
		if(*it == '%')
		{
			percent = 2;
			ch = 0;
		}
		else if(percent)
		{
			ch <<= 4;
			ch |= *it >= '0' && *it <= '9' ? *it - '0' : (*it & 7) + 9;
			if(--percent == 0)
			{
				*outit++ = ch;
			}
		}
		else
		{
			*outit++ = *it;
		}
	}
	return outit - dest;
}
uint64_t randthree(time_t t, uint64_t target)
{
	t *= 25214903917;
	t += 11;
	uint64_t a = t % 255 + target + 2;
	a &= 0xff;
	uint64_t b = t >> 8;
	if(target > 255 + a)
	{
		b %= 511 - target + a;
		b += target - a - 255;
	}
	else if(target > a)
	{
		b %= target - a + 1;
	}
	else if(target == a)
	{
		b = 0;
	}
	else
	{
		b %= a - target - 1;
		b += target + 257 - a;
	}
	uint64_t c = target >= a + b ? target - (a + b) : target + 512 - (a + b);
	return(c & 0xff) << 16 | b << 8 | a;
}
int redirect(void*data, size_t len, int c, char*start)
{
	static char links[262144];
	static size_t ind = 0;
	int f = 0;
	char*slash = strchr(start + 1, '/');
	union
	{
		uint32_t i;
		char bytes[4];
	}dummy;
	if(slash == NULL || slash - start > 5)
	{
		size_t startlen = strlen(start);
		size_t bodylen = len - (start - (char*)data) - startlen - 1;
		if(bodylen > 9)
		{
			const char*body = start + startlen + 1;
			size_t linklen = bodylen - 9;
			bodylen = parselink(links + (ind * MAX_LINK_LEN), MAX_LINK_LEN, body + 9, linklen);
			if(bodylen < MAX_LINK_LEN)
			{
				links[(ind * MAX_LINK_LEN) + bodylen] = '\0';
			}
			struct timespec tm;
			timespec_get(&tm, TIME_UTC);
			uint64_t t = tm.tv_sec * 1000000 + tm.tv_nsec / 1000;
			uint64_t code = t * t;
			code &= 0xffffffffff000000;
			uint64_t sum = (code >> 56 & 0xff) + (code >> 48 & 0xff) + (code >> 40 & 0xff) + (code >> 32 & 0xff) + (code >> 24 & 0xff);
			sum &= 0x1ff;
			uint64_t remaining = (ind - sum) & 0x1ff;
			code |= randthree(t, remaining);
			const char format[] = "<a href=\"%s/%016lx\">Your Link</a>";
			char response[64];
			char meta[5];
			uint32_t rescnt = sprintf(response, format, start + 1, code);
			dummy.i = htonl(rescnt);
			meta[0] = 'F';
			memcpy(meta + 1, dummy.bytes, sizeof(rescnt));
			write(c, meta, sizeof(meta));
			write(c, response, rescnt);
			close(c);
			free(data);
			++ind;
		}
		else
		{
			f = 1;
		}
	}
	else if(slash != NULL)
	{
		union
		{
			uint64_t l;
			unsigned char b[sizeof(uint64_t)];
		}longbytes;
		longbytes.l = strtoul(slash + 1, NULL, 16);
		size_t sum = 0;
		for(size_t i = 0; i < sizeof(longbytes.b); ++i)
		{
			sum += longbytes.b[i];
		}
		sum &= 0x1ff;
		char response[576] = "R    HTTP/1.1 308 Permanent Redirect\r\nlocation: ";
		size_t len1 = strlen(response);
		size_t len2 = 0;
		for(; links[sum * MAX_LINK_LEN + len2] != '\0' && len2 < MAX_LINK_LEN; ++len2);
		if(0 < len2)
		{
			if(memcmp(start + 1, "html", slash - start - 1) == 0)
			{
				response[0] = 'F';
				char*tmpstr = malloc(len2 + 1);
				memcpy(tmpstr, links + sum * MAX_LINK_LEN, len2);
				tmpstr[len2] = '\0';
				int outlen = sprintf(response + 5, "<meta http-equiv=\"refresh\"content=\"1;url='%s'\">", tmpstr);
				write(c, response, outlen + 5);
				free(tmpstr);
			}
			else
			{
				memcpy(response + len1, links + sum * MAX_LINK_LEN, len2);
				memcpy(response + len1 + len2, "\r\n\r\n", 4);
				dummy.i = htonl((uint32_t)(len1 + len2 - 1));
				memcpy(response + 1, dummy.bytes, sizeof(dummy.bytes));
				write(c, response, len1 + len2 + 4);
			}
			close(c);
		}
		else
		{
			f = 1;
		}
	}
	else
	{
		f = 1;
	}
	return f;
}
