![](./docs/harmony-header.png)

## What is Harmony?

Harmony is a semi-opinionated zero dependency HTTP library similar to the widely
used express library. The main difference is that Harmony follows the "Model
View Controller" (MVC) pattern and is designed for large scale structured
TypeScript applications that are hosted via a NodeJS server.

Harmony is fully extensible via "event interceptors" and can handle nearly any
templating engine you throw at it. It even supports the use of cookies and
sessions out of the box to allow you to focus on one thing: Building your
website.

### Why should I use Harmony?

The Node ecosystem is full of various sized npm packages that all do their own
thing. If you wish to build a web-server that supports cookies or sessions, a
templating engine, the use of authentication, firewalls, or any form of
dependency injection, you'll quickly realize that your project has over 100
dependencies, not to mention the size of your node_modules directory. If you
find yourself teaching yourself how to use all these different libraries and
basically "hacking" things together to make it work for you, and you're tired of
focusing on other things besides building your own website or application, then
Harmony would probably suit you best.

If you are familiar with one of the well known PHP frameworks like Symfony or
Laravel, then getting started with Harmony will be a literal walk in the park.

### What do I need to know before working with Harmony?

 - Harmony is fully written in TypeScript and will work the best if your project
   is also written in the same language.
 - Harmony makes use of decorators (also known as annotations) to configure
   routes and which template to render.
   
If you are unfamiliar with either TypeScript or the use of decorators, it is
recommended to read up on these topics before diving straight in.

## Quick start

(TODO)
