// $(document).ready(function () {
//   const $water = $(".water");
//   const $splash = $(".splash");
//   const $mainContent = $(".main-content");
//   // 1초 대기 후 물 채우기 애니메이션 시작
//   setTimeout(() => {
//     $water.css("height", "100%");
//   }, 800); // 1초 지연
//   // 3초 후 스플래시 화면 사라짐
//   setTimeout(() => {
//     $splash.addClass("fade-out");
//     setTimeout(() => {
//       $splash.css("display", "none");
//       $mainContent.css("display", "block");
//     }, 500);
//   }, 3500);
// });
$(document).ready(function() {
    setTimeout(()=>{
        $(".section_01 > .title").css({
            opacity: 1
        });
        setTimeout(()=>{
            $(".section_01 > .txt").css({
                opacity: 1
            });
            setTimeout(()=>{
                $(".section_01 > .rabbit_img").css({
                    opacity: 1
                });
                setTimeout(()=>{
                    $(".section_01 > .start_btn").css({
                        opacity: 1
                    });
                }, 300); // 버튼이 나타나는 시간 차이
            }, 300); // 이미지가 나타나는 시간 차이
        }, 300); // 텍스트가 나타나는 시간 차이
    }, 100); // 처음 딜레이
    $(".start_btn").on("click", function() {
        $(".section_01").css({
            top: "-100%"
        });
        $(".section_02").css({
            bottom: "0%"
        });
        setTimeout(()=>{
            $(".section_02 img").css({
                bottom: "0%"
            });
            setTimeout(()=>{
                $(".section_02").css({
                    opacity: "0",
                    "pointer-events": "none"
                });
                setTimeout(()=>{
                    $(".start_page").css({
                        display: "none"
                    });
                    setTimeout(()=>{
                        $(".click_btn").css({
                            opacity: "1",
                            animation: "size 2s ease-in-out"
                        });
                    }, 0);
                }, 500);
            }, 500);
        }, 500);
    });
    $(".click_btn").on("click", function() {
        $(".game_page").css({
            opacity: "1",
            "pointer-events": "auto",
            background: "#31477345"
        });
        $(".main_page").css({
            filter: "blur(1rem)",
            "clip-path": "inset(0rem)"
        });
    });
});

//# sourceMappingURL=index.9345d665.js.map
