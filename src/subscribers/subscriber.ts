import { registerSubscribers } from './subscriberList';

export const subscriber = {
  events: {} as { [eventName: string]: Function[] },
  subscribe: function (eventName: any, fn: Function) {
    console.log(`Subscriber: event registered for: ${eventName}`);

    // add an event with a name as new or to existing list
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  },

  unsubscribe: function (eventName: string, fn: Function) {
    console.log(`Unsubscribe: event unregistered for: ${eventName}`);

    // remove event function by event name
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter((f) => f !== fn);
    }
  },

  publish: function (eventName: string, data: Object) {
    console.log(`Publish: event published for: ${eventName}`);

    if (this.events[eventName]) {
      this.events[eventName].forEach((f) => {
        f(data);
      });
    }
  }
};

registerSubscribers();
