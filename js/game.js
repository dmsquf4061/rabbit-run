document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded");

  //퍼즐게임s
  const puzzleArea = document.getElementById("puzzle_game");
  const completePopup = document.getElementById("puzzlegame_popup");
  const gridSize = 3;
  let pieces = [];
  let selectedPiece = null;
  let startPosition = null;

  // 이미지 경로 배열 (실제 이미지 경로로 대체)
  const imagePaths = [
    "./css/img/mural_1.png",
    "./css/img/mural_2.png",
    "./css/img/mural_3.png",
    "./css/img/mural_4.png",
    "./css/img/mural_5.png",
    "./css/img/mural_6.png",
    "./css/img/mural_7.png",
    "./css/img/mural_8.png",
    "./css/img/mural_9.png",
  ];

  // 퍼즐 조각 크기와 간격 계산
  function calculatePieceSize() {
    const puzzleWidth = puzzleArea.offsetWidth; // 퍼즐 영역의 가로 크기
    const pieceSize = Math.floor(puzzleWidth / gridSize); // 퍼즐 조각의 크기
    const gridSpacing = 0; // 여백 없애기 위해 gridSpacing을 0으로 설정

    return { pieceSize, gridSpacing };
  }

  // 퍼즐 조각 생성
  function createPieces() {
    // 퍼즐 영역에 기존 조각이 있으면 모두 제거
    pieces.forEach((piece) => piece.remove());
    pieces = [];

    const placedPositions = new Set();
    const { pieceSize, gridSpacing } = calculatePieceSize();

    for (let i = 0; i < gridSize * gridSize; i++) {
      const piece = document.createElement("button");
      piece.className = "puzzle_piece";

      // 이미지 요소 생성
      const img = document.createElement("img");
      img.src = imagePaths[i];
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";

      // 이미지를 퍼즐 조각에 추가
      piece.appendChild(img);

      let randomCol, randomRow, positionKey;
      do {
        randomCol = Math.floor(Math.random() * gridSize);
        randomRow = Math.floor(Math.random() * gridSize);
        positionKey = `${randomCol},${randomRow}`;
      } while (placedPositions.has(positionKey));

      placedPositions.add(positionKey);

      // 초기 위치 설정
      piece.style.left = `${randomCol * (pieceSize + gridSpacing)}px`;
      piece.style.top = `${randomRow * (pieceSize + gridSpacing)}px`;
      piece.dataset.col = randomCol;
      piece.dataset.row = randomRow;

      // 터치 및 마우스 이벤트 추가
      piece.addEventListener("mousedown", selectPiece);
      piece.addEventListener("touchstart", selectPiece);
      pieces.push(piece);
      puzzleArea.appendChild(piece);
    }
  }

  // 퍼즐 조각 선택
  function selectPiece(e) {
    const event = e.touches ? e.touches[0] : e;
    selectedPiece = e.target.closest(".puzzle_piece");
    if (!selectedPiece) return;

    const puzzleRect = puzzleArea.getBoundingClientRect();

    startPosition = {
      x: parseInt(selectedPiece.style.left),
      y: parseInt(selectedPiece.style.top),
    };

    const offsetX = event.clientX - puzzleRect.left - startPosition.x;
    const offsetY = event.clientY - puzzleRect.top - startPosition.y;

    startPosition.offsetX = offsetX;
    startPosition.offsetY = offsetY;

    selectedPiece.style.zIndex = "1000"; // z-index를 높여서 선택된 조각이 앞에 오도록 설정
    document.addEventListener("mousemove", movePiece);
    document.addEventListener("touchmove", movePiece, { passive: false });
    document.addEventListener("mouseup", dropPiece);
    document.addEventListener("touchend", dropPiece);
    e.preventDefault();
  }

  // 퍼즐 조각 이동
  function movePiece(e) {
    if (selectedPiece) {
      const event = e.touches ? e.touches[0] : e;
      const puzzleRect = puzzleArea.getBoundingClientRect();
      const { pieceSize, gridSpacing } = calculatePieceSize();

      let newX = event.clientX - puzzleRect.left - startPosition.offsetX;
      let newY = event.clientY - puzzleRect.top - startPosition.offsetY;

      // 새 위치가 퍼즐 영역 안에 있도록 제한
      newX = Math.max(0, Math.min(newX, puzzleArea.offsetWidth - pieceSize));
      newY = Math.max(0, Math.min(newY, puzzleArea.offsetHeight - pieceSize));

      // 그리드에 맞춰 위치를 맞추기
      const gridX =
        Math.round(newX / (pieceSize + gridSpacing)) *
        (pieceSize + gridSpacing);
      const gridY =
        Math.round(newY / (pieceSize + gridSpacing)) *
        (pieceSize + gridSpacing);

      selectedPiece.style.left = `${gridX}px`;
      selectedPiece.style.top = `${gridY}px`;
    }
  }

  // 퍼즐 조각 드롭
  function dropPiece() {
    if (selectedPiece) {
      const currentX = parseInt(selectedPiece.style.left);
      const currentY = parseInt(selectedPiece.style.top);

      const targetPiece = pieces.find(
        (piece) =>
          piece !== selectedPiece &&
          parseInt(piece.style.left) === currentX &&
          parseInt(piece.style.top) === currentY
      );

      if (targetPiece) {
        const targetX = parseInt(targetPiece.style.left);
        const targetY = parseInt(targetPiece.style.top);

        targetPiece.style.left = `${startPosition.x}px`;
        targetPiece.style.top = `${startPosition.y}px`;

        selectedPiece.style.left = `${targetX}px`;
        selectedPiece.style.top = `${targetY}px`;
      } else {
        selectedPiece.style.left = `${startPosition.x}px`;
        selectedPiece.style.top = `${startPosition.y}px`;
      }

      selectedPiece.style.zIndex = "";
      selectedPiece = null;

      checkCompletion(); // 퍼즐이 완성되었는지 확인
    }

    document.removeEventListener("mousemove", movePiece);
    document.removeEventListener("touchmove", movePiece);
    document.removeEventListener("mouseup", dropPiece);
    document.removeEventListener("touchend", dropPiece);
  }

  // 퍼즐 완성 확인
  function checkCompletion() {
    let completed = true;
    for (let i = 0; i < pieces.length; i++) {
      const { pieceSize, gridSpacing } = calculatePieceSize();
      const expectedX = (i % gridSize) * (pieceSize + gridSpacing);
      const expectedY = Math.floor(i / gridSize) * (pieceSize + gridSpacing);
      const actualX = parseInt(pieces[i].style.left);
      const actualY = parseInt(pieces[i].style.top);

      if (actualX !== expectedX || actualY !== expectedY) {
        completed = false;
        break;
      }
    }

    if (completed) {
      showCompletePopup();
    }
  }

  // 퍼즐 완성 팝업 표시
  const pungImg = document.querySelector(".pung_img");
  const successImg = document.querySelector(".success_img");

  function showCompletePopup() {
    completePopup.classList.add("on");
    pungImg.classList.add("on");

    // 일정 시간 후 두 번째 이미지 표시
    setTimeout(() => {
      successImg.classList.add("on");
    }, 300); // 1초(1000ms) 후 실행

    // 퍼즐 영역 클래스 추가
    puzzleArea.classList.add("on");

    disablePieces();
  }

  // 퍼즐 조각 이동 불가 상태로 설정
  function disablePieces() {
    pieces.forEach((piece) => {
      piece.style.cursor = "default";
      piece.removeEventListener("mousedown", selectPiece);
      piece.removeEventListener("touchstart", selectPiece);
    });

    // <div class="txt"> 내용 변경
    const txtDiv = document.querySelector(".puzzle_area .txt");
    if (txtDiv) {
      txtDiv.classList.add("on");
      txtDiv.innerHTML = "<div>성공이오!</div>";
    }
  }

  createPieces(); // 퍼즐 조각 생성

  // 윈도우 크기 변경 시 퍼즐 크기 재계산
  window.addEventListener("resize", function () {
    createPieces(); // 크기 변경 시 퍼즐을 새로 만들어서 다시 배치
  });

  //카드게임s
  // 전역 변수 설정
  const cards = document.querySelectorAll(".card");
  const completeButton = document.getElementById("cardgame_popup");
  let flippedCards = [];
  let isProcessing = false;

  // 이미지 경로 매핑
  const cardImages = {
    1: "./css/img/card_1.png",
    2: "./css/img/card_2.png",
    3: "./css/img/card_3.png",
  };

  // 카드에 이미지 추가
  function addCardImages() {
    cards.forEach((card) => {
      const value = card.dataset.value;
      const front = card.querySelector(".card-front");
      if (value && front) {
        front.style.backgroundImage = `url(${cardImages[value]})`;
        front.style.backgroundSize = "contain";
        front.style.backgroundPosition = "center";
        front.style.backgroundRepeat = "no-repeat";
      }
    });
  }

  // 카드 섞기 함수
  function shuffleCards() {
    const gameBoard = document.querySelector(".game_board");
    const cardArray = Array.from(cards);

    // Fisher-Yates 셔플 알고리즘
    for (let i = cardArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      gameBoard.appendChild(cardArray[j]);
    }
  }

  // 카드 클릭 이벤트 설정
  function initializeGame() {
    addCardImages(); // 이미지 추가
    shuffleCards(); // 카드 섞기
    cards.forEach((card) => {
      card.addEventListener("click", handleCardClick);
    });
  }

  // 카드 클릭 처리
  function handleCardClick(event) {
    const card = event.target.closest(".card");

    // 클릭 무시해야 할 상황 체크
    if (shouldIgnoreClick(card)) return;

    // 카드 뒤집기
    flipCard(card);

    // 두 카드가 뒤집혔을 때 처리
    if (flippedCards.length === 2) {
      handlePairComparison();
    }
  }

  // 클릭 무시해야 할 상황 체크
  function shouldIgnoreClick(card) {
    return (
      isProcessing ||
      card.classList.contains("flipped") ||
      card.classList.contains("matched") ||
      flippedCards.includes(card)
    );
  }

  // 카드 뒤집기
  function flipCard(card) {
    card.classList.add("flipped");
    flippedCards.push(card);
  }

  // 카드 짝 비교
  function handlePairComparison() {
    isProcessing = true;
    const [firstCard, secondCard] = flippedCards;

    if (isMatch(firstCard, secondCard)) {
      handleMatch(firstCard, secondCard);
      checkGameCompletion();
    } else {
      handleMismatch(firstCard, secondCard);
    }
  }

  // 카드 일치 확인
  function isMatch(card1, card2) {
    return card1.dataset.value === card2.dataset.value;
  }

  // 카드 일치했을 때 처리
  function handleMatch(card1, card2) {
    card1.classList.add("matched");
    card2.classList.add("matched");
    resetFlippedCards();
  }

  // 카드 불일치했을 때 처리
  function handleMismatch(card1, card2) {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      resetFlippedCards();
    }, 1000);
  }

  // 뒤집힌 카드 상태 초기화
  function resetFlippedCards() {
    flippedCards = [];
    isProcessing = false;
  }

  // 게임 완료 체크
  function checkGameCompletion() {
    const seaImg = document.querySelector(".sea_img");
    const pungpungImg = document.querySelector(".pungpung_img");
    const ceramicsImg = document.querySelector(".ceramics_img");
    const cardTxt = document.querySelector(".card_area .txt");
    const gameBoard = document.querySelector(".game_board");
    const allMatched = Array.from(cards).every((card) =>
      card.classList.contains("matched")
    );

    if (allMatched) {
      gameBoard.classList.add("on");
      completePopup.classList.add("on");
      pungpungImg.classList.add("on");
      seaImg.classList.add("on");

      // 일정 시간 후 두 번째 이미지 표시
      setTimeout(() => {
        ceramicsImg.classList.add("on");
      }, 300); // 1초(1000ms) 후 실행

      // 퍼즐 영역 클래스 추가
      completeButton.classList.add("on");

      disablePieces();

      cardTxt.classList.add("on");
      cardTxt.innerHTML = "<div>받으시오!</div>";

      // setTimeout(() => {
      //   completeButton.style.opacity = "block";
      // }, 1000);
    }
  }

  // 게임 전체 초기화
  function resetGame() {
    flippedCards = [];
    isProcessing = false;
    completeButton.style.display = "none";
    cards.forEach((card) => {
      card.classList.remove("flipped", "matched");
    });
    shuffleCards(); // 게임 리셋 시 카드 다시 섞기
  }

  // 게임 시작
  initializeGame();

  //달리기 게임
  const character = document.querySelector(".character");
  const climbButton = document.getElementById("climbButton");
  const goalAlert = document.getElementById("goalAlert");
  const runPath = document.querySelector(".run_path");

  let currentPosition = 0;
  const maxPosition = 5;

  function createVerticalPath() {
    for (let i = 0; i <= maxPosition; i++) {
      const segment = document.createElement("div");
      segment.classList.add("path-segment");
      segment.style.left = `${(i / maxPosition) * 100}%`;
      runPath.appendChild(segment);
    }
  }

  let currentOffset = -120; // 초기 위치를 -120%로 설정

  function updateCharacterPosition() {
    if (currentOffset < 0) {
      // currentOffset이 0%보다 작을 때만 실행
      currentOffset += 20;
      if (currentOffset > 0) {
        // 0%를 넘지 않도록 제한
        currentOffset = 0;
      }
      character.style.left = `${currentOffset}%`;
    }
  }

  function checkGoal() {
    if (currentPosition === maxPosition) {
      climbButton.disabled = true;

      goalAlert.style.display = "block";
      updateCharacterPosition();
    }
  }

  climbButton.addEventListener("click", () => {
    if (currentPosition < maxPosition) {
      currentPosition++;
      updateCharacterPosition();
      checkGoal();
    }
  });

  // 초기 설정
  createVerticalPath();
  updateCharacterPosition();
});
