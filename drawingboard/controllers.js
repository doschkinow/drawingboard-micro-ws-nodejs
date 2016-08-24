'use strict';

/* Controllers */


// Controller for the drawing editor page
function DrawingController($scope, $http, $routeParams) {
    $scope.drawingCanvas = document.getElementById('drawing');
    $scope.shapeType = "BIG_CIRCLE";
    if (navigator.appVersion.indexOf("Chrome") > 0)
        $scope.shapeColor = "BLUE";
    else
        $scope.shapeColor = "GREEN";

    $scope.websocket = io.connect(document.location.host, {query: 'drawingId=' + $routeParams.drawingId});

    $scope.websocket.on('shape', function (data) {
        console.log(data);
        $scope.drawShape(eval("(" + data + ")"));
    });

    $scope.websocket.on('sseLocation', function (data) {
        console.log(data);
        $scope.sseLocation = data.sseLocation;
        $scope.drawing = $http.get(document.location.protocol + '//' + data.sseLocation + '/api/drawings/' + $routeParams.drawingId)
                .then(function(res){
                    $scope.drawing = res.data;
                });
    });

    $scope.$on("$destroy", function (event) {
        $scope.websocket.disconnect();
    });

    // draws a given shape
    $scope.drawShape = function (shape) {
        var context = $scope.drawingCanvas.getContext('2d');
        var radius = 8;
        //Canvas commands go here
        //context.strokeStyle = "#000000";
        context.fillStyle = shape.color;
        if (shape.type == 'SMALL_CIRCLE') {
            context.beginPath();
            context.arc(shape.x, shape.y, radius, 0, Math.PI * 2, true);
            context.closePath();
            context.fill();
        } else if (shape.type == 'BIG_CIRCLE') {
            context.beginPath();
            context.arc(shape.x, shape.y, 2 * radius, 0, Math.PI * 2, true);
            context.closePath();
            context.fill();
        } else if (shape.type == 'BIG_SQUARE') {
            //context.fillRect(0,1,10,10);
            context.fillRect((shape.x - (2 * radius)), (shape.y - (2 * radius)), (4 * radius), (4 * radius));
            //context.fill();
        } else if (shape.type == 'SMALL_SQUARE') {
            context.fillRect((shape.x - (radius)), (shape.y - (radius)), (2 * radius), (2 * radius));
        }
    }

    // mouseMove event handler
    $scope.mouseMove = function (event) {
        if (event.shiftKey) {
            $scope.mouseDown(event);
        }
    }

    // mouseDown event handler
    $scope.mouseDown = function (e) {
        var totalOffsetX = 0;
        var totalOffsetY = 0;
        var currentElement = $scope.drawingCanvas;

        do {
            totalOffsetX += currentElement.offsetLeft;
            totalOffsetY += currentElement.offsetTop;
        } while (currentElement = currentElement.offsetParent);


        var posx = e.pageX - totalOffsetX;
        var posy = e.pageY - totalOffsetY;

        var msg = '{"x" : ' + posx +
                ', "y" : ' + posy +
                ', "color" : "' + $scope.shapeColor +
                '", "type" : "' + $scope.shapeType + '"}';


        $scope.websocket.emit('shape', msg);

    }
}
