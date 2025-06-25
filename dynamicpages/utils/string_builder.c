#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include"string_builder.h"
int init_string_builder(struct string_builder*this)
{
	int fail = 1;
	this->str = malloc(16);
	if(this->str != NULL)
	{
		this->capa = 16;
		this->len = 0;
		fail = 0;
	}
	return fail;
}
int append_string_builder(struct string_builder*this,const char*first,const char*last)
{
	int fail = 0;
	if(this->len + (last - first) > this->capa)
	{
		size_t nc = this->capa + (this->capa >> 1);
		for(; this->len + (last - first) > nc; nc += nc >> 1);
		char*new = malloc(nc);
		if(new != NULL)
		{
			memcpy(new, this->str, this->len);
			free(this->str);
			this->str = new;
			this->capa = nc;
		}
		else
		{
			perror("append_string_builder: malloc failed");
			fail = 1;
		}
	}
	if(!fail)
	{
		memcpy(this->str + this->len, first, last - first);
		this->len += last - first;
	}
	return fail;
}
int append_string_builder_nullterm(struct string_builder*this,const char*s)
{
	return append_string_builder(this, s, s + strlen(s));
}
int append_string_builder_single(struct string_builder*this,char c)
{
	return append_string_builder(this, &c, &c + 1);
}
void free_string_builder(struct string_builder*this)
{
	free(this->str);
}
