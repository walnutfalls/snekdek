import { Assets, Sprite } from 'pixi.js';

// only load once, cache the output of this module
let spriteFactoryFunc = null;

/// Takes an array of image paths, ands loads them
const loadImages = (paths) => new Promise((resolve, reject) => {

    if (spriteFactoryFunc) resolve(spriteFactoryFunc);
        
    const ids = [];

    for(const p of paths) {
        const id = pathToId(p);
        ids.push(id);
        Assets.add({alias: id, src: p});
    }

    Assets.load(ids).then(textures => {
        const spriteCreators = ids.map(id => ({[id]: () => Sprite.from(textures[id]) }));
        const spriteFactory = Object.assign({}, ...spriteCreators)

        spriteFactoryFunc = id => spriteFactory[id]();
        resolve(spriteFactoryFunc);
    })
})

// by default, the file name without extension is used as id
function pathToId (fullPath) {
    const filename = fullPath.replace(/^.*[\\\/]/, '');
    return filename.replace(/\..+$/, '');
}


export default loadImages;