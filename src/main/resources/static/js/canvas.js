var module_canvas = (function(){
    console.log('MODULE CANVAS DONE')

    let _currentBlueprint;
    let _lastBlueprint;
    let _points = [];

    const _canvas = $('#canvas')[0];
    const _context = _canvas.getContext('2d');

    const loadEventListeners = () => {
        if (window.PointerEvent) {
            _canvas.addEventListener('pointerdown', (event) => {
                _currentBlueprint = app.getCurrentBlueprint();

                if (!_currentBlueprint) {
                    return;
                }

                // If blueprints are different, reset the points array
                if (_currentBlueprint !== _lastBlueprint) {
                    _points = [];
                }

                let { pageX, pageY } = event;

                _lastBlueprint = _currentBlueprint;

                pageX -= _canvas.offsetLeft;
                pageY -= _canvas.offsetTop;

                const newPoint = {
                    x: pageX,
                    y: pageY
                };

                _points.push(newPoint);

                app.drawBlueprint(_currentBlueprint);
            });
        } else {
            CanvasGradient.addEventListener("mousedown", function(event){
                alert('mousedown at '+event.clientX+ ', ' + event.clientY);
            });
        }
    }

        return {
            init: () => {
                loadEventListeners();
            },

            drawCanvas: (currentPoints = []) => {
                if (_canvas.getContext) {
                    _currentBlueprint = app.getCurrentBlueprint();

                    if (_currentBlueprint !== _lastBlueprint) {
                        _points = [];
                    }
                    const points = [...currentPoints, ..._points];

                    // Clear canvas
                    _canvas.width = _canvas.width;

                    _context.moveTo(points[0].x, points[0].y);

                    points.forEach(point => {
                        const { x, y } = point;
                        _context.lineTo(x, y);
                    });

                    _context.stroke();
                }
            },

            updatePoints: () => {
                if (_points.length !== 0) {
                    _points = [];
                }
            },

            clear: () => {
                _points = [];
                _canvas.width = _canvas.width
            },

            deletePoints: () => {
                _points = [];
                app.drawBlueprint(_currentBlueprint);
            },

            getCurrentPoints: () => {
                if (_points.length > 0){
                    return [{
                        points: _points
                    }];
                } else {
                    return _points;
                }

                
            }
        }
})();
