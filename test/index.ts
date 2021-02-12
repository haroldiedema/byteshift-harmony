import {Response, Request, Route, Server} from '../src/index';
import {JsonResponse}                     from '../src/JsonResponse';

const server = new Server({port: 8080, useHttps: false});

class TestController
{
    @Route('/', {method: 'GET'})
    public indexAction(): any
    {
        return new Response('<h1>Hello World!</h1>', 200, 'text/html');
    }

    @Route('/user/:username', {method: 'GET'})
    public userAction(request: Request, username: string)
    {
        return new Response('<h1>Hello ' + username +'!</h1>', 200, 'text/html');
    }

    @Route("/json/:username/:password")
    public jsonAction(username: string, password: any): JsonResponse
    {
        console.log({hello: 'world', yourNameIs: username});

        return new JsonResponse({hello: 'world', yourNameIs: username, yourPasswordIs: password});
    }
}

server.registerController(TestController);
server.start();

