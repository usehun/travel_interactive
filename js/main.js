(() => {
  let yOffset = 0; // window.scrollY 대신 사용할 변수
  let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이의 합
  let currentScene = 0; // 현재 활성화된(눈 앞에 보고 있는) 씬(scroll-section)
  let enterNewScene = false; // 새로운 scene이 시작된 순간 true

  const sceneInfo = [
    {
      // 0번 인덱스
      type: "sticky",
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0, // 해당 섹션의 높이를 주기 위한 변수
      objs: {
        // 컨테이너는 해당 섹션의 위치
        container: document.querySelector("#scroll-section-0"),

        // 메세지는 해당 문장
        messageA: document.querySelector("#scroll-section-0 .main-message.a"),
        messageB: document.querySelector("#scroll-section-0 .main-message.b"),
        messageC: document.querySelector("#scroll-section-0 .main-message.c"),
        messageD: document.querySelector("#scroll-section-0 .main-message.d"),
        // 캔버스를 사용하기 위한 바탕
        canvas: document.querySelector("#video-canvas-0"),
        context: document.querySelector("#video-canvas-0").getContext("2d"),
        videoImages: [],
      },
      values: {
        VideoImageCount: 700,
        imageSequence: [0, 699],
        canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
        // 메세지의 투명도, 구간의 시작 비율과 끝 비율
        messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
        messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
        messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
        messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],

        messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
        messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
        messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
        messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],

        messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
        messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
        messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
        messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],

        messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
        messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
        messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
        messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
      },
    },
    {
      // 1번 인덱스
      type: "normal",
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-1"),
      },
    },
    {
      // 2번 인덱스
      type: "sticky",
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-2"),
        messageA: document.querySelector("#scroll-section-2 .main-message.a"),
        messageB: document.querySelector(".sticky-elem.desc-message.b"),
        messageC: document.querySelector(".sticky-elem.desc-message.c"),
        pinB: document.querySelector("sticky-elem desc-message.b pin"),
        pinC: document.querySelector("sticky-elem esc-message.c pin"),

        canvas: document.querySelector("#video-canvas-2"),
        context: document.querySelector("#video-canvas-2").getContext("2d"),
        videoImages: [],
      },
      values: {
        VideoImageCount: 430,
        imageSequence: [0, 429],
        canvas_opacity_in: [0, 1, { start: 0, end: 0.1 }],
        canvas_opacity_out: [1, 0, { start: 0.8, end: 0.9 }],

        messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
        messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
        messageA_translateX_in: [-5, 0, { start: 0.1, end: 0.2 }],
        messageA_translateX_out: [0, 5, { start: 0.25, end: 0.3 }],

        messageB_opacity_in: [0, 1, { start: 0.45, end: 0.5 }],
        messageB_opacity_out: [1, 0, { start: 0.55, end: 0.6 }],
        messageB_translateX_in: [-5, 0, { start: 0.45, end: 0.5 }],
        messageB_translateX_out: [0, 5, { start: 0.55, end: 0.6 }],

        messageC_opacity_in: [0, 1, { start: 0.65, end: 0.7 }],
        messageC_opacity_out: [1, 0, { start: 0.75, end: 0.8 }],
        messageC_translateX_in: [-5, 0, { start: 0.65, end: 0.7 }],
        messageC_translateX_out: [0, 5, { start: 0.75, end: 0.8 }],
      },
    },
    {
      // 3번 인덱스
      type: "sticky",
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-3"),
        canvas: document.querySelector(".image-blend-canvas"),
        context: document.querySelector(".image-blend-canvas").getContext("2d"),
        images: [],
        canvasCaption: document.querySelector(".canvas-caption"),
      },
      values: {
        ImageCount: 2,
        // 스크롤에 따른 변화는 값이기에 정확한 수치를 계산할 수 없어 자리만 만들어 둠
        rect1X: [0, 0, { start: 0, end: 0 }],
        rect2X: [0, 0, { start: 0, end: 0 }],
        rectStartY: 0,
        blendHeight: [0, 0, { start: 0, end: 0 }],
        canvasScale: [0, 0, { start: 0, end: 0 }],
        canvasCaption_opacity: [0, 1, { start: 0, end: 0 }],
        canvasCaption_translateY: [20, 0, { start: 0, end: 0 }],
      },
    },
  ];

  // 캔버스에 쓰이는 이미지를 따로 저장해주는 함수
  function setCanvasImage() {
    let imgElem;
    for (let i = 0; i < sceneInfo[0].values.VideoImageCount; i++) {
      imgElem = new Image();
      imgElem.src = `../pic/train/train_${i}.jpg`;
      sceneInfo[0].objs.videoImages.push(imgElem);
    }
    let imgElem2;
    for (let i = 0; i < sceneInfo[2].values.VideoImageCount; i++) {
      imgElem2 = new Image();
      imgElem2.src = `../pic/train_ani/${i + 1}.jpg`;
      sceneInfo[2].objs.videoImages.push(imgElem2);
    }

    let imgElem3;
    for (let i = 0; i < sceneInfo[3].values.ImageCount; i++) {
      imgElem3 = new Image();
      imgElem3.src = `../pic/${i + 1}.jpg`;
      sceneInfo[3].objs.images.push(imgElem3);
    }
  }

  // 네비게이션 css
  function checkMenu() {
    if (yOffset > 44) {
      document.body.classList.add("local-nav-sticky");
    } else {
      document.body.classList.remove("local-nav-sticky");
    }
  }

  function setLayout() {
    // 각 스크롤 섹션의 높이 세팅
    for (let i = 0; i < sceneInfo.length; i++) {
      if (sceneInfo[i].type === "sticky") {
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      } else if (sceneInfo[i].type === "normal") {
        sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
      }
      sceneInfo[
        i
      ].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }

    // 스크롤 위치를 알기 위해 한번 더 셋팅
    yOffset = window.scrollY;

    // 새로고침 했을 때 현재의 위치 씬을 구하기
    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;

      // 스크롤한 섹션의 합이 현재 스크롤을 넘어가면 해당 섹션이 현재 섹션이라고 인식하기 위함
      if (totalScrollHeight >= yOffset) {
        currentScene = i;
        break;
      }
    }
    // 새로고침 후 현재의 위치를 바디 태그에 넣어주기 위함
    document.body.setAttribute("id", `show-scene-${currentScene}`);

    const heightRatio = window.innerHeight / 1080;
    sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
    sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
  }

  function calcValues(values, sceneYoffset) {
    // return value
    let rv;
    // 해당 섹션에서의 스크롤 위치 비율
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = sceneYoffset / scrollHeight;

    if (values.length === 3) {
      // start ~ end 사이에 애니메이션 실행
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;

      if (sceneYoffset >= partScrollStart && sceneYoffset <= partScrollEnd) {
        rv =
          ((sceneYoffset - partScrollStart) / partScrollHeight) *
            (values[1] - values[0]) +
          values[0];
      } else if (sceneYoffset < partScrollStart) {
        // partScroll 비율 보다 작을 경우는 0
        rv = values[0];
      } else if (sceneYoffset > partScrollEnd) {
        // partScroll 비율 보다 큰 경우는 0
        rv = values[1];
      }
    } else {
      rv = scrollRatio * (values[1] - values[0]) + values[0];
    }

    return rv;
  }

  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    // 해당 섹션에서의 스크롤 Y 위치 값
    const sceneYoffset = yOffset - prevScrollHeight;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = sceneYoffset / scrollHeight;

    switch (currentScene) {
      case 0:
        // 부드러운 감속 효과로 이미지를 그려주는 방법을 사용하기 때문에 주석
        // let secuence = Math.round(
        //   calcValues(values.imageSequence, sceneYoffset)
        // );
        // objs.context.drawImage(objs.videoImages[secuence], 0, 0);

        objs.canvas.style.opacity = calcValues(
          values.canvas_opacity,
          sceneYoffset
        );

        if (scrollRatio <= 0.22) {
          //in
          // 해당 섹션에서 이벤트를 계산하기 위한 함수
          const messageA_opacity_in = calcValues(
            values.messageA_opacity_in,
            sceneYoffset
          );
          const messageA_translateY_in = calcValues(
            values.messageA_translateY_in,
            sceneYoffset
          );

          objs.messageA.style.opacity = messageA_opacity_in;
          objs.messageA.style.transform = `translateY(${messageA_translateY_in}%)`;
        } else {
          //out
          const messageA_opacity_out = calcValues(
            values.messageA_opacity_out,
            sceneYoffset
          );
          const messageA_translateY_out = calcValues(
            values.messageA_translateY_out,
            sceneYoffset
          );

          // 문장의 투명도 변화
          objs.messageA.style.opacity = messageA_opacity_out;
          objs.messageA.style.transform = `translateY(${messageA_translateY_out}%)`;
        }

        if (scrollRatio <= 0.42) {
          //in
          const messageB_opacity_in = calcValues(
            values.messageB_opacity_in,
            sceneYoffset
          );
          const messageB_translateY_in = calcValues(
            values.messageB_translateY_in,
            sceneYoffset
          );
          objs.messageB.style.opacity = messageB_opacity_in;
          objs.messageB.style.transform = `translateY(${messageB_translateY_in}%)`;
        } else {
          //out
          const messageB_opacity_out = calcValues(
            values.messageB_opacity_out,
            sceneYoffset
          );
          const messageB_translateY_out = calcValues(
            values.messageB_translateY_out,
            sceneYoffset
          );
          objs.messageB.style.opacity = messageB_opacity_out;
          objs.messageB.style.transform = `translateY(${messageB_translateY_out}%)`;
        }

        if (scrollRatio <= 0.62) {
          //in
          const messageC_opacity_in = calcValues(
            values.messageC_opacity_in,
            sceneYoffset
          );
          const messageC_translateY_in = calcValues(
            values.messageC_translateY_in,
            sceneYoffset
          );
          objs.messageC.style.opacity = messageC_opacity_in;
          objs.messageC.style.transform = `translateY(${messageC_translateY_in}%)`;
        } else {
          //out
          const messageC_opacity_out = calcValues(
            values.messageC_opacity_out,
            sceneYoffset
          );
          const messageC_translateY_out = calcValues(
            values.messageC_translateY_out,
            sceneYoffset
          );

          objs.messageC.style.opacity = messageC_opacity_out;
          objs.messageC.style.transform = `translateY(${messageC_translateY_out}%)`;
        }

        if (scrollRatio <= 0.82) {
          //in
          const messageD_opacity_in = calcValues(
            values.messageD_opacity_in,
            sceneYoffset
          );
          const messageD_translateY_in = calcValues(
            values.messageD_translateY_in,
            sceneYoffset
          );
          objs.messageD.style.opacity = messageD_opacity_in;
          objs.messageD.style.transform = `translateY(${messageD_translateY_in}%)`;
        } else {
          //out
          const messageD_opacity_out = calcValues(
            values.messageD_opacity_out,
            sceneYoffset
          );
          const messageD_translateY_out = calcValues(
            values.messageD_translateY_out,
            sceneYoffset
          );

          objs.messageD.style.opacity = messageD_opacity_out;
          objs.messageD.style.transform = `translateY(${messageD_translateY_out}%)`;
        }

        break;
      case 1:
        break;
      case 2:
        // let secuence2 = Math.round(
        //   calcValues(values.imageSequence, sceneYoffset)
        // );

        // objs.context.drawImage(objs.videoImages[secuence2], 0, 0);

        // 캔버스 투명도 시작될 때
        if (scrollRatio <= 0.5) {
          const canvas_opacity_in = calcValues(
            values.canvas_opacity_in,
            sceneYoffset
          );
          objs.canvas.style.opacity = canvas_opacity_in;
        } else {
          // 캔버스 투명도 빠질 때
          objs.canvas.style.opacity = calcValues(
            values.canvas_opacity_out,
            sceneYoffset
          );
        }

        if (scrollRatio <= 0.22) {
          const messageA_opacity_in = calcValues(
            values.messageA_opacity_in,
            sceneYoffset
          );
          objs.messageA.style.opacity = messageA_opacity_in;

          const messageA_translateX_in = calcValues(
            values.messageA_translateX_in,
            sceneYoffset
          );
          objs.messageA.style.transform = `translate3d(${messageA_translateX_in}%,0, 0)`;
        } else {
          const messageA_opacity_out = calcValues(
            values.messageA_opacity_out,
            sceneYoffset
          );
          objs.messageA.style.opacity = messageA_opacity_out;

          const messageA_translateX_out = calcValues(
            values.messageA_translateX_out,
            sceneYoffset
          );
          objs.messageA.style.transform = `translate3d(${messageA_translateX_out}%,0, 0)`;
        }

        if (scrollRatio <= 0.52) {
          const messageB_opacity_in = calcValues(
            values.messageB_opacity_in,
            sceneYoffset
          );
          objs.messageB.style.opacity = messageB_opacity_in;

          const messageB_translateX_in = calcValues(
            values.messageB_translateX_in,
            sceneYoffset
          );
          objs.messageB.style.transform = `translate3d(${messageB_translateX_in}%,0, 0)`;
        } else {
          const messageB_opacity_out = calcValues(
            values.messageB_opacity_out,
            sceneYoffset
          );
          objs.messageB.style.opacity = messageB_opacity_out;

          const messageB_translateX_out = calcValues(
            values.messageB_translateX_out,
            sceneYoffset
          );
          objs.messageB.style.transform = `translate3d(${messageB_translateX_out}%,0, 0)`;
        }

        if (scrollRatio <= 0.72) {
          const messageC_opacity_in = calcValues(
            values.messageC_opacity_in,
            sceneYoffset
          );
          objs.messageC.style.opacity = messageC_opacity_in;

          const messageC_translateX_in = calcValues(
            values.messageC_translateX_in,
            sceneYoffset
          );
          objs.messageC.style.transform = `translate3d(${messageC_translateX_in}%,0, 0)`;
        } else {
          const messageC_opacity_out = calcValues(
            values.messageC_opacity_out,
            sceneYoffset
          );
          objs.messageC.style.opacity = messageC_opacity_out;

          const messageC_translateX_out = calcValues(
            values.messageC_translateX_out,
            sceneYoffset
          );
          objs.messageC.style.transform = `translate3d(${messageC_translateX_out}%,0, 0)`;
        }

        // currentScene3 에서 갑자기 나타나는 캔버스를 미리 그려주기
        if (scrollRatio <= 0.9) {
          const objs = sceneInfo[3].objs;
          const values = sceneInfo[3].values;
          // 가로/ 세로 모두 꽉 차게 하기 위해 세팅(계산)
          const widthRatio = window.innerWidth / objs.canvas.width;
          const heightRatio = window.innerHeight / objs.canvas.height;

          let canvasScaleRatio;

          if (widthRatio <= heightRatio) {
            // 캔버스보다 브라우저 창이 홀쭉한 경우
            canvasScaleRatio = heightRatio;
          } else {
            // 캔버스보다 브라우저 창이 납작한 경우
            canvasScaleRatio = widthRatio;
          }

          objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
          objs.context.fillStyle = "white";
          objs.context.drawImage(objs.images[0], 0, 0);

          // 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
          const calculatedInnerWidth =
            document.body.offsetWidth / canvasScaleRatio;
          const calculatedInnerHeight = window.innerHeight / canvasScaleRatio;

          // 화면을 가려질 흰 박스
          const whiteRectWidth = calculatedInnerWidth * 0.15;

          // 캔버스에서 왼쪽 박스 시작점 계산
          values.rect1X[0] = (objs.canvas.width - calculatedInnerWidth) / 2;
          // 캔버스에서 왼쪽 박스 도착점 계산
          values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
          // 캔버스에서 오른쪽 박스 시작점 계산
          values.rect2X[0] =
            values.rect1X[0] + calculatedInnerWidth - whiteRectWidth;
          // 캔버스에서 오른쪽 박스 도착점 계산
          values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

          // 좌우 흰색 박스 그리기 (x, y, width, height) 그리기만
          objs.context.fillRect(
            parseInt(values.rect1X[0]),
            0,
            parseInt(whiteRectWidth),
            objs.canvas.height
          );
          objs.context.fillRect(
            parseInt(values.rect2X[0]),
            0,
            parseInt(whiteRectWidth),
            objs.canvas.height
          );
        }

        break;

      case 3:
        let step = 0;
        // 가로/ 세로 모두 꽉 차게 하기 위해 세팅(계산)
        const widthRatio = window.innerWidth / objs.canvas.width;
        const heightRatio = window.innerHeight / objs.canvas.height;

        let canvasScaleRatio;

        if (widthRatio <= heightRatio) {
          // 캔버스보다 브라우저 창이 홀쭉한 경우
          canvasScaleRatio = heightRatio;
        } else {
          // 캔버스보다 브라우저 창이 납작한 경우
          canvasScaleRatio = widthRatio;
        }

        objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
        objs.context.fillStyle = "white";
        objs.context.drawImage(objs.images[0], 0, 0);

        // 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
        const calculatedInnerWidth =
          document.body.offsetWidth / canvasScaleRatio;
        const calculatedInnerHeight = window.innerHeight / canvasScaleRatio;

        // 시작, 도착지점 구하기
        if (!values.rectStartY) {
          values.rectStartY =
            objs.canvas.offsetTop +
            (objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2;

          // 시작점
          values.rect1X[2].start = (window.innerHeight * 0.1) / scrollHeight;
          values.rect2X[2].start = (window.innerHeight * 0.1) / scrollHeight;

          // 도착점
          values.rect1X[2].end = values.rectStartY / scrollHeight;
          values.rect2X[2].end = values.rectStartY / scrollHeight;
        }

        // 화면을 가려질 흰 박스
        const whiteRectWidth = calculatedInnerWidth * 0.15;

        // 캔버스에서 왼쪽 박스 시작점 계산
        values.rect1X[0] = (objs.canvas.width - calculatedInnerWidth) / 2;
        // 캔버스에서 왼쪽 박스 도착점 계산
        values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
        // 캔버스에서 오른쪽 박스 시작점 계산
        values.rect2X[0] =
          values.rect1X[0] + calculatedInnerWidth - whiteRectWidth;
        // 캔버스에서 오른쪽 박스 도착점 계산
        values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

        // 좌우 흰색 박스 그리기 (x, y, width, height) 그리기만
        // objs.context.fillRect(
        //   values.rect1X[0],
        //   0,
        //   parseInt(whiteRectWidth),
        //   calculatedInnerHeight
        // );
        // objs.context.fillRect(
        //   values.rect2X[0],
        //   0,
        //   parseInt(whiteRectWidth),
        //   calculatedInnerHeight
        // );

        // 좌우 흰색 박스 그리기 (x, y, width, height) 애니메이션
        objs.context.fillRect(
          parseInt(calcValues(values.rect1X, sceneYoffset)),
          0,
          parseInt(whiteRectWidth),
          objs.canvas.height
        );
        objs.context.fillRect(
          parseInt(calcValues(values.rect2X, sceneYoffset)),
          0,
          parseInt(whiteRectWidth),
          objs.canvas.height
        );

        if (scrollRatio < values.rect1X[2].end) {
          // 스크롤이 화면 상단에 닿지 않았을 때
          step = 1;
          objs.canvas.classList.remove("sticky");
        } else {
          // 스크롤이 화면 상단에 닿고, 기존 화면은 포지션 고정, 이미지 블렌드
          step = 2;
          objs.canvas.classList.add("sticky");

          values.blendHeight[0] = 0;
          values.blendHeight[1] = objs.canvas.height;
          values.blendHeight[2].start = values.rect1X[2].end;
          values.blendHeight[2].end = values.blendHeight[2].start + 0.2;
          const blendHeight = calcValues(values.blendHeight, sceneYoffset);

          // 이미지 소스와 실제 이미지를 그리는 위치
          objs.context.drawImage(
            objs.images[1], // source 이미지
            0, // source x
            objs.canvas.height - blendHeight, // source y
            objs.canvas.width, // source width
            blendHeight, // source height
            0, // draw x
            objs.canvas.height - blendHeight, // draw y
            objs.canvas.width, // draw width
            blendHeight // draw height
          );

          // 스케일 조정된 캔버스의 위치를 상단에 다시 맞추는 과정
          objs.canvas.style.top = `${
            -(objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2
          }px`;

          // 이미지가 블렌드 되고 블렌드 된 이미지 스케일을 줄여주는 과정
          if (scrollRatio > values.blendHeight[2].end) {
            step = 3;

            values.canvasScale[0] = canvasScaleRatio;
            values.canvasScale[1] =
              document.body.offsetWidth / (1.5 * objs.canvas.width);
            values.canvasScale[2].start = values.blendHeight[2].end;
            values.canvasScale[2].end = values.canvasScale[2].start + 0.2;

            objs.canvas.style.transform = `scale(${calcValues(
              values.canvasScale,
              sceneYoffset
            )})`;

            // 스크롤을 내릴 때  준 마진을 올릴 때 초기화
            objs.canvas.style.marginTop = 0;
          }

          // 이미지 스케일이 줄어들고 고정된 이미지를 스크롤 하는 과정
          if (
            scrollRatio > values.canvasScale[2].end &&
            values.canvasScale[2].end > 0
          ) {
            step = 4;
            objs.canvas.classList.remove("sticky");
            objs.canvas.style.marginTop = `${scrollHeight * 0.4}px`;

            // 마지막 문단 애니메이션 작업 (투명도, Y 이동)
            values.canvasCaption_opacity[2].start = values.canvasScale[2].end;
            values.canvasCaption_opacity[2].end =
              values.canvasCaption_opacity[2].start + 0.1;

            values.canvasCaption_translateY[2].start =
              values.canvasCaption_opacity[2].start;
            values.canvasCaption_translateY[2].end =
              values.canvasCaption_opacity[2].end;

            objs.canvasCaption.style.opacity = calcValues(
              values.canvasCaption_opacity,
              sceneYoffset
            );

            objs.canvasCaption.style.transform = `translate3d(0, ${calcValues(
              values.canvasCaption_translateY,
              sceneYoffset
            )}%, 0)`;
          }
        }

        break;
    }
  }

  function scrollLoop() {
    // 스크롤 할 때 마다 계속해서 false로 변경
    enterNewScene = false;

    // 현재 스크롤 높이의 총 합
    prevScrollHeight = 0;

    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    // 현재 스크롤 된 위치가 이전 스크롤과 현재 씬의 스크롤보다 작을 때
    if (delayOffset < prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      document.body.classList.remove("scroll-effect-end");
    }

    // 현재 스크롤이 이전 스크롤 높이와 현재 보고있는 씬의 높이의 합보다 클 때
    if (delayOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true;
      if (currentScene === sceneInfo.length - 1) {
        document.body.classList.add("scroll-effect-end");
      }

      // 추가 컨텐츠를 이용 시 스크롤 씬 개수를 넘어가는 상황에 더 올라가지 못 하도록 사용
      if (currentScene < sceneInfo.length - 1) {
        currentScene++;
      }
      // 새로운 씬으로 바뀌는 순간을 트루로 만들어줌
    }

    // 현재 스크롤이 이전 스크롤 높이와 현재 보고있는 씬의 높이의 합보다 작을 때
    if (delayOffset < prevScrollHeight) {
      // 브라우저 바운스 효과로 인해 현재 씬이 마이너스가 되는 것을 방지 (모바일)
      if (currentScene === 0) return;
      // 새로운 씬으로 변경 된다면 true
      currentScene--;
      enterNewScene = true;
    }
    document.body.setAttribute("id", `show-scene-${currentScene}`);

    // 새로운 씬으로 바뀌었을 때 playAnimation 함수를 실행하지 않고 리턴함으로 음수 값이 나오지 않게 된다
    if (enterNewScene) return;
    playAnimation();
  }

  let acc = 0.1; // 가속도
  let delayOffset = 0;
  let rafId;
  let rafState;

  // 루프 함수
  function loop() {
    delayOffset = delayOffset + (yOffset - delayOffset) * acc;

    // enterNewScene === true 일 때 잠깐 실행하지 않도록

    if (currentScene === 0 || currentScene === 2) {
      const sceneYoffset = delayOffset - prevScrollHeight;
      const objs = sceneInfo[currentScene].objs;
      const values = sceneInfo[currentScene].values;

      let secuence = Math.round(calcValues(values.imageSequence, sceneYoffset));
      if (objs.videoImages[secuence]) {
        objs.context.drawImage(objs.videoImages[secuence], 0, 0);
      }
    }

    rafId = requestAnimationFrame(loop);

    if (Math.abs(yOffset - delayOffset) < 1) {
      cancelAnimationFrame(rafId);
      rafState = false;
    }
  }
  // 페이지를 로드할 때
  window.addEventListener("load", () => {
    document.body.classList.remove("before-load");
    setLayout();

    // 0번째 사진을, x, y 을 셋팅
    sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
    // sceneInfo[2].objs.context.drawImage(sceneInfo[2].objs.videoImages[0], 0, 0);
    // sceneInfo[3].objs.context.drawImage(sceneInfo[3].objs.images[0], 0, 0);

    let tempYoffset = yOffset;
    let tempScrollCount = 0;

    // 로드가 되고 나서 조금 스크롤을 시켜준다 로딩 후 화면이 안 나오는 문제
    if (yOffset > 0) {
      let siId = setInterval(() => {
        window.scrollTo(0, tempYoffset);
        tempYoffset += 1;

        if (tempScrollCount > 10) {
          clearInterval(siId);
        }
        tempScrollCount++;
      }, 100);
    }

    // 페이지를 스크롤할 때
    window.addEventListener("scroll", () => {
      yOffset = window.scrollY;
      scrollLoop();
      checkMenu();

      // 부드러운 감속 적용
      if (!rafState) {
        rafId = requestAnimationFrame(loop);
        rafState = true;
      }
    });

    // 화면 크기를 변경할 때
    window.addEventListener("resize", () => {
      window.location.reload();

      // 3번 씬은 계산을 한 스크롤 페이지이기 때문에 중간에 스크롤하면 이상해지는 경우를 대비하기 위해 아래 방법은 사용 안 함
      // setLayout();
      // sceneInfo[3].values.rectStartY = 0;
    });

    // 휴대폰 가로, 세로 모드 전환 시
    window.addEventListener("orientationchange", () => {
      scrollTo(0, 0);
      setTimeout(window.location.reload(), 300);
    });

    // 트랜지션 후에 로딩을 빼는 법
    document
      .querySelector(".loading")
      .addEventListener("transitionend", (e) => {
        document.body.removeChild(e.currentTarget);
      });
  });

  setCanvasImage();
})();
