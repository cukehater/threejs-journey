/**
 * sources (로드할 리소스 목록)
 * ----------------------------------------
 * 클래스가 아니라 "설정 데이터" 배열입니다.
 * Resources 클래스가 이 배열을 보고 타입별로 로드하고, name으로 items[이름]에 저장합니다.
 */
export default [
  {
    name: "environmentMapTexture",
    type: "cubeTexture",
    path: [
      "/textures/environmentMap/px.jpg",
      "/textures/environmentMap/nx.jpg",
      "/textures/environmentMap/py.jpg",
      "/textures/environmentMap/ny.jpg",
      "/textures/environmentMap/pz.jpg",
      "/textures/environmentMap/nz.jpg",
    ],
  },
  {
    name: "grassColorTexture",
    type: "texture",
    path: "/textures/dirt/color.jpg",
  },
  {
    name: "grassNormalTexture",
    type: "texture",
    path: "/textures/dirt/normal.jpg",
  },
  {
    name: "foxModel",
    type: "gltfModel",
    path: "/models/Fox/glTF/Fox.gltf",
  },
];
