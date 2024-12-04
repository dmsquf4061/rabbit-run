document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded");
    const puzzleArea = document.getElementById("puzzle_game");
    const completePopup = document.getElementById("complete_popup");
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
        "./css/img/mural_9.png"
    ];
    // 퍼즐 조각 크기와 간격 계산
    function calculatePieceSize() {
        const puzzleWidth = puzzleArea.offsetWidth; // 퍼즐 영역의 가로 크기
        const pieceSize = Math.floor(puzzleWidth / gridSize); // 퍼즐 조각의 크기
        const gridSpacing = 0; // 여백 없애기 위해 gridSpacing을 0으로 설정
        return {
            pieceSize,
            gridSpacing
        };
    }
    // 퍼즐 조각 생성
    function createPieces() {
        pieces.forEach((piece)=>piece.remove()); // 기존 퍼즐 조각 제거
        pieces = [];
        const { pieceSize, gridSpacing } = calculatePieceSize();
        const placedPositions = new Set();
        for(let i = 0; i < gridSize * gridSize; i++){
            const piece = document.createElement("div");
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
            }while (placedPositions.has(positionKey)); // 중복된 위치 방지
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
            y: parseInt(selectedPiece.style.top)
        };
        const offsetX = event.clientX - puzzleRect.left - startPosition.x;
        const offsetY = event.clientY - puzzleRect.top - startPosition.y;
        startPosition.offsetX = offsetX;
        startPosition.offsetY = offsetY;
        selectedPiece.style.zIndex = "1000"; // z-index를 높여서 선택된 조각이 앞에 오도록 설정
        document.addEventListener("mousemove", movePiece);
        document.addEventListener("touchmove", movePiece, {
            passive: false
        });
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
            const gridX = Math.round(newX / (pieceSize + gridSpacing)) * (pieceSize + gridSpacing);
            const gridY = Math.round(newY / (pieceSize + gridSpacing)) * (pieceSize + gridSpacing);
            selectedPiece.style.left = `${gridX}px`;
            selectedPiece.style.top = `${gridY}px`;
        }
    }
    // 퍼즐 조각 드롭
    function dropPiece() {
        if (selectedPiece) {
            const currentX = parseInt(selectedPiece.style.left);
            const currentY = parseInt(selectedPiece.style.top);
            const targetPiece = pieces.find((piece)=>piece !== selectedPiece && parseInt(piece.style.left) === currentX && parseInt(piece.style.top) === currentY);
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
        for(let i = 0; i < pieces.length; i++){
            const { pieceSize, gridSpacing } = calculatePieceSize();
            const expectedX = i % gridSize * (pieceSize + gridSpacing);
            const expectedY = Math.floor(i / gridSize) * (pieceSize + gridSpacing);
            const actualX = parseInt(pieces[i].style.left);
            const actualY = parseInt(pieces[i].style.top);
            if (actualX !== expectedX || actualY !== expectedY) {
                completed = false;
                break;
            }
        }
        if (completed) showCompletePopup();
    }
    // 퍼즐 완성 팝업 표시
    function showCompletePopup() {
        completePopup.classList.add("on");
        disablePieces();
    }
    // 퍼즐 조각 이동 불가 상태로 설정
    function disablePieces() {
        pieces.forEach((piece)=>{
            piece.style.cursor = "default";
            piece.removeEventListener("mousedown", selectPiece);
            piece.removeEventListener("touchstart", selectPiece);
        });
    }
    createPieces(); // 퍼즐 조각 생성
    // 윈도우 크기 변경 시 퍼즐 크기 재계산
    window.addEventListener("resize", function() {
        createPieces(); // 크기 변경 시 퍼즐을 새로 만들어서 다시 배치
    });
});

//# sourceMappingURL=index.fb67f16b.js.map
