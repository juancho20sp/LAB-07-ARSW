app = (function(){
        // MODULES
        // ESTA LÍNEA ES LA QUE CAMBIA EL apimock Y EL apiclient
        let _module = apimock;
        // let _module = apiclient;
        let _module_canvas = module_canvas;
        
        let _selectedAuthorName;
        let _blueprintsByAuthor = [];
        let _totalPoints;
        let _totalPointsLabel;
        let _blueprintName;

        let _listOfBlueprints;
        let _currentBlueprint = '';

        const _tableBody = $('#table-body');
        const _getBlueprintsBtn = document.querySelector('#getBlueprintsBtn');
        _totalPointsLabel = $('#totalUserPoints');
        _blueprintName = $('#blueprintName');

        const _blueprintAuthorH2 = $('#blueprintsAuthorH2');
        
        // Canvas buttons
        let _basePoints = [];

        const _createBlueprintBtn = $('#createBlueprintBtn')[0];
        const _updateCanvasBtn = $('#updateCanvasBtn')[0];
        const _deleteBlueprintBtn = $('#deleteBlueprintBtn')[0];

        // $
        loadEventListeners();

        // Functions
        function blueprintsCallback(blueprintsList) {
            const list = blueprintsList.map(blueprint => {
                return {
                    name: blueprint.name,
                    points: blueprint.points.length
                }
            });

            // Clear the table
            _tableBody.empty();

            list.map(blueprint => {
                const { name, points } = blueprint;

                const button = `<button onclick="app.drawBlueprint('${name}')">Draw</button>`;
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${name}</td>
                    <td>${points}</td>
                    <td>${button}</td
                `

                _tableBody.append(row);

            });

            _totalPoints = list.reduce((acc, cur) => acc + cur.points, 0);

            _totalPointsLabel.innerHTML = _totalPoints;
        }

        function myCallback(err, mockDataAuthor) {
            if (err !== null) {
                return;
            }

            _listOfBlueprints = mockDataAuthor.map(blueprint => {
                const data = {
                    name: blueprint.name,
                    numberOfPoints: blueprint.points.length
                };

                return data;
            });

            _totalPoints = _listOfBlueprints.reduce((total, { numberOfPoints }) => total + numberOfPoints, 0);

            // Update HTML
            addDataAndPutHTML(_totalPoints);
        };

        function updateData( totalOfPoints ) {
            // $
            // debugger;
            _totalPointsLabel.text(`Total points: ${totalOfPoints}`);
            _blueprintAuthorH2.text(`${_selectedAuthorName}`);
            _blueprintName.text(`Current Blueprint`);
        }


        function draw(blueprintName) {
            _blueprintName.text(`Blueprint: ${blueprintName}`);

            // $
            const _canvas = $('#canvas')[0];
            // _basePoints = [];
            _currentBlueprint = blueprintName;
            _canvas.width = _canvas.width;

            _module.getBlueprintsByNameAndAuthor(_selectedAuthorName, blueprintName, (err, data) => {
                
                // $
                debugger;

                if (_module_canvas.getCurrentPoints().length > 0) {
                    data = _module_canvas.getCurrentPoints();
                    // $
                    debugger;
                    // _basePoints = [..._basePoints, ...data[0].points];
                    _basePoints = [..._basePoints, data[0].points[data[0].points.length - 1]];
                } else {
                    _basePoints = [...data[0].points];
                }

                // $
                console.log(_basePoints);
                

                // let myData = data.length > 0 ? data[0] : data;

                // const { points } = myData;

                const points = _basePoints;

                if (_canvas.getContext) {
                    const context = _canvas.getContext('2d');

                    // Clear canvas
                    context.clearRect(0, 0, _canvas.width, _canvas.height);
                    _canvas.width = _canvas.width;

                    context.moveTo(points[0].x, points[0].y);

                    points.forEach(point => {
                        const { x, y } = point;
                        context.lineTo(x, y);
                    });

                    context.stroke();
                }
            });
        }

        function addDataAndPutHTML(totalOfPoints) {
            updateData(totalOfPoints);

            // Clear the table
            _tableBody.empty();

            _listOfBlueprints.map (blueprint => {
                const {name, numberOfPoints } = blueprint;
                const row = document.createElement('tr');
                const button = `<button class="btn btn-success" onclick="app.drawBlueprint('${name}')"> Open </button>`;
                row.innerHTML=`
                                <td>${name}</td>
                                <td>${numberOfPoints}</td>
                                <td>${button}</td>`;
                
                                // Add to the table
                _tableBody.append(row);
            })

        };

        function readInputData(blueprintName, callback = myCallback) {
            // Clear the existing data
            _listOfBlueprints = [];
            
            _selectedAuthorName = $('#authorName').val();

            // $
            // debugger;

            if (blueprintName === null) {
                _module.getBlueprintsByAuthor(_selectedAuthorName, callback);
            } else {
                _module.getBlueprintsByNameAndAuthor(_selectedAuthorName,blueprintName, callback)
            }
        }

        function getBlueprints(event){
            event.preventDefault();

            // $
            // debugger;

            _currentBlueprint = '';
            _module_canvas.clear();

            readInputData(null);
        }

        function createBlueprint(){
            _module_canvas.clear();
            _selectedAuthorName = $('#authorName').val();
            if (_selectedAuthorName === '') {
                alert("No se puede crear un blueprint sin haber seleccionado un autor.");
                return;
            }

            const blueprintName = prompt("Nombre del blueprint: ", "Nombre del nuevo blueprint");

            if (blueprintName === '' || blueprintName === null){
                alert("No se puede crear un blueprint sin nombre.");
                return;
            }
            const newBlueprint = {author: _selectedAuthorName, name: blueprintName, points: []};

            // TODO
            // _module.postBlueprint( JSON.stringify(newBlueprint), readInputData);
        }


        function callB2 (error , mockDataAuthor) {
            if( error !== null  ){ return;}
            _listOfBlueprints = [...mockDataAuthor];
            const blueprint = _listOfBlueprints[0];
            if(blueprint) {
                let { author, name, points } = blueprint;
                points = [...points, ..._module_canvas.getCurrentPoints()];
                // Objeto consultado por autor y nombre de plano
                blueprint.points = points; 

                // TODO
                // _module.putBlueprint( name, author, JSON.stringify(bp), readInputData );
            }
        }
        
        function callB3 (error , mockDataAuthor) {
            if( error !== null  ){ return;}
            _listOfBlueprints = [...mockDataAuthor];
            const bp = _listOfBlueprints[0];
            if( bp ){
                var { author, name } = bp;
                _module.deleteBlueprint( name, author, JSON.stringify(bp), readInputData );
            }
        }

        function updateBlueprint() {
            if (_currentBlueprint === '') {
                return;
            }

            readInputData( _currentBlueprint, callB2);        
        }
        
    
        function deleteBlueprint(){
            if (_currentBlueprint === '') {
                return;
            }

            _module_canvas.clear();
            readInputData( _currentBlueprint, callB3);        
        }

        // EVENT LISTENERS
        function loadEventListeners() {
            // if (!_getBlueprintsBtn) {
            //     return;
            // }

            

            _getBlueprintsBtn.addEventListener('click', getBlueprints);
            
            // Init the canvas methods
            // $
            // debugger;
            _module_canvas.init();
            
            _updateCanvasBtn.addEventListener('click', updateBlueprint);
            _deleteBlueprintBtn.addEventListener('click', deleteBlueprint);
            
            
            _createBlueprintBtn.addEventListener('click', createBlueprint);
        }

        

        return {
            setModule: (module = apimock) => {
                _module = module;
            },

            setSelectedAuthorName: (name) => {
                _selectedAuthorName = name;
            },

            setBlueprintsByAuthor: (blueprintsList = []) => {
                _blueprintsByAuthor = blueprintsList;
            },

            updateAuthorName: (newName) => {
                _selectedAuthorName = newName;
            },

            refreshBlueprintsList: () => {
                _module.getBlueprintsByAuthor()
            },

            drawBlueprint: (blueprintName) => {
                draw(blueprintName)
            },
            getCurrentBlueprint: () => {
                return _currentBlueprint;
            },
            createNewBlueprint: () => {
                
            }

        }
    })();

    /*
    Example of use:
    var fun=function(list){
        console.info(list);
    }

    apimock.getBlueprintsByAuthor("johnconnor",fun);
    apimock.getBlueprintsByNameAndAuthor("johnconnor","house",fun);*/


