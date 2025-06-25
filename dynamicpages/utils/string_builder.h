#ifndef Included_string_builder_h
#define Included_string_builder_h
#include<stddef.h>
struct string_builder
{
	char*str;
	size_t len, capa;
};
int init_string_builder(struct string_builder*this);
int append_string_builder(struct string_builder*this,const char*first,const char*last);
int append_string_builder_nullterm(struct string_builder*this,const char*s);
int append_string_builder_single(struct string_builder*this,char c);
void free_string_builder(struct string_builder*this);
#endif
