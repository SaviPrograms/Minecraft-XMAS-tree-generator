class CubeTexture {
    constructor(src, left = '', top = left, front = left, back = left, bottom = top, right = left) {
        this.left = src + left;
        this.top = src + top;
        this.front = src + front;
        this.back = src + back;
        this.bottom = src + bottom;
        this.right = src + right;
    }
}

class QueueItem {
    constructor(element, choice) {
        this.choice = choice;
        this.element = element
    }
}

class Wybór {
    constructor(price, cubeTexture, color = 0xffffff) {
        this.texture = cubeTexture;
        this.color = color;
        this.price = price;
        this.used = 0;
    }
}

class Kategoria {
    static childs = [];
    constructor(options, blok, maxItems = -1) {
        this.queue = [];
        this.used = 0;
        this.maxItems = maxItems < 0 ? Infinity : maxItems;
        this.options = options;
        this.blok = blok;
        Kategoria.childs.push(this)
    }

    get length() {
        return this.queue.length;
    }

    get cost() {
        if (this.queue.length == 0) throw new Error("W queue musi być min. 1 element");
        return this.used * this.queue[0].choice.price
    }

    static forEveryChild(callback) {
        for (const child of this.childs) {
            callback(child)
        }
    }
}

class Blok {
    constructor(instacesNumber = 100, geo = new THREE.BoxBufferGeometry(1, 1, 1)) {
        this.mesh = new THREE.InstancedMesh(
            geo,
            new Array(6).fill(new THREE.MeshToonMaterial({
                transparent: true,
                side: THREE.DoubleSide
            })),
            instacesNumber
        )
        this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    }
    loadTextures = function(cubeTexture) {
        const {
            front,
            back,
            top,
            bottom,
            left,
            right
        } = cubeTexture;
        let textures = [
            front, back, top, bottom, left, right
        ]
        for (const i in this.mesh.material) {
            let x = this.mesh.material[i];
            const loader = new THREE.TextureLoader();

            let tex = loader.load(textures[i]);
            tex.magFilter = THREE.NearestFilter;
            x.map = tex;
            x.needsUpdate = true;
        }
    }

    updateColor(color) {
        for (const x of this.mesh.material) {
            x.color = new THREE.Color(color);
        }
    }
}


const drewno = new Blok(100);
const liscie = new Blok(100);
const bombki = new Blok(100, new THREE.BoxBufferGeometry(0.5, 0.5, 0.5));

const leavesType = new Kategoria({
    oak: new Wybór(1, new CubeTexture('res/textures/', 'oak_leaves.png'), 0x48B518),
    birch: new Wybór(1, new CubeTexture('res/textures/', 'birch_leaves.png'), 0x80a755),
    spruce: new Wybór(2, new CubeTexture('res/textures/', 'spruce_leaves.png'), 0x619961),
    acacia: new Wybór(3, new CubeTexture('res/textures/', 'acacia_leaves.png'), 0x48B518),
    jungle: new Wybór(6, new CubeTexture('res/textures/', 'jungle_leaves.png'), 0x48B518),
    dark: new Wybór(5, new CubeTexture('res/textures/', 'dark_oak_leaves.png'), 0x48B518),
    wool: new Wybór(2, new CubeTexture('res/textures/', 'wool.png'), 0x48B518)
}, liscie, 1)

const logType = new Kategoria({
    oak: new Wybór(2, new CubeTexture('res/textures/', 'oak_log.png', 'oak_log_top.png')),
    birch: new Wybór(2, new CubeTexture('res/textures/', 'birch_log.png', 'birch_log_top.png')),
    spruce: new Wybór(3, new CubeTexture('res/textures/', 'spruce_log.png', 'spruce_log_top.png')),
    acacia: new Wybór(5, new CubeTexture('res/textures/', 'acacia_log.png', 'acacia_log_top.png')),
    jungle: new Wybór(8, new CubeTexture('res/textures/', 'jungle_log.png', 'jungle_log_top.png')),
    dark: new Wybór(6, new CubeTexture('res/textures/', 'dark_oak_log.png', 'dark_oak_log_top.png')),
    crimson: new Wybór(300, new CubeTexture('res/textures/', 'crimson_stem.png', 'crimson_stem_top.png')),
    warped: new Wybór(450, new CubeTexture('res/textures/', 'warped_stem.png', 'warped_stem_top.png')),
    stripped_oak: new Wybór(5, new CubeTexture('res/textures/', 'stripped_oak_log.png', 'stripped_oak_log_top.png')),
    stripped_birch: new Wybór(3, new CubeTexture('res/textures/', 'stripped_birch_log.png', 'stripped_birch_log_top.png')),
    stripped_spruce: new Wybór(10, new CubeTexture('res/textures/', 'stripped_spruce_log.png', 'stripped_spruce_log_top.png')),
    stripped_acacia: new Wybór(15, new CubeTexture('res/textures/', 'stripped_acacia_log.png', 'stripped_acacia_log_top.png')),
    stripped_jungle: new Wybór(20, new CubeTexture('res/textures/', 'stripped_jungle_log.png', 'stripped_jungle_log_top.png')),
    stripped_dark: new Wybór(12, new CubeTexture('res/textures/', 'stripped_dark_oak_log.png', 'stripped_dark_oak_log_top.png')),
    stripped_crimson: new Wybór(500, new CubeTexture('res/textures/', 'stripped_crimson_stem.png', 'stripped_crimson_stem_top.png')),
    stripped_warped: new Wybór(600, new CubeTexture('res/textures/', 'stripped_warped_stem.png', 'stripped_warped_stem_top.png')),
    wool: new Wybór(1, new CubeTexture('res/textures/', 'wool.png'), 0xffffaf)
}, drewno, 1)

const bulbType = new Kategoria({
    gold: new Wybór(150, new CubeTexture('res/textures/', 'bulb_gold.png')),
    cyan: new Wybór(20, new CubeTexture('res/textures/', 'bulb_cyan.png')),
    orange: new Wybór(10, new CubeTexture('res/textures/', 'bulb_orange.png')),
    pink: new Wybór(15, new CubeTexture('res/textures/', 'bulb_pink.png')),
    red: new Wybór(30, new CubeTexture('res/textures/', 'bulb_red.png')),
}, bombki, 1)