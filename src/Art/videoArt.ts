import { engine, Transform, MeshRenderer, MeshCollider, Material, VideoPlayer, InputAction, pointerEventsSystem, Entity } from '@dcl/sdk/ecs';
import * as utils from '@dcl-sdk/utils';
import { openExternalUrl } from '~system/RestrictedActions';
import { Quaternion, Color3, Color4, Vector3 } from '@dcl/sdk/math';
import { artPos14, artPos15, artPos2, artPos25, artPos26, artRot14, artRot15, artRot2, artRot25, artRot26 } from './artPositions';
import { togglePlay } from '../Audio/audio';
import { homepageUrl, linktreeURL } from '../social';

let videoPlayer: any;
let isImage = true

let verticalVideo = 'https://player.vimeo.com/external/931742718.m3u8?s=efbe1b55804e4ba10b2e8c17e241d1809d324f36&logging=false'
let verticalVideoPlaceholder = 'https://bafkreicuvnybcylixwtpxslw4cvwmtwg566z2d6cinxshqbg25lhojkqtq.ipfs.nftstorage.link/' // image placeholder

let verticalVarbarianVid = 'https://player.vimeo.com/external/931794663.m3u8?s=3a78fb41c8f6e7f39962465441abecbe7a056262&logging=false'
let verticalVarbarianPlaceholder = 'https://bafkreibuzswvpnmmvux3b6vfwfeggbmakubxwdztrqmqerjjm7ba6efcpu.ipfs.nftstorage.link/'

let horizontalVideoMVFW23 = 'https://player.vimeo.com/external/931744777.m3u8?s=2a274c3898d4aa78fdb7cddf0a0329d25693b056&logging=false'
let horizontalVideoMVFW23placeholder = 'https://bafybeigpiynyk563o5rd4wzz62lx7gkncdrnozhzit4l7s4maxc5mffgbm.ipfs.nftstorage.link/' // image placeholder

let horizontalVideoLPMxSOA = 'https://player.vimeo.com/external/711197011.m3u8?s=1fe29a85f3c1455580a070eee4fb93abcb2ed5a2&logging=false'
let horizontalVideoLPMxSOAplaceholder = 'https://bafkreigpeshmzddtlhw5tpxa55z3lfv7yjyzpkoj3s7vc5wxyuy367o5ji.ipfs.nftstorage.link/' // image placeholder

let horizontalVideoIndieVillage = 'https://player.vimeo.com/external/931792879.m3u8?s=fa7ece24dfd2899ddac2112250092c4be5dbdff0&logging=false'
let horizontalVideoIndieVillagePlaceholder = 'https://bafkreie2rucyrbnl5en7bccthydcxsmddhffp4oincu7afc2jt53u4eb6e.ipfs.nftstorage.link/' // image placeholder

export type VideoData = {
  room: number;
  id: number;
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
  image: string;
  video: string;
  hoverText: string;
  website: string;
  triggerScale: Vector3;
  triggerPosition: Vector3;
  audio?: boolean;
  hasAlpha?: boolean;
};

export async function createVideoArt(videoData: VideoData): Promise<Entity | null> {
  const { position, rotation, scale, image, video, hoverText, website, triggerScale, triggerPosition, audio = true, hasAlpha = false } = videoData;

  try {
    const entity = engine.addEntity();
    MeshRenderer.setPlane(entity);
    MeshCollider.setPlane(entity);

    Transform.createOrReplace(entity, {
      position: position,
      rotation: Quaternion.fromEulerDegrees(rotation.x, rotation.y, rotation.z),
      scale: scale,
    });

    const imageMaterial = Material.Texture.Common({ src: image });
    const videoTexture = Material.Texture.Video({ videoPlayerEntity: entity });

    Material.setPbrMaterial(entity, {
      texture: hasAlpha ? videoTexture : imageMaterial,
      roughness: 1,
      specularIntensity: 0,
      metallic: 0,
      emissiveColor: Color3.White(),
      emissiveIntensity: 1,
      emissiveTexture: hasAlpha ? videoTexture : imageMaterial,
      transparencyMode: hasAlpha ? 1 : undefined,
      alphaTexture: hasAlpha ? videoTexture : undefined,
      alphaTest: hasAlpha ? 0.5 : undefined,
    });

    pointerEventsSystem.onPointerDown(
      {
        entity: entity,
        opts: {
          button: InputAction.IA_POINTER,
          hoverText: hoverText,
        },
      },
      () => {
        console.log('Clicked artwork');
        openExternalUrl({ url: website });
      }
    );

    const videoPlayer = VideoPlayer.create(entity, {
      src: video,
      playing: false,
      loop: true,
    });

    if (!videoPlayer) {
      console.error('Failed to create video player.');
      return null;
    }

    utils.triggers.addTrigger(
      utils.addTestCube({ position: triggerPosition, scale: triggerScale }, undefined, undefined, Color4.create(1, 1, 1, 0), undefined, true),
      utils.NO_LAYERS,
      utils.LAYER_1,
      [{ type: 'box', scale: triggerScale }],
      (otherEntity) => {
        if (!otherEntity || !videoPlayer) return;
        isImage = true
        videoPlayer.playing = true
        Material.setPbrMaterial(entity, {
          texture: isImage ? videoTexture : imageMaterial,
          roughness: 1,
          specularIntensity: 0,
          metallic: 0,
          emissiveColor: Color3.White(),
          emissiveIntensity: 1,
          emissiveTexture: isImage ? videoTexture : imageMaterial,
          transparencyMode: hasAlpha ? 1 : undefined,
          alphaTexture: hasAlpha ? videoTexture : undefined,
          alphaTest: hasAlpha ? 0.5 : undefined,
        });
        VideoPlayer.createOrReplace(entity, {
          src: video,
          playing: true,
          loop: true
        })
        if (audio) togglePlay();
      },
      (onExit) => {
        if (videoPlayer) {
          VideoPlayer.getMutable(entity).playing = false
        }
        if (!videoPlayer) return;
        isImage = false
        videoPlayer.playing = false;
        Material.setPbrMaterial(entity, {
          texture: isImage ? videoTexture : imageMaterial,
          roughness: 1,
          specularIntensity: 0,
          metallic: 0,
          emissiveColor: Color3.White(),
          emissiveIntensity: 1,
          emissiveTexture: isImage ? videoTexture : imageMaterial,
          transparencyMode: hasAlpha ? 1 : undefined,
          alphaTexture: hasAlpha ? videoTexture : undefined,
          alphaTest: hasAlpha ? 0.5 : undefined,
        });
        if (audio) togglePlay();
      }
    );

    return entity;
  } catch (error) {
    console.error('Error creating video art:', error);
    return null;
  }
}

export const videoCollection: VideoData[] = [
  {
    room: 1,
    id: 2,
    position: artPos2,
    rotation: artRot2,
    scale: Vector3.create(0.003 * 1920, 0.003 * 1080, 1),
    image: horizontalVideoMVFW23placeholder,
    video: horizontalVideoMVFW23,
    hoverText: 'Click',
    website: homepageUrl,
    triggerScale: Vector3.create(4, 2, 10),
    triggerPosition: Vector3.create(artPos2.x + 2, artPos2.y - 1, artPos2.z),
    audio: true,
    hasAlpha: false
  },
  {
    room: 2,
    id: 14,
    position: artPos14,
    rotation: artRot14,
    scale: Vector3.create(0.0025 * 1920, 0.0025 * 1080, 1),
    image: horizontalVideoLPMxSOAplaceholder,
    video: horizontalVideoLPMxSOA,
    hoverText: 'Click',
    website: linktreeURL,
    triggerScale: Vector3.create(2, 2, 2),
    triggerPosition: Vector3.create(artPos14.x + 2, artPos14.y - 1, artPos14.z),
    audio: true,
    hasAlpha: false

  },
  {
    room: 2,
    id: 15,
    position: artPos15,
    rotation: artRot15,
    scale: Vector3.create(0.0025 * 1920, 0.0025 * 1080, 1),
    image: horizontalVideoIndieVillagePlaceholder,
    video: horizontalVideoIndieVillage,
    hoverText: 'Click',
    website: linktreeURL,
    triggerScale: Vector3.create(2, 2, 2),
    triggerPosition: Vector3.create(artPos15.x + 2, artPos15.y - 1, artPos15.z),
    audio: true,
    hasAlpha: false

  },
  {
    room: 2,
    id: 25,
    position: artPos25,
    rotation: artRot25,
    scale: Vector3.create(6, 8.65, 1),
    image: verticalVarbarianPlaceholder,
    video: verticalVarbarianVid,
    hoverText: 'Click',
    website: linktreeURL,
    triggerScale: Vector3.create(8, 6, 6),
    triggerPosition: Vector3.create(artPos25.x, artPos25.y - 1, artPos25.z - 2),
    audio: false,
    hasAlpha: false
  },
  {
    room: 2,
    id: 26,
    position: artPos26,
    rotation: artRot26,
    scale: Vector3.create(6, 8.65, 1),
    image: verticalVideoPlaceholder,
    video: verticalVideo,
    hoverText: 'Click',
    website: linktreeURL,
    triggerScale: Vector3.create(8, 6, 8),
    triggerPosition: Vector3.create(artPos26.x, artPos26.y - 1, artPos26.z + 2),
    audio: true,
    hasAlpha: false
  }
]

