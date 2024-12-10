$(document).ready(function() {
    // 딜레이 함수 정의
    const delay = (time)=>new Promise((resolve)=>setTimeout(resolve, time));
    // 섹션 1 애니메이션 실행
    const animateSection1 = async ()=>{
        $(".section_01 > .title").css({
            opacity: 1
        });
        await delay(300);
        $(".section_01 > .txt").css({
            opacity: 1
        });
        await delay(300);
        $(".section_01 > .rabbit_img").css({
            opacity: 1
        });
        await delay(300);
        $(".section_01 > .start_btn").css({
            opacity: 1
        });
    };
    // 섹션 전환 버튼 클릭 이벤트
    const handleStartClick = async ()=>{
        $(".section_01").css({
            top: "-100%"
        });
        $(".section_02").css({
            bottom: "0%"
        });
        await delay(500);
        $(".section_02 img").css({
            bottom: "0%"
        });
        await delay(500);
        $(".section_02").css({
            opacity: "0",
            "pointer-events": "none"
        });
        await delay(500);
        $(".start_page").css({
            display: "none"
        });
        $(".piggyback_btn").css({
            opacity: "1",
            animation: "size 1s ease-in-out"
        });
    };
    // 게임 화면 전환 버튼 클릭 이벤트
    const handleGamePuzzle = async ()=>{
        $(".game_page").css({
            opacity: "1",
            "pointer-events": "auto",
            background: "#31477345"
        });
        $(".main_page").css({
            filter: "blur(1rem)",
            "clip-path": "inset(0rem)"
        });
        await delay(100);
        $(".piggyback_btn").css({
            display: "none"
        });
    };
    // 퍼즐 게임 완료 버튼 클릭 이벤트
    const handleGameComplete = async ()=>{
        $(".game_page").css({
            opacity: "0",
            "pointer-events": "none"
        });
        $(".main_page").css({
            filter: "none",
            "clip-path": "inset(0rem)"
        });
        $(".puzzle_game").css({
            display: "none"
        });
        await delay(500);
        $(".game_page").css({
            display: "none"
        });
        $(".piggyback_btn").css({
            opacity: "1",
            animation: "size 2s ease-in-out"
        });
        await delay(10);
        $(".go_page").css({
            opacity: "1"
        });
        $(".shiny_img").css({
            opacity: "1"
        });
        await delay(100);
        $(".piggyback_img").css({
            bottom: "120%",
            opacity: "1"
        });
        await delay(1000);
        $(".go_page > .transition").css({
            bottom: "0%",
            opacity: "1",
            "z-index": "1"
        });
        await delay(500);
        // .repeat_back 요소 표시
        $(".repeat_back").css({
            opacity: "1"
        });
        await delay(0);
        $(".repeat_back").css({
            top: "0%",
            transition: "top 3s"
        });
        $(".gopiggyback_img").css({
            display: "block"
        });
        $(".sea_img").css({
            display: "block"
        });
        await delay(800);
        $(".go_page > .transition").css({
            opacity: "0"
        });
        await delay(500);
        $(".gopiggyback_img").css({
            opacity: "0"
        });
        $(".repeat_img").css({
            opacity: "0"
        });
        $(".repeat_back").css({
            opacity: "0",
            transition: "all 1s cubic-bezier(0.56, 0, 0.07, 1.01)"
        });
        await delay(600);
        $(".propulsion_btn").css({
            bottom: "10%"
        });
        await delay(0);
        $(".piggyback_img").css({
            display: "none"
        });
        $(".game_page").css({
            display: "block"
        });
        $(".card_game").css({
            display: "block"
        });
    };
    // 카드게임 완료 버튼 클릭 이벤트
    const handleGameCard = async ()=>{
        $(".main_page").css({
            filter: "blur(1rem)",
            "clip-path": "inset(0rem)"
        });
        $(".game_page").css({
            opacity: "1",
            "pointer-events": "auto",
            background: "#31477345"
        });
    };
    // 초기화 및 이벤트 바인딩
    animateSection1();
    $(".start_btn").on("click", handleStartClick);
    $(".piggyback_btn").on("click", handleGamePuzzle);
    $(".complete_button").on("click", handleGameComplete);
    $(".propulsion_btn").on("click", handleGameCard);
});

//# sourceMappingURL=index.9345d665.js.map
