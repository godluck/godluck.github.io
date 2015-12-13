/**
 * Created by cqr on 2015/11/30.
 */
+function (w, d, P) {
    var windowWidth = d.documentElement.offsetWidth;
    var windowHeight = d.documentElement.offsetHeight - 2;
    var gameHeight = windowHeight;
    var gameWidth = Math.floor(windowHeight / 1.608);
    if (gameWidth > windowWidth) {
        gameWidth = windowWidth;
        gameHeight = gameWidth * 1.608;
    }
    var renderer = new P.WebGLRenderer(gameWidth, gameHeight);
    d.body.appendChild(renderer.view);
    var resources = [
        {name: 'bg', url: 'imgs/background.png'},
        {name: 'btnStart', url: 'imgs/button_start.png'},
        {name: 'logoStart', url: 'imgs/tamadama.png'},
        {name: 'help', url: 'imgs/help.png'},
        {name: 'life', url: 'imgs/inochi.png'},
        {name: 'notLife', url: 'imgs/inochi-_lost.png'},
        {name: 'pause', url: 'imgs/button_stop.png'},
        {name: 'tube1', url: 'imgs/tubes_straight.png'},
        {name: 'tubeL', url: 'imgs/tube_water.png'},
        {name: 'tubeJ', url: 'imgs/tube_water2.png'},
        {name: 'tubeO', url: 'imgs/tubes_round.png'},
        {name: 'ball', url: 'imgs/ball.png'},
        {name: 'stop', url: 'imgs/stop.png'},
        {name: 'continue', url: 'imgs/button_known.png'},
        {name: 'm1', url: 'imgs/m1.png'},
        {name: 'm2', url: 'imgs/m2.png'},
        {name: 'm3', url: 'imgs/m3.png'},
        {name: 'm4', url: 'imgs/m4.png'},
        {name: 'end', url: 'imgs/end.png'},
        {name: 'conversation', url: 'imgs/conversation_bg.png'},

    ];

    var imageRatio = Math.floor(windowHeight / 603) + 1;
    var gameRatio = gameHeight / 603;
    var Game = {
        gameWidth: gameWidth,
        gameHeight: gameHeight,
        gameRatio: gameRatio,
        life: 3,
        speed: 2,
        timer: 0,
        isPaused: true,
        direction: 0,
        currentTube: null,
        spawn: []
    };
    var bg, life, timer, pause, continueBox, tube, ball, images, gameStage, end, endInfo;
    if (imageRatio > 1) {
        for (var i = 0; i < resources.length; i++) {
            resources[i].url = resources[i].url.replace(/\.png/, '@' + imageRatio + 'x.png');
        }
    }

    P.loader
        .add(resources)
        .on("progress", loadProgressHandler)
        .load(setup);

    function loadProgressHandler(loader, resource) {
        console.log(loader.progress + '%');
        console.log(resource.url);
    }

    function setup() {
        images = P.loader.resources;
        var startStage = new P.Container();

        bg = new P.Sprite(images.bg.texture);
        bg.scale.x = bg.scale.y = gameRatio;

        var logoStart = new P.Sprite(images.logoStart.texture);
        logoStart.anchor.x = 0.5;
        logoStart.position.x = gameWidth / 2;
        logoStart.position.y = gameHeight * 0.1;
        logoStart.scale.x = logoStart.scale.y = gameRatio;

        var btnStart = new P.Sprite(images.btnStart.texture);
        btnStart.anchor.x = 0.5;
        btnStart.position.x = gameWidth / 2;
        btnStart.position.y = gameHeight * 0.6;
        btnStart.scale.x = btnStart.scale.y = gameRatio;
        btnStart.interactive = true;
        btnStart.buttonMode = true;
        btnStart.on('mouseup', showHelp);
        btnStart.on('touchend', showHelp);
        initSprites();
        startStage.addChild(bg);
        startStage.addChild(btnStart);
        startStage.addChild(logoStart);
        renderer.render(startStage);
    }

    function initSprites() {
        life = new P.Container();
        var life1 = new P.Sprite(images.life.texture);
        var life2 = new P.Sprite(images.life.texture);
        var life3 = new P.Sprite(images.life.texture);
        life1.scale.x = life1.scale.y = life2.scale.x = life2.scale.y = life3.scale.x = life3.scale.y = gameRatio;
        life2.position.x = life1.width * 1.2;
        life3.position.x = life1.width * 2.4;
        life.position.x = 5;
        life.position.y = 10;
        life.addChild(life1);
        life.addChild(life2);
        life.addChild(life3);
        life.icons = [life1, life2, life3];
        life.refresh = function (num) {
            for (var i = 0; i < 3; i++) {
                life.icons[i].texture = images.notLife.texture;
            }
            for (var i = 0; i < num; i++) {
                life.icons[i].texture = images.life.texture;
            }
        }

        timer = new P.Text(Game.timer, {font: 45 / 1206 * Game.gameHeight + "px sans-serif", fill: "#d4de68"});
        timer.anchor.x = 1;
        timer.position.x = gameWidth * 0.95;
        timer.position.y = 15;

        continueBox = new P.Graphics();
        continueBox.beginFill(0xFFFFFF, 0.2);
        continueBox.lineStyle(0);
        continueBox.drawRect(0, 0, gameWidth, gameHeight);
        continueBox.interactive = true;
        continueBox.visible = false;
        continueBox.on('mouseup', function () {
            Game.isPaused = false;
            continueBox.visible = false;
            continueImg.visible = false;
        });
        continueBox.on('touchend', function () {
            Game.isPaused = false;
            continueBox.visible = false;
            continueImg.visible = false;
        });

        var continueImg = new P.Sprite(images.stop.texture);
        continueImg.scale.x = continueImg.scale.y = gameRatio;
        continueImg.anchor.x = 0.5;
        continueImg.position.x = gameWidth / 2;
        continueImg.position.y = gameHeight * 0.3;
        continueBox.addChild(continueImg);

        end = new P.Graphics();
        end.beginFill(0xFFFFFF, 0.2);
        end.lineStyle(0);
        end.drawRect(0, 0, gameWidth, gameHeight);
        end.interactive = true;
        end.visible = false;
        var endDialog = new P.Sprite(images.conversation.texture);
        endDialog.scale.x = endDialog.scale.y = gameRatio;
        endDialog.anchor.x = 0.5;
        endDialog.position.x = gameWidth / 2;
        endDialog.position.y = gameHeight * 0.3;
        end.addChild(endDialog);
        var endText = new P.Sprite(images.end.texture);
        endText.scale.x = endText.scale.y = gameRatio;
        endText.anchor.x = 0.5;
        endText.position.x = gameWidth / 2;
        endText.position.y = gameHeight * 0.35;
        end.addChild(endText);
        endInfo = new P.Text('你拿到了' + 100000 + '分\n_(:з」∠)_', {
            font: 20 * gameRatio + 'px Arial',
            fill: "#FFFFFF",
            align: 'center'
        })
        endInfo.anchor.x = 0.5;
        endInfo.position.x = gameWidth / 2;
        endInfo.position.y = gameHeight * 0.45;
        end.addChild(endInfo);

        var restartButton = new P.Graphics();
        restartButton.beginFill(0x335c3e);
        restartButton.lineStyle(0);
        restartButton.drawRoundedRect(gameWidth / 2 - endDialog.width / 2, gameHeight * 0.6, endDialog.width / 2.2, endDialog.width / 6, 5 * gameRatio);
        restartButton.interactive = true;
        restartButton.buttonMode = true;
        restartButton.on('mouseup', restart);
        restartButton.on('touchend', restart);
        var restartText = new P.Text('重新再来', {font: 15 * gameRatio + 'px Arial', fill: "#FFFFFF"});
        restartText.anchor.x = 0.5;
        restartText.anchor.y = 0.5;
        restartText.position.x = gameWidth / 2 - endDialog.width / 2 + endDialog.width / 4.4;
        restartText.position.y = gameHeight * 0.6 + endDialog.width / 12;
        var shareButton = new P.Graphics();
        shareButton.beginFill(0x335c3e);
        shareButton.lineStyle(0);
        shareButton.drawRoundedRect(gameWidth / 2 + endDialog.width / 22, gameHeight * 0.6, endDialog.width / 2.2, endDialog.width / 6, 5 * gameRatio);
        shareButton.interactive = true;
        shareButton.buttonMode = true;
        shareButton.on('mouseup', share);
        shareButton.on('touchend', share);
        var shareText = new P.Text('分享', {font: 15 * gameRatio + 'px Arial', fill: "#FFFFFF"});
        shareText.anchor.x = 0.5;
        shareText.anchor.y = 0.5;
        shareText.position.x = gameWidth / 2 + endDialog.width / 22 + endDialog.width / 4.4;
        shareText.position.y = gameHeight * 0.6 + endDialog.width / 12;
        end.addChild(restartButton);
        restartButton.addChild(restartText);
        end.addChild(shareButton);
        shareButton.addChild(shareText);

        pause = new P.Sprite(images.pause.texture);
        pause.scale.x = pause.scale.y = gameRatio;
        pause.anchor.x = 1;
        pause.anchor.y = 1;
        pause.position.x = gameWidth * 0.98;
        pause.position.y = gameHeight * 0.98;
        pause.interactive = true;
        pause.buttonMode = true;
        pause.on('mouseup', function () {
            Game.isPaused = true;
            continueBox.visible = true;
            continueImg.visible = true;
        });
        pause.on('touchend', function () {
            Game.isPaused = true;
            continueBox.visible = true;
            continueImg.visible = true;
        });

        tube = new P.Container();
        tube.width = gameWidth;
        var startTube1 = new Tube_vert();
        startTube1.sprite.position.y = 0;
        var startTube2 = createTube();
        startTube2.sprite.position.y = startTube1.sprite.height;
        console.log(gameRatio);
        var startTube3 = createTube();
        startTube3.sprite.position.y = startTube2.sprite.height + startTube2.sprite.position.y;
        var startTube4 = createTube();
        startTube4.sprite.position.y = startTube3.sprite.height + startTube3.sprite.position.y;
        tube.addChild(startTube1.sprite);
        tube.addChild(startTube2.sprite);
        tube.addChild(startTube3.sprite);
        tube.addChild(startTube4.sprite);
        tube.tubes = [startTube1, startTube2, startTube3, startTube4];
        tube.addTube = function (newTube) {
            newTube.sprite.position.y = tube.tubes[3].sprite.position.y;
            tube.tubes[3].sprite.position.y = tube.tubes[2].sprite.position.y;
            tube.tubes[2].sprite.position.y = tube.tubes[1].sprite.position.y;
            tube.tubes[1].sprite.position.y = tube.tubes[0].sprite.position.y;
            tube.removeChildAt(0);
            tube.addChild(newTube.sprite);
            tube.tubes.shift();
            tube.tubes.push(newTube);
        };

        ball = new P.Sprite(images.ball.texture);
        ball.scale.x = ball.scale.y = gameRatio;
        ball.anchor.x = ball.anchor.y = 0.5;
        ball.position.x = gameWidth / 2;
        ball.position.y = gameHeight * 0.05;
    }

    function showHelp() {
        var helpStage = new P.Container();

        var help = new P.Sprite(images.help.texture);
        help.scale.x = help.scale.y = gameRatio;

        var iKnow = new P.Sprite(images.continue.texture);
        iKnow.scale.x = iKnow.scale.y = gameRatio;
        iKnow.anchor.x = 0.5;
        iKnow.position.x = gameWidth / 2;
        iKnow.position.y = gameHeight * 0.7;
        iKnow.interactive = true;
        iKnow.buttonMode = true;
        iKnow.on('mouseup', startGame);
        iKnow.on('touchend', startGame);

        helpStage.addChild(bg);
        helpStage.addChild(life);
        helpStage.addChild(timer);
        helpStage.addChild(pause);
        helpStage.addChild(help);
        helpStage.addChild(iKnow);

        renderer.render(helpStage);
    }

    function startGame() {
        gameStage = new P.Container();
        var left = new P.Sprite(images.bg.texture);
        var right = new P.Sprite(images.bg.texture);
        left.position.x = 0;
        left.width = gameWidth / 2;
        left.height = gameHeight;
        right.position.x = gameWidth / 2;
        right.width = gameWidth / 2;
        right.height = gameHeight;
        left.renderable = right.renderable = false;
        left.interactive = right.interactive = true;
        left.on('mousedown', function (e) {
            Game.direction += 1;
        });
        left.on('touchstart', function (e) {
            Game.direction += 1;
        });
        left.on('mouseup', function (e) {
            Game.direction -= 1;
        });
        left.on('touchend', function (e) {
            Game.direction -= 1;
        });
        right.on('mousedown', function (e) {
            Game.direction += -1;
        });
        right.on('touchstart', function (e) {
            Game.direction += -1;
        });
        right.on('mouseup', function (e) {
            Game.direction -= -1;
        });
        right.on('touchend', function (e) {
            Game.direction -= -1;
        });
        gameStage.addChild(bg);
        gameStage.addChild(tube);
        gameStage.addChild(ball);
        gameStage.addChild(left);
        gameStage.addChild(right);
        gameStage.addChild(life);
        gameStage.addChild(timer);
        gameStage.addChild(pause);
        gameStage.addChild(continueBox);
        gameStage.addChild(end);
        renderer.render(gameStage);
        Game.isPaused = false;
        animate(gameStage);
    }

    function generateMapBlock() {
        var random = Math.floor(Math.random() * 4);
        return random < 4 ? random + 1 : random;
    }

    function createTube() {
        var tubeType = generateMapBlock();
        var tubeTemplate = [Tube_water1, Tube_water2, Tube_vert, Tube_circle];
        var newTube = new tubeTemplate[tubeType - 1]();
        createMob(newTube.mobY(0), newTube);
        createMob(newTube.mobY(1), newTube);
        if (tubeType === 3) {
            createMob(newTube.mobY(2), newTube);
        }
        return newTube;
    }

    function createMob(y, tube) {
        if (y != -1) {
            var mobType = generateMapBlock() - 1;
            var mobTemplate = ['m1', 'm2', 'm3', 'm4'];
            var mob = new P.Sprite(images[mobTemplate[mobType]].texture);
            mob.type = mobType;
            mob.anchor.x = 0.5;
            mob.anchor.y = 0.5;
            if (mob.type === 1) {
                mob.position.x = Math.random() > 0.5 ? -17.5 * gameRatio : 17.5 * gameRatio;
            } else {
                mob.position.x = (22.5 + 50 * Math.random() - 47.5) * gameRatio;
            }
            mob.position.y = y;
            tube.sprite.addChild(mob);
            tube.mobs.push(mob);
        }
    }

    function mobCrash(mobs, x, y, width) {
        for (var i in mobs) {
            if (hitTestRectangle(mobs[i], {x: x, y: y, width: width, height: width})) {
                return false;
            }
        }
        return true;
    }

    function hitTestRectangle(r1, r2) {

        //Define the variables we'll need to calculate
        var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

        //hit will determine whether there's a collision
        hit = false;

        //Find the center points of each sprite
        r1.centerX = r1.x + r1.width / 2;
        r1.centerY = r1.y + r1.height / 2;
        r2.centerX = r2.x + r2.width / 2;
        r2.centerY = r2.y + r2.height / 2;

        //Find the half-widths and half-heights of each sprite
        r1.halfWidth = r1.width / 2;
        r1.halfHeight = r1.height / 2;
        r2.halfWidth = r2.width / 2;
        r2.halfHeight = r2.height / 2;

        //Calculate the distance vector between the sprites
        vx = r1.centerX - r2.centerX;
        vy = r1.centerY - r2.centerY;

        //Figure out the combined half-widths and half-heights
        combinedHalfWidths = r1.halfWidth + r2.halfWidth;
        combinedHalfHeights = r1.halfHeight + r2.halfHeight;

        //Check for a collision on the x axis
        if (Math.abs(vx) < combinedHalfWidths) {

            //A collision might be occuring. Check for a collision on the y axis
            if (Math.abs(vy) < combinedHalfHeights) {

                //There's definitely a collision happening
                hit = true;
            } else {

                //There's no collision on the y axis
                hit = false;
            }
        } else {

            //There's no collision on the x axis
            hit = false;
        }

        //`hit` will be either `true` or `false`
        return hit;
    }

    function Tube_vert() {
        this.sprite = new P.Sprite(images.tube1.texture);
        this.sprite.scale.x = this.sprite.scale.y = gameRatio;
        this.sprite.anchor.x = 0.5;
        this.sprite.position.x = gameWidth / 2;
        var width = 75 * gameRatio;
        this.criticalHit = function (x, y, radio) {
            Game.speed = 2;
            var mobed = mobCrash(this.mobs, x, y, radio * 2);
            return x > -width / 2 + radio && x < width / 2 - radio && mobed;
        };
        this.mobY = function (num) {
            return gameRatio * (180 * num + Math.random() * 100);
        };
        this.mobs = [];
    }

    function Tube_water1() {
        this.sprite = new P.Sprite(images.tubeL.texture);
        this.sprite.scale.x = this.sprite.scale.y = gameRatio;
        this.sprite.anchor.x = 0.2;
        this.sprite.position.x = gameWidth / 2;
        var width = 75 * gameRatio;
        var centerY = 235 * gameRatio;
        var centerX = 37.5 * gameRatio;
        var border = 240 * gameRatio;
        var core = 85 * gameRatio;
        var upBoundary = 5 * gameRatio;
        var bottomBoundary = 465 * gameRatio;
        this.criticalHit = function (x, y, radio) {
            var mobed = mobCrash(this.mobs, x, y, radio * 2);
            if (y < bottomBoundary - radio && y > upBoundary + radio && x > -width / 2) {
                Game.speed = 4;
                var distance = (x + centerX) * (x + centerX) + (y - centerY) * (y - centerY);
                return mobed && distance < (border - radio) * (border - radio) && distance > (core + radio) * (core + radio);
            } else {
                Game.speed = 2;
                return mobed && x > -width / 2 + radio && x < width / 2 - radio;
            }
        };
        this.mobY = function (num) {
            return -1;
        };
        this.mobs = [];
    }

    function Tube_water2() {
        this.sprite = new P.Sprite(images.tubeJ.texture);
        this.sprite.scale.x = this.sprite.scale.y = gameRatio;
        this.sprite.anchor.x = 0.8;
        this.sprite.position.x = gameWidth / 2;
        var width = 75 * gameRatio;
        var centerY = 235 * gameRatio;
        var centerX = 37.5 * gameRatio;
        var border = 240 * gameRatio;
        var core = 85 * gameRatio;
        var upBoundary = 5 * gameRatio;
        var bottomBoundary = 465 * gameRatio;
        this.criticalHit = function (x, y, radio) {
            var mobed = mobCrash(this.mobs, x, y, radio * 2);
            if (y < bottomBoundary - radio && y > upBoundary + radio && x < width / 2) {
                Game.speed = 4;
                var distance = (x - centerX) * (x - centerX) + (y - centerY) * (y - centerY);
                return mobed && distance < (border - radio) * (border - radio) && distance > (core + radio) * (core + radio);
            } else {
                Game.speed = 2;
                return mobed && x > -width / 2 + radio && x < width / 2 - radio;
            }
        };
        this.mobY = function (num) {
            return -1;
        };
        this.mobs = [];
    }

    function Tube_circle() {
        this.sprite = new P.Sprite(images.tubeO.texture);
        this.sprite.scale.x = this.sprite.scale.y = gameRatio;
        this.sprite.anchor.x = 0.5;
        this.sprite.position.x = gameWidth / 2 + 2 * gameRatio;
        var width = 75 * gameRatio;
        var border = 205 * gameRatio;
        var core = 70 * gameRatio;
        this.criticalHit = function (x, y, radio) {
            Game.speed = 2;
            var mobed = mobCrash(this.mobs, x, y, radio * 2);
            if (y < border - radio * 2 && y > radio * 2) {
                var distance = x * x + (y - border / 2) * (y - border / 2);
                return mobed && distance < (border / 2 - radio) * (border / 2 - radio) && distance > (core / 2 + radio) * (core / 2 + radio);
            } else {
                return mobed && x > -width / 2 + radio && x < width / 2 - radio;
            }
        };
        this.mobY = function (num) {
            return gameRatio * (220 + 180 * num + Math.random() * 100)
        };
        this.mobs = [];
    }

    function animate(gameStage) {
        if (!Game.isPaused) {
            if (tube.position.y + tube.tubes[0].sprite.height < 0) {
                var newTube = createTube();
                tube.addTube(newTube);
                tube.position.y += tube.tubes[0].sprite.height;
            } else {
                tube.position.y -= Game.speed * gameRatio;
            }
            if (Game.direction === 1) {
                ball.position.x -= Game.speed * gameRatio;
            }
            if (Game.direction === -1) {
                ball.position.x += Game.speed * gameRatio;
            }
            var by = tube.position.y * -1 + gameHeight * 0.05;
            if (by > tube.tubes[0].sprite.height) {
                Game.currentTube = tube.tubes[1];
                by -= tube.tubes[0].sprite.height;
            } else {
                Game.currentTube = tube.tubes[0];
            }
            if (!Game.currentTube.criticalHit(ball.position.x - gameWidth / 2, by, ball.width / 2)) {
                Game.isPaused = true;
                Game.life -= 1;
                if (Game.life > 0) {
                    respawn();
                    setTimeout(function () {
                        if (!continueBox.visible) {
                            Game.isPaused = false;
                        }
                    }, 2000);
                } else {
                    endGame();
                }
            }
            if (Game.spawn.length > 13) {
                Game.spawn.shift();
            }
            Game.spawn.push({x: ball.position.x, y: tube.position.y});
            life.refresh(Game.life);
            Game.timer += 1;
            timer.text = Math.floor(Game.timer / 10);
        }
        renderer.render(gameStage);
        requestAnimationFrame(function () {
            animate(gameStage);
        });
    }

    function respawn() {
        ball.position.x = Game.spawn[0].x;
        tube.position.y = Game.spawn[0].y;
    }

    function endGame() {
        end.visible = true;
        endInfo.text = '你拿到了' + Math.floor(Game.timer / 10) + '分\n_(:з」∠)_';
    }

    function restart() {
        gameStage.removeChild(tube);
        Game = {
            gameWidth: gameWidth,
            gameHeight: gameHeight,
            gameRatio: gameRatio,
            life: 3,
            speed: 2,
            timer: 0,
            isPaused: false,
            direction: 0,
            currentTube: null,
            spawn: []
        };

        tube = new P.Container();
        tube.width = gameWidth;
        var startTube1 = new Tube_vert();
        startTube1.sprite.position.y = 0;
        var startTube2 = createTube();
        startTube2.sprite.position.y = startTube1.sprite.height;
        console.log(gameRatio);
        var startTube3 = createTube();
        startTube3.sprite.position.y = startTube2.sprite.height + startTube2.sprite.position.y;
        var startTube4 = createTube();
        startTube4.sprite.position.y = startTube3.sprite.height + startTube3.sprite.position.y;
        tube.addChild(startTube1.sprite);
        tube.addChild(startTube2.sprite);
        tube.addChild(startTube3.sprite);
        tube.addChild(startTube4.sprite);
        tube.tubes = [startTube1, startTube2, startTube3, startTube4];
        tube.addTube = function (newTube) {
            newTube.sprite.position.y = tube.tubes[3].sprite.position.y;
            tube.tubes[3].sprite.position.y = tube.tubes[2].sprite.position.y;
            tube.tubes[2].sprite.position.y = tube.tubes[1].sprite.position.y;
            tube.tubes[1].sprite.position.y = tube.tubes[0].sprite.position.y;
            tube.removeChildAt(0);
            tube.addChild(newTube.sprite);
            tube.tubes.shift();
            tube.tubes.push(newTube);
        };
        gameStage.addChildAt(tube, 1);
        ball.position.x = gameWidth / 2;
        continueBox.visible = false;
        end.visible = false;
    }

    function share() {

    }
}(window, document, PIXI);