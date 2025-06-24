#include<stdio.h>
#include<string.h>
#include<unistd.h>
const char crlf[] = "\r\n";
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
				puts("hit boundary");
				printf("%u is fieldcnt\n", fieldcnt);
				lncnt = 0;
				toadd = 1;
				storelen = memcmp(curr, delimfirst, delimlast - delimfirst) == 0 && fieldcnt <= 2;
			}
			else if(it - curr == delimlast - delimfirst + 2)
			{
				puts("hit boundary end");
				printf("%u is fieldcnt\n", fieldcnt);
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
		puts("begin of form");
		fwrite(title, 1, titlelen, stdout);
		puts("separator");
		fwrite(body, 1, bodylen, stdout);
		puts("end of form");
		printf("%zu %zu\n", titlelen, bodylen);
	}
	close(c);
	return fail;
}
