Page({
  data: {
    markers: [{
      iconPath: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1524827994124&di=bafb6cb579f94c07a5efaa153ba32612&imgtype=0&src=http%3A%2F%2Fpic3.16pic.com%2F00%2F53%2F72%2F16pic_5372096_b.jpg",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }],
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    controls: [{
      id: 1,
      iconPath: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1524827994124&di=3c354b4e83f279197ce7c79200459c25&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F34fae6cd7b899e51fab3e9c048a7d933c8950d21.jpg',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }]
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  }
})