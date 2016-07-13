import * as http from 'http';
import * as vm from 'vm';

//we need a http server that can be triggered.
module ManagerService {
    class HttpService {
        public port: number = 48524;
        public server: http.Server;
        constructor(port?: number) {
            if (port) if (typeof port == 'number') this.port = port;
        }
        private handler = (request: http.IncomingMessage, response: http.ServerResponse) => {
            response.writeHead(200, {
                "Content-Type": "application/json",
                "access-control-allow-origin": "*",
                "Access-Control-Allow-Headers": "*"
            });
            let that = this;
            if (request.method.toUpperCase() == 'POST') {
                let body = "";
                request.on('data', function (chunk) {
                    body += chunk;
                });
                request.on('end', function () {
                    that.handlers.some(handler => {
                        if (handler.method == 'POST' && request.url.indexOf(handler.route) == 0) {
                            switch (handler.data) {
                                case 'JSON':
                                    let jsonObj = JSON.parse(body);
                                    handler.action(request, response, jsonObj);
                                    break;
                            }
                            return true;
                        }
                        else {
                            return false;
                        }
                    });
                })
            }
            if (request.method.toUpperCase() == 'GET') {
                that.handlers.some(handler => {
                    if (handler.method == 'GET' && request.url.indexOf(handler.route) == 0) {
                        switch (handler.data) {
                            case 'TEXT':
                                handler.action(request, response, null);
                                break;
                            case 'JSON':
                                handler.action(request, response, null);
                                break;
                            case 'XML':
                                handler.action(request, response, null);
                                break;
                        }
                        return true;
                    }
                    else {
                        return false;
                    }
                });
            }
        };
        private handlers: HttpHandler[] = [];
        public addHandler = (handler: HttpHandler) => {
            if (!handler.route) {
                handler.route = '\/';
            }
            if (handler.route.indexOf('\/') != 0) {
                handler.route = '\/' + handler.route;
            }
            if (!handler.method) {
                handler.method = 'GET';
            }
            if (handler.action) {
                this.handlers.push(handler);
            }
        }
        public start = () => {
            this.server = http.createServer(this.handler);
            this.server.listen(this.port);
        }
    }
    interface HttpHandler {
        route?: string;
        method?: 'GET' | 'POST' | 'PUT';
        data: 'TEXT' | 'JSON' | 'XML';
        action: (req: http.IncomingMessage, res: http.ServerResponse, ...args: any[]) => void;
    }
    class JsonHandler<T> implements HttpHandler {
        public data: 'TEXT' | 'JSON' | 'XML' = 'JSON';
        action: (req: http.IncomingMessage, res: http.ServerResponse, json: T) => void;
    }
}

//we also need a http client to communitate with the master

//manager will create worker child process