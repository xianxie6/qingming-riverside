export const VERSION="topographic-1";
export const targets=[
  {
    "id": "mill",
    "name": "水磨作坊",
    "difficulty": "入门",
    "clue": "找找画卷左侧，借水力干活的木屋。",
    "description": "一条细水渠绕过田地，来到木屋旁的水车。顺着水流看，作坊、田地与河岸彼此相连，画中的生产生活就在这一角展开。",
    "thumbnail": "assets/explore/mill.webp",
    "hitAreas": [
      {
        "type": "rect",
        "x": 0.074,
        "y": 0.548,
        "w": 0.071,
        "h": 0.109
      }
    ],
    "focusPoint": [
      0.10949999999999999,
      0.6025
    ],
    "hintText": "左侧田地下面，小水渠拐弯的地方。",
    "hintRegion": [
      0.10949999999999999,
      0.6025,
      0.09939999999999999,
      0.2
    ]
  },
  {
    "id": "bridge",
    "name": "虹桥",
    "difficulty": "入门",
    "clue": "哪座桥把两岸的烟火连在一起？",
    "description": "桥横跨两岸，连接茶市与城门方向的街道。桥面上的细小身影和桥下的船只，把陆路与水路交汇的日常留在了同一幅画里。",
    "thumbnail": "assets/explore/bridge.webp",
    "hitAreas": [
      {
        "type": "rect",
        "x": 0.443,
        "y": 0.577,
        "w": 0.137,
        "h": 0.074
      }
    ],
    "focusPoint": [
      0.5115000000000001,
      0.614
    ],
    "hintText": "画卷中间，两条水道相遇的上方。",
    "hintRegion": [
      0.5115000000000001,
      0.614,
      0.1918,
      0.2
    ]
  },
  {
    "id": "gate",
    "name": "城门",
    "difficulty": "入门",
    "clue": "沿着右侧街道，找一座灰瓦城门。",
    "description": "沿着市集向里走，城门横在道路前方。厚重的墙身和层叠的屋顶形成醒目的入口，门前的空地则让来往人群与货物有了停留之处。",
    "thumbnail": "assets/explore/gate.webp",
    "hitAreas": [
      {
        "type": "rect",
        "x": 0.882,
        "y": 0.403,
        "w": 0.063,
        "h": 0.15
      }
    ],
    "focusPoint": [
      0.9135,
      0.47800000000000004
    ],
    "hintText": "右侧城墙中间，宽阔街道的尽头。",
    "hintRegion": [
      0.9135,
      0.47800000000000004,
      0.09,
      0.24
    ]
  },
  {
    "id": "tower",
    "name": "山间高塔",
    "difficulty": "入门",
    "clue": "寻找层层屋檐围成的八角形建筑。",
    "description": "从上方看，塔的层叠屋檐收成一圈圈多边形。它立在树木与院落之间，形态不同于周围长方形的屋顶，是辨认这片街区的好线索。",
    "thumbnail": "assets/explore/tower.webp",
    "hitAreas": [
      {
        "type": "rect",
        "x": 0.682,
        "y": 0.045,
        "w": 0.046,
        "h": 0.117
      }
    ],
    "focusPoint": [
      0.7050000000000001,
      0.10350000000000001
    ],
    "hintText": "画卷右上方，围合庭院里面。",
    "hintRegion": [
      0.7050000000000001,
      0.10350000000000001,
      0.09,
      0.2
    ]
  },
  {
    "id": "tea",
    "name": "沿河茶市",
    "difficulty": "寻常",
    "clue": "找到左岸、茶市题签上方的一顶浅色棚。",
    "description": "浅色棚顶沿着街边展开，近处是河岸，远处是密集的屋舍。画面没有交代摊中的每件物品，却留出了一个可供停留与交谈的小角落。",
    "thumbnail": "assets/explore/tea.webp",
    "hitAreas": [
      {
        "type": "rect",
        "x": 0.314,
        "y": 0.523,
        "w": 0.035,
        "h": 0.051
      }
    ],
    "focusPoint": [
      0.3315,
      0.5485
    ],
    "hintText": "虹桥左侧，沿河茶市题签往上看。",
    "hintRegion": [
      0.3315,
      0.5485,
      0.09,
      0.2
    ]
  },
  {
    "id": "market",
    "name": "城门货市",
    "difficulty": "寻常",
    "clue": "在城门前找一组方方正正的货包。",
    "description": "方形货包成组堆放在街面上，周围留有供人通行的空隙。它们靠近城门与水岸，让这一片开阔街市显得忙碌，也让搬运的路径可被想象。",
    "thumbnail": "assets/explore/market.webp",
    "hitAreas": [
      {
        "type": "rect",
        "x": 0.865,
        "y": 0.681,
        "w": 0.027,
        "h": 0.055
      }
    ],
    "focusPoint": [
      0.8785,
      0.7085
    ],
    "hintText": "城门货市题签的右上方，开阔街面上。",
    "hintRegion": [
      0.8785,
      0.7085,
      0.09,
      0.2
    ]
  },
  {
    "id": "passenger",
    "name": "河中客船",
    "difficulty": "寻常",
    "clue": "找桥下竖着停在河心的篷船。",
    "description": "细长的船身浮在河面上，船篷覆盖着中段。桥与码头之间仍留着一段水面，岸上的街巷和水中的船只在这里形成两种不同的行进节奏。",
    "thumbnail": "assets/explore/passenger.webp",
    "hitAreas": [
      {
        "type": "rect",
        "x": 0.481,
        "y": 0.719,
        "w": 0.016,
        "h": 0.099
      }
    ],
    "focusPoint": [
      0.489,
      0.7685
    ],
    "hintText": "虹桥下方，主河道中间。",
    "hintRegion": [
      0.489,
      0.7685,
      0.09,
      0.2
    ]
  },
  {
    "id": "slender",
    "name": "细长小舟",
    "difficulty": "寻常",
    "clue": "桥的上游，有一艘斜向的细长舟。",
    "description": "小舟顺着狭长的河道斜斜停留，四周是浅青色的水纹。相比岸边的大船，它的轮廓更轻巧，也给密密排布的屋舍之间添出一处空白。",
    "thumbnail": "assets/explore/slender.webp",
    "hitAreas": [
      {
        "type": "rect",
        "x": 0.498,
        "y": 0.216,
        "w": 0.016,
        "h": 0.075
      }
    ],
    "focusPoint": [
      0.506,
      0.2535
    ],
    "hintText": "沿中央河道向上，在画面上部找。",
    "hintRegion": [
      0.506,
      0.2535,
      0.09,
      0.2
    ]
  },
  {
    "id": "cargo",
    "name": "岸边货船",
    "difficulty": "寻常",
    "clue": "找左岸码头下方、横停的宽船。",
    "description": "船贴着岸边停泊，船舱和甲板从上方清晰可见。近旁的岸线、木桩与通道组成一个小小码头，把河上的运输接到了城中的生活。",
    "thumbnail": "assets/explore/cargo.webp",
    "hitAreas": [
      {
        "type": "rect",
        "x": 0.209,
        "y": 0.807,
        "w": 0.06,
        "h": 0.044
      }
    ],
    "focusPoint": [
      0.239,
      0.8290000000000001
    ],
    "hintText": "茶市下方，两艘并排停靠的船中偏左的一艘。",
    "hintRegion": [
      0.239,
      0.8290000000000001,
      0.09,
      0.2
    ]
  },
  {
    "id": "walker",
    "name": "过桥行人",
    "difficulty": "细寻",
    "clue": "放大桥面，找靠近中央的一个小小身影。",
    "description": "放大桥面，才能看清那些小小的深色身影。人物在宽大的桥和屋舍之间显得很轻，却让这幅以建筑与地形为主的画面有了生活的尺度。",
    "thumbnail": "assets/explore/walker.webp",
    "hitAreas": [
      {
        "type": "rect",
        "x": 0.506,
        "y": 0.59,
        "w": 0.01,
        "h": 0.024
      }
    ],
    "focusPoint": [
      0.511,
      0.602
    ],
    "hintText": "虹桥桥面中部，浅色桥面上的深色人影。",
    "hintRegion": [
      0.511,
      0.602,
      0.09,
      0.2
    ]
  },
  {
    "id": "steps",
    "name": "临水台阶",
    "difficulty": "细寻",
    "clue": "右岸有一段斜向水面的阶梯。",
    "description": "一段台阶从街面伸向低处的水边，层层线条提示了岸与河的高差。船只停靠在附近，人们也可以沿着台阶接近河面，完成水陆之间的往来。",
    "thumbnail": "assets/explore/steps.webp",
    "hitAreas": [
      {
        "type": "rect",
        "x": 0.564,
        "y": 0.743,
        "w": 0.026,
        "h": 0.066
      }
    ],
    "focusPoint": [
      0.577,
      0.776
    ],
    "hintText": "虹桥右下方，弯曲河岸向水边伸出的地方。",
    "hintRegion": [
      0.577,
      0.776,
      0.09,
      0.2
    ]
  },
  {
    "id": "stall",
    "name": "街边摊位",
    "difficulty": "细寻",
    "clue": "找右岸街道旁，一顶小小的方形浅色摊棚。",
    "description": "小摊棚贴着屋舍沿街排列，浅色篷面与灰色瓦顶形成对照。只占画中很小的一块，却把原本规整的建筑边缘变成了可以驻足的街边空间。",
    "thumbnail": "assets/explore/stall.webp",
    "hitAreas": [
      {
        "type": "rect",
        "x": 0.658,
        "y": 0.619,
        "w": 0.018,
        "h": 0.03
      }
    ],
    "focusPoint": [
      0.667,
      0.634
    ],
    "hintText": "虹桥右边，深灰屋顶下方的一排摊棚。",
    "hintRegion": [
      0.667,
      0.634,
      0.09,
      0.2
    ]
  }
];
export const eggs=[{"id": "wheel", "point": [0.127, 0.641], "radius": 0.019, "effect": "glow", "text": "水流不息，作坊有声。"}, {"id": "market-sound", "point": [0.35, 0.65], "radius": 0.026, "effect": "sound", "text": "一声市井，茶棚边的片刻热闹。"}, {"id": "wake", "point": [0.165, 0.923], "radius": 0.027, "effect": "ripple", "text": "船过留波，水面记住了来路。"}];
