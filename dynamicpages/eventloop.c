#include<stdlib.h>
#include"eventloop.h"
int addEvent(struct eventqueue*q, time_t timestamp, void(*func)(void*), void*arg)
{
	struct queuenode**n = q->head == NULL ? &q->head : &q->tail->next;
	int failed = 1;
	*n = malloc(sizeof(**n));
	if(*n)
	{
		(*n)->prev = q->tail;
		(*n)->next = NULL;
		q->tail = *n;
		q->tail->func = func;
		q->tail->arg = arg;
		q->tail->timestamp = timestamp;
		failed = 0;
	}
	return failed;
}
void applyEvents(struct eventqueue*q)
{
	struct queuenode**node = &q->head;
	for(struct queuenode**next = node; *node != NULL ; node = next)
	{
		if(time(NULL) >= (*node)->timestamp)
		{
			if((*node)->next != NULL)
			{
				(*node)->next->prev = (*node)->prev;
			}
			else
			{
				q->tail = (*node)->prev;
			}
			(*node)->func((*node)->arg);
			(*node) = (*node)->next;
			free(*node);
		}
		else
		{
			next = &(*node)->next;
		}
	}
}
void destroyQueue(struct queuenode*from, struct queuenode*to)
{
	for(struct queuenode*next; from != to; from = next)
	{
		next = from->next;
		free(from);
	}
}
