"use strict";
var http = require('http');
//we need a http server that can be triggered.
var ManagerService;
(function (ManagerService) {
    var HttpService = (function () {
        function HttpService(port) {
            var _this = this;
            this.port = 48524;
            this.handler = function (request, response) {
                response.writeHead(200, {
                    "Content-Type": "application/json",
                    "access-control-allow-origin": "*",
                    "Access-Control-Allow-Headers": "*"
                });
                var that = _this;
                if (request.method.toUpperCase() == 'POST') {
                    var body_1 = "";
                    request.on('data', function (chunk) {
                        body_1 += chunk;
                    });
                    request.on('end', function () {
                        that.handlers.some(function (handler) {
                            if (handler.method == 'POST' && request.url.indexOf(handler.route) == 0) {
                                switch (handler.data) {
                                    case 'JSON':
                                        var jsonObj = JSON.parse(body_1);
                                        handler.action(request, response, jsonObj);
                                        break;
                                }
                                return true;
                            }
                            else {
                                return false;
                            }
                        });
                    });
                }
                if (request.method.toUpperCase() == 'GET') {
                    that.handlers.some(function (handler) {
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
            this.handlers = [];
            this.addHandler = function (handler) {
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
                    _this.handlers.push(handler);
                }
            };
            this.start = function () {
                _this.server = http.createServer(_this.handler);
                _this.server.listen(_this.port);
            };
            if (port)
                if (typeof port == 'number')
                    this.port = port;
        }
        return HttpService;
    }());
    var JsonHandler = (function () {
        function JsonHandler() {
            this.data = 'JSON';
        }
        return JsonHandler;
    }());
})(ManagerService || (ManagerService = {}));
//we also need a http client to communitate with the master
//manager will create worker child process 
//# sourceMappingURL=manager.js.map