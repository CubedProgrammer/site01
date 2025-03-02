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
	time_t curr = 0;
	struct queuenode*node = q->head;
	struct queuenode*next = NULL;
	for(; node != NULL && time(NULL) >= node->timestamp; node = node->next)
	{
		time(&curr);
		next = node->next;
		node->func(node->arg);
	}
	destroyQueue(q->head, node);
	q->head = node;
	if(q->head == NULL)
	{
		q->tail = NULL;
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
