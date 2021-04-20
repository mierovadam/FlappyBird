        var starts = document.querySelector(".ss");
        var jump1 = document.querySelector(".jump");
        var cvs = document.getElementById("canvas");
        var ctx = cvs.getContext("2d");
        var increaseButton = document.getElementById("increase");
        var decreaseButton = document.getElementById("decrease");
        var soundButton = document.getElementById("mute");
        var regularBird = document.getElementById("bird");
        var rbird = document.getElementById("rbird");
        var ybird = document.getElementById("ybird");
        var gbird = document.getElementById("gbird");


        //IMAGES
        var bird = new Image();
        var bg = new Image();
        var fg = new Image();
        var pipeNorth = new Image();
        var pipeSouth = new Image();

        //AUDIO
        var flySound = new Audio();
        var scoreSound = new Audio();
        var sound = true;

        init(); //init audio and images sources

        //GAME VARIABLES
        var gap = 100;
        var constant = 0;
        var bX = 10; //bird x
        var bY = 150; //bird y
        var gravity = 1.5;
        var score = 0;

        // GAME STATE
        const state = {
            current: 0,
            getReady: 0,
            game: 1,
            over: 2
        }

        //PIPES
        var pipe = [];
        pipe[0] = { x: cvs.width, y: 0 };

        function moveUp() {
            bY -= 30; //this line is before the if statements to prevent the slight jump/sound delay

            if (state.current != state.game)
                return;
            if (sound)
                flySound.play();

            console.log("aaaaa");
        }

        //GAME
        function game() {
            if (state.current == state.game) {
                draw();
                requestAnimationFrame(game);
            }
        }

        function draw() {
            ctx.drawImage(bg, 0, 0);

            for (var i = 0; i < pipe.length; i++) {
                constant = pipeNorth.height + gap;
                ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y);
                ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y + constant);
                pipe[i].x--;

                if (pipe[i].x == 120) { //add new pipe when current pipe reaches this point
                    pipe.push({
                        x: cvs.width,
                        y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height
                    });
                }

                //DETECT COLLISION
                if (bX + bird.width >= pipe[i].x && bX <= pipe[i].x + pipeNorth.width && (bY <= pipe[i].y + pipeNorth.height || bY + bird.height >= pipe[i].y + constant) || bY + bird.height >= cvs.height - fg.height) {
                    state.current = state.over;
                    ctx.drawImage(fg, 0, cvs.height - fg.height); //draw fg after pipes
                    ctx.drawImage(bird, bX, bY);
                    pipe.splice(i, 1); //remove the closest pipe

                    if (pipe.length == 0) // push new pipe if array is empty to NOT break out of the for loop.
                        pipe.push({
                        x: cvs.width,
                        y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height
                    });

                    starts.classList.remove("hide");
                    starts.innerHTML = "Click to Restart" + "<br>" + "<br>" + "Your score is : " + score;
                    score = 0;
                }

                //if pipe crosses this point player scored
                if (pipe[i].x == 5) {
                    score++;
                    if (sound)
                        scoreSound.play();
                }
            }

            ctx.drawImage(fg, 0, cvs.height - fg.height); //draw fg after pipes
            ctx.drawImage(bird, bX, bY);
            bY += gravity;
            ctx.font = "20px Verdana";
            ctx.fillText("Score : " + score, 10, cvs.height - 20);
        }

        function start() {
            if (state.current == state.over) {
                bY = 150; //starting point
            }
            draw();
            state.current = 1; //playing
            starts.classList.add("hide");
            requestAnimationFrame(game);
        }

        function init() {
            bird.src = "./images/bird.png";
            bg.src = "./images/bg.png";
            fg.src = "./images/fg.png";
            pipeNorth.src = "./images/pipe-North.png";
            pipeSouth.src = "./images/pipe-South.png";
            flySound.src = "./audio/sfx_flap.wav";
            scoreSound.src = "./audio/sfx_point.wav";
        }

        soundButton.addEventListener('click', () => {
            if (sound == true) {
                sound = false;
                soundButton.innerHTML = "Unmute";
            } else {
                sound = true;
                soundButton.innerHTML = "MUTE";
            }
        });

        increaseButton.addEventListener('click', () => {
            gravity += 0.1;
        });

        decreaseButton.addEventListener('click', () => {
            if (gravity > 0)
                gravity -= 0.1;
        });

        rbird.addEventListener('click', () => {
            bird.src = "./images/rbird.png";
        });
        ybird.addEventListener('click', () => {
            bird.src = "./images/ybird.png";
        });
        regularBird.addEventListener('click', () => {
            bird.src = "./images/bird.png";
        });
        gbird.addEventListener('click', () => {
            bird.src = "./images/gbird.png";
        });

        starts.addEventListener("click", start);
        cvs.addEventListener("click", moveUp);