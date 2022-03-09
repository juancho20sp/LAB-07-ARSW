app = (function(){
//      ESTA LÍNEA ES LA QUE CAMBIA EL apimock Y EL apiclient
        let _module = apimock;
//        let _module = apiclient;
        let _selectedAuthorName;
        let _blueprintsByAuthor = [];
        let _totalPoints;
        let _totalPointsLabel;
        let _blueprintName;

        const _tableBody = $('#table-body');
        const _getBlueprintsBtn = document.querySelector('#getBlueprintsBtn');
        _totalPointsLabel = document.querySelector('#totalUserPoints');
        _blueprintName = $('#blueprintName');


        // Functions
        const blueprintsCallback = (blueprintsList) => {
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

        const draw = (blueprintName) => {
            _blueprintName.text(`Blueprint: ${blueprintName}`);

            _module.getBlueprintsByNameAndAuthor(_selectedAuthorName, blueprintName, (data) => {
                const _canvas = $('#canvas')[0];

                let myData = data.length > 0 ? data[0] : data;

                const { points } = myData;

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

        const readInputData = () => {
            _selectedAuthorName = $('#authorName').val();

            if (_selectedAuthorName) {
                _module.getBlueprintsByAuthor(_selectedAuthorName, blueprintsCallback);
            }
        }

        const getBlueprints = (event) => {
            event.preventDefault();
            readInputData();
        }


        // EVENT LISTENERS
        const loadEventListeners = () => {
            _getBlueprintsBtn.addEventListener('click', getBlueprints);
        }

        loadEventListeners();

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


