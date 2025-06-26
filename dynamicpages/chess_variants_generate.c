#include<ctype.h>
#include<netinet/in.h>
#include<stdint.h>
#include<stdio.h>
#include<string.h>
#include<unistd.h>
#include"utils/string_builder.h"
#define WRITE_ARRAY(fd, a)(write(fd, a, sizeof(a) - 1))
const char crlf[] = "\r\n";
const char popening[] = "<p class=\"paragraph\">";
const char pclosing[] = "</p>";
const char stopening[] = "<p class=\"subtitle\">";
const char stclosing[] = "</p>";
const char imgtag[] = "<img src=\"\">";
int actual_generator(int c, char*title, size_t titlelen, char*body, size_t bodylen)
{
	int fail = 0;
	char*parabegin = body;
	char*paraend;
	struct string_builder builder;
	fail = init_string_builder(&builder);
	FILE*fh = fopen("127.0.0.1/chess/variants/template.html", "r");
	char filebuf[512];
	size_t bufsz = sizeof(filebuf);
	char*filecontinue = filebuf, *last = filebuf;
	size_t bcnt = 1;
	for(; titlelen > 0 && isspace(title[titlelen - 1]); --titlelen);
	if(fh != NULL)
	{
		unsigned xcnt = 0;
		while(bcnt > 0 && xcnt < 3)
		{
			bcnt = fread(filebuf, 1, bufsz, fh);
			filecontinue = memchr(filebuf, 'X', bcnt);
			last = filebuf;
			while(filecontinue != NULL)
			{
				fail += append_string_builder(&builder, last, filecontinue);
				if(xcnt < 2)
				{
					fail += append_string_builder(&builder, title, title + titlelen);
				}
				last = ++filecontinue;
				++xcnt;
				filecontinue = memchr(filecontinue, 'X', filebuf + bcnt - filecontinue);
			}
			if(xcnt < 3)
			{
				fail += append_string_builder(&builder, last, filebuf + bcnt);
			}
		}
		fail = fail != 0;
	}
	else
	{
		fail = 1;
	}
	for(char*it = body; it != body + bodylen && !fail; ++it)
	{
		if(*it == '\n')
		{
			paraend = it;
			for(--paraend; paraend != parabegin && isspace(paraend[-1]); --paraend);
			if(parabegin != paraend)
			{
				fail = fail || append_string_builder_single(&builder, '\n');
				if(*parabegin == '#')
				{
					fail = fail || append_string_builder_nullterm(&builder, stopening);
					fail = fail || append_string_builder(&builder, parabegin + 1, paraend);
					fail = fail || append_string_builder_nullterm(&builder, stclosing);
				}
				else if(*parabegin == '$')
				{
					fail = fail || append_string_builder(&builder, imgtag, imgtag + 10);
					fail = fail || append_string_builder(&builder, parabegin + 1, paraend);
					fail = fail || append_string_builder(&builder, imgtag + 10, imgtag + 12);
				}
				else
				{
					fail = fail || append_string_builder_nullterm(&builder, popening);
					fail = fail || append_string_builder(&builder, parabegin, paraend);
					fail = fail || append_string_builder_nullterm(&builder, pclosing);
				}
			}
			parabegin = it + 1;
		}
	}
	if(fh != NULL)
	{
		fail = fail || append_string_builder(&builder, last, filebuf + bcnt);
		while(!fail && bcnt > 0)
		{
			bcnt = fread(filebuf, 1, bufsz, fh);
			fail = fail || append_string_builder(&builder, filebuf, filebuf + bcnt);
		}
		fclose(fh);
	}
	if(!fail)
	{
		uint32_t lenbytes = htonl(builder.len);
		char meta[sizeof(lenbytes) + 1];
		meta[0] = 'F';
		memcpy(meta + 1, &lenbytes, sizeof(lenbytes));
		write(c, meta, sizeof(meta));
		write(c, builder.str, builder.len);
		close(c);
	}
	free_string_builder(&builder);
	return fail;
}
int chess_variants_generate(void*mem, unsigned len, int c)
{
	int fail = 0;
	char*delimfirst = NULL, *delimlast = NULL;
	char*curr = mem;
	char*last = curr + len - 1;
	unsigned lncnt = 0, fieldcnt = 0;
	char*title = NULL;
	char*body = NULL;
	size_t titlelen = 0, bodylen = 0;
	char**fieldptrs[] = {&title, &body};
	size_t*lenptrs[] = {&titlelen, &bodylen};
	char storelen = 0, toadd = 1;
	for(char*it=curr;it!=last;++it)
	{
		if(memcmp(it,crlf,2) == 0)
		{
			if(delimfirst==NULL&&delimlast==NULL)
			{
				delimfirst = curr;
				delimlast = it;
			}
			else if(it - curr == delimlast - delimfirst)
			{
				lncnt = 0;
				toadd = 1;
				storelen = memcmp(curr, delimfirst, delimlast - delimfirst) == 0 && fieldcnt <= 2;
			}
			else if(it - curr == delimlast - delimfirst + 2)
			{
				storelen = memcmp(curr, delimfirst, delimlast - delimfirst) == 0 && fieldcnt <= 2;
			}
			if(storelen)
			{
				*lenptrs[fieldcnt - 1] = curr - *fieldptrs[fieldcnt - 1];
				storelen = 0;
			}
			curr = it + 2;
			lncnt += toadd;
			if(lncnt == 3)
			{
				if(fieldcnt < 2)
				{
					*fieldptrs[fieldcnt] = curr;
				}
				++fieldcnt;
				lncnt = 0;
				toadd = 0;
			}
		}
	}
	if(fieldcnt >= 2)
	{
		fail = actual_generator(c, title, titlelen, body, bodylen);
	}
	return fail;
}
