#ifndef Included_eventloop_h
#define Included_eventloop_h
#include<time.h>
struct queuenode
{
	struct queuenode*prev;
    struct queuenode*next;
    void(*func)(void*);
    void*arg;
    time_t timestamp;
};
struct eventqueue
{
    struct queuenode*head;
    struct queuenode*tail;
};
int addEvent(struct eventqueue*q, time_t timestamp, void(*func)(void*), void*arg);
void applyEvents(struct eventqueue*q);
void destroyQueue(struct queuenode*from, struct queuenode*to);
#endif
