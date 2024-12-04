document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded");
    const puzzleArea = document.getElementById("puzzle_game");
    const completePopup = document.getElementById("complete_popup");
    const gridSize = 3;
    const pieceSize = 100;
    const gridSpacing = 2;
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
    function createPieces() {
        const placedPositions = new Set();
        for(let i = 0; i < gridSize * gridSize; i++){
            const piece = document.createElement("div");
            piece.className = "puzzle_piece";
            piece.style.position = "absolute";
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
            }while (placedPositions.has(positionKey));
            placedPositions.add(positionKey);
            piece.style.left = `${randomCol * (pieceSize + gridSpacing)}px`;
            piece.style.top = `${randomRow * (pieceSize + gridSpacing)}px`;
            piece.dataset.col = randomCol;
            piece.dataset.row = randomRow;
            piece.addEventListener("mousedown", selectPiece);
            pieces.push(piece);
            puzzleArea.appendChild(piece);
        }
    }
    function selectPiece(e) {
        // 클릭된 요소가 이미지여도 부모 `.puzzle_piece`를 찾도록 수정
        selectedPiece = e.target.closest(".puzzle_piece");
        if (!selectedPiece) return;
        startPosition = {
            x: parseInt(selectedPiece.style.left),
            y: parseInt(selectedPiece.style.top)
        };
        selectedPiece.style.zIndex = "1000";
        document.addEventListener("mousemove", movePiece);
        document.addEventListener("mouseup", dropPiece);
        e.preventDefault();
    }
    function movePiece(e) {
        if (selectedPiece) {
            const puzzleRect = puzzleArea.getBoundingClientRect();
            let newX = e.clientX - puzzleRect.left - pieceSize / 2;
            let newY = e.clientY - puzzleRect.top - pieceSize / 2;
            newX = Math.max(0, Math.min(newX, 306 - pieceSize));
            newY = Math.max(0, Math.min(newY, 306 - pieceSize));
            const gridX = Math.round(newX / (pieceSize + gridSpacing)) * (pieceSize + gridSpacing);
            const gridY = Math.round(newY / (pieceSize + gridSpacing)) * (pieceSize + gridSpacing);
            selectedPiece.style.left = `${gridX}px`;
            selectedPiece.style.top = `${gridY}px`;
        }
    }
    function dropPiece() {
        if (selectedPiece) {
            const currentX = parseInt(selectedPiece.style.left);
            const currentY = parseInt(selectedPiece.style.top);
            const targetPiece = pieces.find((piece)=>piece !== selectedPiece && parseInt(piece.style.left) === currentX && parseInt(piece.style.top) === currentY);
            if (targetPiece) {
                targetPiece.style.left = `${startPosition.x}px`;
                targetPiece.style.top = `${startPosition.y}px`;
            } else {
                selectedPiece.style.left = `${startPosition.x}px`;
                selectedPiece.style.top = `${startPosition.y}px`;
            }
            selectedPiece.style.zIndex = "";
            selectedPiece = null;
            checkCompletion();
        }
        document.removeEventListener("mousemove", movePiece);
        document.removeEventListener("mouseup", dropPiece);
    }
    function checkCompletion() {
        let completed = true;
        for(let i = 0; i < pieces.length; i++){
            const expectedX = i % gridSize * (pieceSize + gridSpacing);
            const expectedY = Math.floor(i / gridSize) * (pieceSize + gridSpacing);
            const actualX = parseInt(pieces[i].style.left);
            const actualY = parseInt(pieces[i].style.top);
            if (actualX !== expectedX || actualY !== expectedY) {
                completed = false;
                break;
            }
        }
        if (completed) showcompletePopup();
    }
    function showcompletePopup() {
        completePopup.classList.add("on");
        disablePieces();
    }
    function disablePieces() {
        pieces.forEach((piece)=>{
            piece.style.cursor = "default";
            piece.removeEventListener("mousedown", selectPiece);
        });
    }
    createPieces();
});

//# sourceMappingURL=index.fb67f16b.js.map
