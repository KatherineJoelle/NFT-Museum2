import { createBaseScene } from './structures'
import { ElevatorModule } from './Elevator/elevator'
import { createAllDoors, doorSound } from './doors'
import { initializeKineticArt } from './Art/kineticArt'
import { initializeElevatorDoors } from './Elevator/elevatorDoors'
//import VLM from 'vlm-dcl'
import { setupUi } from './UI/ui'
import { playCurrentSong, playRadio, playlist, shufflePlaylist } from './audio'
import { addArtworkData, artHoverSystem, changeArtHoverSystem, createArtHovers, createArtID } from './Art/artHover'
import { Transform, engine } from '@dcl/sdk/ecs'
import { Color3, Vector3 } from '@dcl/sdk/math'
import { gallery1Pos1, gallery1Pos2, gallery1Pos3, gallery1Pos4, gallery1Pos5, gallery1Rot1, gallery1Rot2, gallery1Rot3, gallery1Rot4, gallery1Rot5 } from './Art/artPositions'
import { createImageArt } from './Art/imageArt'
import { createNFT, canvasFrame } from './Art/nft'
import { creatAllLazyAreas } from './Lazy-Loading/lazyLoading'
import { groundVideo, logoImage, logoURL } from './Art/artData'



export function main() {

createBaseScene()
ElevatorModule.createElevator
initializeElevatorDoors()
createAllDoors()
initializeKineticArt()
creatAllLazyAreas()
createArtHovers()

setupUi()

// Use these functions to trigger the playlist (also toggle playlist and radio booleans in audio.ts and ui.tsx)
shufflePlaylist(playlist)
playCurrentSong()

// Use this function to trigger the radio (also toggle playlist and radio booleans in audio.ts and ui.tsx)
//playRadio()

engine.addSystem(changeArtHoverSystem)
engine.addSystem(artHoverSystem)



createImageArt(
    logoImage,
    gallery1Pos4,
    gallery1Rot4,
    Vector3.create(1, 1, 1),
    'Click',
    logoURL,
    true
);

createImageArt(
    logoImage,
    gallery1Pos5,
    gallery1Rot5,
    Vector3.One(),
    'Click',
    logoURL,
    true
)

/*
createToggleableArt(
    gallery1Pos2,
    gallery1Rot2,
    Vector3.create(.005 * 1096, .005 * 720, 1),
    logoImage,
    groundVideo,
    'Click',
    logoURL,
    Vector3.create(5, 5, 7)
)

createNFT(
    gallery1Pos1,
    gallery1Rot1,
    Vector3.create(4, 4, 4),
    urn2,
    Color3.Yellow(),
    canvasFrame,
    'Click'
)

createNFT(
    gallery1Pos3,
    gallery1Rot3,
    Vector3.create(4, 4, 4),
    urn3,
    Color3.Yellow(),
    canvasFrame,
    'Click'
)
*/


  
}