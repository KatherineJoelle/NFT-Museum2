


Audio Credits: 

Sliding doors sound: Magnesus https://freesound.org/people/Magnesus/sounds/368084/ 
Call Button click sound: BaggoNotes https://freesound.org/people/BaggoNotes/sounds/721503/  
Moving elevator sound: Isaac200000 https://freesound.org/people/Isaac200000/sounds/260571/ 
Elevator button click sound: Kickhat https://freesound.org/people/kickhat/sounds/264447/ 
Elevator arrival sound: MATRIXXX___ https://freesound.org/people/MATRIXXX_/sounds/514864/
Radio station: 24 House Radio https://onlineradiobox.com/ro/24house/?cs=ro.24house 
Playlist: Featuring music by DJ Red Albert, performed in DCL and available with the Red Albert Radio Smart Wearable 


All of the audios are controlled by the functions in audio.ts so:

import { playAudioAtPlayer } from "./audio";



To use the elevator code to add an elevator to your scene, copy and paste elevator.ts into your scene project and add the following into your index file:

import { ElevatorModule } from './elevator'

ElevatorModule.createElevator

If your project works with one elevator instead of two, take a quick look at the elevator code and follow the commented instructions. 


To add sliding doors into your project, copy and paste doors.ts into your scene project and add the following to your index.ts file: 

import { createAllDoors } from './doors'

createAllDoors()

Inside doors.ts there's a function called 'createAllDoors()' within which you can define the amount of total doors and the individual positions and rotations.



To add nfts use the function provided in nft.ts, you can customize the urn of the NFT on display (see how to get the URN here: 
For example:

urn:decentraland:ethereum:erc721:0x06012c8cf97BEaD5deAe237070F9587f8E7A266d:558536

The example above fetches an NFT with the contract address 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d, and the specific identifier 558536. The corresponding asset asset can be found in OpenSea at https://opensea.io/assets/0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/558536 .
), 
as well as the frame background colour and frame style. You can also reposition, rotate and scale the nft within the same function


To set up Wearable claiming, copy and paste the claim-droping folder into your project, alongside config.ts and claim.ui.tsx


To host your images on an external site, instead of uploading them as files in your scene, you can use CORS friendly hosting services such as NFT.storage (https://nft.storage/). Upload your image, click 'Actions' - 'View URL' and copy the full url from the browser. 


# SDK7 Template scene

## Try it out

**Previewing the scene**

1. Download this repository.

2. Install the [Decentraland Editor](https://docs.decentraland.org/creator/development-guide/sdk7/editor/)

3. Open a Visual Studio Code window on this scene's root folder. Not on the root folder of the whole repo, but instead on this sub-folder that belongs to the scene.

4. Open the Decentraland Editor tab, and press **Run Scene**

Alternatively, you can use the command line. Inside this scene root directory run:

```
npm run start
```

## What's new on SDK 7

Below are some basic concepts about the SDK 7 syntax. For more details, see the [Documentation site](https://docs.decentraland.org/creator/).

### Entities

An Entity is just an ID. It is an abstract concept not represented by any data structure. There is no "class Entity". Just a number that is used as a reference to group different components.

```ts
const myEntity = engine.addEntity()
console.console.log(myEntity) // 100

// Remove Entity
engine.removeEntity(myEntity)
```

> Note: Note that it's no longer necessary to separately create an entity and then add it to the engine, this is all done in a single act.

### Components

The component is just a data container, WITHOUT any functions.

To add a component to an entity, the entry point is now the component type, not the entity.

```ts
Transform.create(myEntity, <params>)
```

This is different from how the syntax was in SDK6:

```ts
// OLD Syntax
myEntity.addComponent(Transform)
```

#### Base Components

Base components already come packed as part of the SDK. Most of them interact directly with the renderer in some way. This is the full list of currently supported base components:

- Transform
- Animator
- Material
- MeshRenderer
- MeshCollider
- AudioSource
- AudioStream
- AvatarAttach
- AvatarModifierArea
- AvatarShape
- Billboard
- CameraMode
- CameraModeArea
- GltfContainer
- NftShape
- PointerEventsResult
- PointerHoverFeedback
- PointerLock
- Raycast
- RaycastResult
- TextShape
- VisibilityComponent

```ts
const entity = engine.addEntity()
Transfrom.create(entity, {
  position: Vector3.create(12, 1, 12)
  scale: Vector3.One(),
  rotation: Quaternion.Identity()
})
GltfContainer.create(zombie, {
  withCollisions: true,
  isPointerBlocker: true,
  visible: true,
  src: 'models/zombie.glb'
})
```

#### Custom Components

Each component must have a unique number ID. If a number is repeated, the engine or another player receiving updates might apply changes to the wrong component. Note that numbers 1-2000 are reserved for the base components.

When creating a custom component you declare the schema of the data to be stored in it. Every field in a component MUST belong to one of the built-in special schemas provided as part of the SDK. These special schemas include extra functionality that allows them to be serialized/deserialized.

Currently, the names of these special schemas are:

##### Primitives

1. `Schemas.Boolean`: true or false (serialized as a Byte)
2. `Schemas.String`: UTF8 strings (serialized length and content)
3. `Schemas.Float`: single precission float
4. `Schemas.Double`: double precision float
5. `Schemas.Byte`: a single byte, integer with range 0..255
6. `Schemas.Short`: 16 bits signed-integer with range -32768..32767
7. `Schemas.Int`: 32 bits signed-integer with range -2³¹..(2³¹-1)
8. `Schemas.Int64`: 64 bits signed-integer
9. `Schemas.Number`: an alias to Schemas.Float

##### Specials

10. `Schemas.Entity`: a wrapper to int32 that casts the type to `Entity`
11. `Schemas.Vector3`: a Vector3 with { x, y, z }
12. `Schemas.Quaternion`: a Quaternion with { x, y, z, w}
13. `Schemas.Color3`: a Color3 with { r, g, b }
14. `Schemas.Color4`: a Colo4 with { r, g, b, a }

##### Schema generator

15. `Schemas.Enum`: passing the serialization Schema and the original Enum as generic
16. `Schemas.Array`: passing the item Schema
17. `Schemas.Map`: passing a Map with Schemas as values
18. `Schemas.Optional`: passing the schema to serialize

Below are some examples of how these schemas can be declared.

```ts
const object = Schemas.Map({ x: Schemas.Int }) // { x: 1 }

const array = Schemas.Map(Schemas.Int) // [1,2,3,4]

const objectArray = Schemas.Array(Schemas.Map({ x: Schemas.Int })) // [{ x: 1 }, { x: 2 }]

const BasicSchemas = Schemas.Map({
  x: Schemas.Int,
  y: Schemas.Float,
  text: Schemas.String,
  flag: Schemas.Boolean
}) // { x: 1, y: 1.412, text: 'ecs 7 text', flag: true }

const VelocitySchema = Schemas.Map({
  x: Schemas.Float,
  y: Schemas.Float,
  z: Schemas.Float
})
```

To then create a custom component using one of these schemas, use the following syntax:

```ts
export const myCustomComponent = engine.defineComponent(MyDataSchema, ComponentID)
```

For contrast, below is an example of how components were constructed prior to SDK 7.

```ts
/**
 * OLD SDK
 */

// Define Component
@Component('velocity')
export class Velocity extends Vector3 {
  constructor(x: number, y: number, z: number) {
    super(x, y, z)
  }
}
// Create entity
const wheel = new Entity()

// Create instance of component with default values
wheel.addComponent(new WheelSpin())

/**
 * ECS 7
 */
// Define Component
const VelocitySchema = Schemas.Map({
  x: Schemas.Float,
  y: Schemas.Float,
  z: Schemas.Float
})
const COMPONENT_ID = 2008
const VelocityComponent = engine.defineComponent(Velocity, COMPONENT_ID)
// Create Entity
const entity = engine.addEntity()

// Create instance of component
VelocityComponent.create(entity, { x: 1, y: 2.3, z: 8 })

// Remove instance of a component
VelocityComponent.deleteFrom(entity)
```

### Systems

Systems are pure & simple functions.
All your logic comes here.
A system might hold data which is relevant to the system itself, but no data about the entities it processes.

To add a system, all you need to do is define a function and add it to the engine. The function may optionally include a `dt` parameter with the delay since last frame, just like in prior versions of the SDK.

```ts
// Basic system
function mySystem() {
  console.log('my system is running')
}

engine.addSystem(mySystem)

// System with dt
function mySystemDT(dt: number) {
  console.log('time since last frame:  ', dt)
}

engine.addSystem(mySystemDT)
```

#### Query components

The way to group/query the components inside systems is using the method getEntitiesWith.
`engine.getEntitiesWith(...components)`.

```ts
function physicsSystem(dt: number) {
  for (const [entity, transform, velocity] of engine.getEntitiesWith(Transform, Velocity)) {
    // transform & velocity are read only components.
    if (transform.position.x === 10) {
      // To update a component, you need to call the `.mutable` method
      const mutableVelocity = VelocityComponent.getMutable(entity)
      mutableVelocity.x += 1
    }
  }
}

// Add system to the engine
engine.addSystem(physicsSystem)

// Remove system
engine.removeSystem(physicsSystem)
```

### Mutability

Mutability is now an important distinction. We can choose to deal with mutable or with immutable versions of a component. We should use `getMutable` only when we plan to make changes to a component. Dealing with immutable versions of components results in a huge gain in performance.

The `.get()` function in a component returns an immutable version of the component. You can only read its values, but can't change any of the properties on it.

```ts
const immutableTransform = Transform.get(myEntity)
```

To fetch the mutable version of a component, call it via `ComponentDefinition.getMutable()`. For example:

```ts
const mutableTransform = Transform.getMutable(myEntity)
```
