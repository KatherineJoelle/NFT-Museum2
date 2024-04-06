import { createBaseScene } from './structures'
import { ElevatorModule } from './Elevator/elevator'
import { createAllDoors, doorSound } from './doors'
import { initializeKineticArt } from './Art/kineticArt'
import { initializeElevatorDoors } from './Elevator/elevatorDoors'
import { setupUi } from './UI/ui'
import { addArtworkData, artHoverSystem, changeArtHoverSystem, createArtHovers, createArtID } from './Art/artHover'
import { engine } from '@dcl/sdk/ecs'
import { creatAllLazyAreas } from './Lazy-Loading/lazyLoading'
import { createSocials } from './social'
import { createCustomTextPanels, createCustomTextTitles, createDefaultTexts } from './text'
import { shufflePlaylist, playlist, playCurrentSong } from './playlist'
import { playRadio } from './radio'



export function main() {

createBaseScene()
ElevatorModule.createElevator
initializeElevatorDoors()
createAllDoors()
initializeKineticArt()
creatAllLazyAreas()
createArtHovers()
createSocials()
setupUi()


// Change the active function below to toggle between default and custom title texts
createDefaultTexts()
//createCustomTextTitles()

// Customise in text.ts
createCustomTextPanels()




// Use these functions to trigger the playlist (also toggle playlist and radio booleans in audio.ts and ui.tsx)
shufflePlaylist(playlist)
playCurrentSong()
//togglePlay()

// Use this function to trigger the radio (also toggle playlist and radio booleans in audio.ts and ui.tsx)
playRadio()

engine.addSystem(changeArtHoverSystem)
engine.addSystem(artHoverSystem)


  
}
