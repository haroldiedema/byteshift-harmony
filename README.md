![](./docs/http.png)
===================

Byteshift HTTP is a tiny but complete HTTP server library designed to be used
with TypeScript in a NodeJS application.

## Getting started

Install `@byteshift/http` using NPM:

```shell
$ npm i @byteshift/http
```

... or yarn:

```shell
$ yarn add @byteshift/http
```

## Setting up the server

```typescript
import {Server} from '@byteshift/http';

const server = new Server({
    port: 8080,
    useHttps: false
});

server.start();
```

Navigate to http://localhost:8080 and you should see a "404 Not Found" message.

### Using HTTPS

You can set-up an HTTPS-server by setting `useHttps` to `true` and providing SSL
options using the `sslOptions` object. The contents of this object are directly
passed to Node's `https.createServer()` method, allowing you to specify
SSL-certificate configuration.

```typescript
import {Server} from '@byteshift/http';

const server = new Server({
    port: 8080,
    useHttps: true,
    
    sslOptions: {
        cert: 'cert-file-contents-here',
        key: 'private-key-file-contents-here',
        ca: 'ca-file-contents-here'
    }
});
```

Please refer to https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener
for all available options.

## Writing and registering a controller

Byteshift-HTTP uses controller classes with configured routes to invoke methods.
Annotate a method using the `@Route` decorator to let the library know that
method should be invoked if the configured route matches an incoming request.

For example: `@Route("/", {method: 'GET'})` will match any 'root' route as long
as the request method is 'GET'.

```typescript
// HomeController.ts
import {Response, Route} from '@byteshift/http';

export class HomeController
{
    @Route("/", {method: 'GET'})
    public indexAction(): Response
    {
        return new Response('Hello World!');
    }
    
}
```

```typescript
// app.ts
const server = new Server({
    port: 8080,
    useHttps: false
});


// Register our controller here.
server.registerController(HomeController);

// Start the server.
server.start();
```

## Controller-as-a-Service

As you might have guessed from the previous example, when registering a
controller class, you don't instantiate it with the `new` keyword. This is a
deliberate design choice to allow the use of service containers.

A service container must implement `IServiceContainer` which contains a simple
`get(ctor: new (...args: any[]) => any): any` method. You can configure the
reference to a service container by passing the `serviceContainer` option to the
options object when constructing the `Server`.

If you omit this configuration, the controller is re-instantiated on every
request to ensure it remains stateless for a single client.

Using the `@byteshift/injector` package as a service container library, the
configuration would look like this:

```typescript
// app.ts
import {Server}      from '@byteshift/http';
import {ServiceHost} from '@byteshift/injector';

const server = new Server({
    port: 8080,
    useHttps: false,
    serviceContainer: ServiceHost
});

server.registerController(HomeController);
server.start();
```

```typescript
// HomeController.ts
import {Service} from '@byteshift/injector';

@Service
export class HomeController
{
    @Inject private readonly someApi: SomeRandomApi;
    
    // ... methods here
    @Route("/user/:username", {method: 'GET'})
    public async userAction(username: string): Promise<JsonResponse>
    {
        const profile = await this.someApi.fetchUser(username);
        
        return new JsonResponse({ profile });
    }
    
}
```
