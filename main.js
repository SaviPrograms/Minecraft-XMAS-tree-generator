// Opcje
const styleProp = 'borderWidth';
const styling = '2px';
const blocks = [[
    [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 2, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ],
    [
        [3, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 2, 0, 3],
        [3, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ],
    [
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 2, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1]
    ],
    [
        [1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1],
        [1, 1, 2, 1, 1],
        [1, 1, 1, 1, 1],
        [4, 1, 1, 1, 4]
    ],
    [
        [0, 0, 0, 4, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 2, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0],
        [0, 4, 1, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 4, 1, 1, 0],
        [0, 0, 0, 0, 0]
    ]
], [
    [
        [0, 3, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 2, 0, 0],
        [3, 0, 0, 0, 3],
        [0, 0, 3, 0, 0]
    ],
    [
        [0, 1, 1, 1, 0],
        [1, 1, 1, 1, 1],
        [1, 1, 2, 1, 1],
        [1, 1, 1, 1, 1],
        [0, 1, 1, 1, 0]
    ],
    [
        [0, 0, 1, 0, 0],
        [4, 1, 1, 1, 0],
        [1, 1, 2, 1, 1],
        [0, 1, 1, 1, 0],
        [0, 0, 1, 4, 0]
    ],
    [
        [0, 0, 4, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 2, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 2, 1, 0],
        [0, 4, 1, 4, 0],
        [0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ]
]
][Math.round(Math.random())];

// Elementy DOM
const canvas = document.getElementById('render');
const output = document.getElementById("kwota");

// Obiekty
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
});
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(24, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
const light = new THREE.PointLight(0xffffff, 1, 0);
const pivot = new THREE.Group()

/**********************\                                  
| Renderowanie         |
\**********************/
// Ustawienia
renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
renderer.setClearColor(0x000000, 0)

updatePositions();

pivot.add(liscie.mesh, drewno.mesh, bombki.mesh)
scene.add(pivot, light)

light.position.set(0, 10, 10)
camera.position.set(0, 0, 20)

draw()
showPrice()


// Funkcje
function draw() {
    renderer.render(scene, camera)
    requestAnimationFrame(draw);
    pivot.rotation.y += 0.01;
}

function updatePositions() {
    let dummy = new THREE.Object3D();

    // Kategoria.forEveryChild(x=>{
    //     x.used = 0;
    // })

    let i = 0;
    for (const y in blocks) {
        for (const z in blocks[y]) {
            for (const x in blocks[y][z]) {
                dummy.position.set(
                    (x - blocks[y][z].length / 2) + .5,
                    (y - blocks.length / 2) + .5,
                    (z - blocks[y].length / 2) + .5
                );
                dummy.updateMatrix();
                switch (blocks[y][z][x]) {
                    case 1:
                        liscie.mesh.setMatrixAt(i++, dummy.matrix);
                        leavesType.used++;
                        break;
                    case 2:
                        drewno.mesh.setMatrixAt(i++, dummy.matrix);
                        logType.used++;
                        break;
                    case 3:
                        dummy.position.y += .25;
                        dummy.updateMatrix();
                        bombki.mesh.setMatrixAt(i++, dummy.matrix);
                        break;
                    case 4:
                        dummy.position.y -= .25;
                        dummy.updateMatrix();
                        bombki.mesh.setMatrixAt(i++, dummy.matrix);
                        break;
                }

            }
        }
    }

    bombki.mesh.instanceMatrix.needsUpdate = true;
    liscie.mesh.instanceMatrix.needsUpdate = true;
    drewno.mesh.instanceMatrix.needsUpdate = true;
}

// Eventy
window.addEventListener('resize', function resize() {
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    camera.aspect = canvas.offsetWidth / canvas.offsetHeight
    camera.updateProjectionMatrix();
})

function change(element, kategoria, wybór) {
    function setOn(element, kategoria, wybór) {
        if (kategoria.length >= kategoria.maxItems) setOff(kategoria.queue[0].element, kategoria);
        kategoria.queue.push(new QueueItem(element, wybór));
        element.style[styleProp] = styling;
    }

    function setOff(element, kategoria) {
        kategoria.queue = kategoria.queue.filter(x => {
            return x.element != element
        })
        element.style[styleProp] = ''
    }


    if (element.style[styleProp] == '') {
        setOn(element, kategoria, wybór);

    } else {
        setOff(element, kategoria, wybór)
    }

    kategoria.blok.loadTextures(wybór.texture);
    kategoria.blok.updateColor(wybór.color);

    showPrice();
}

function showPrice() {
    let suma = 0;
    try {
        Kategoria.forEveryChild(x => {
            suma += x.cost;
        })
        output.innerText = suma + 'zł';
    } catch (error) {
        output.innerText = "--";
    }
}