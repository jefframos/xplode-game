/*! jefframos 08-05-2015 */
function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var h, s, max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
    if (max === min) h = s = 0; else {
        var d = max - min;
        switch (s = l > .5 ? d / (2 - max - min) : d / (max + min), max) {
          case r:
            h = (g - b) / d + (b > g ? 6 : 0);
            break;

          case g:
            h = (b - r) / d + 2;
            break;

          case b:
            h = (r - g) / d + 4;
        }
        h /= 6;
    }
    return {
        h: h,
        s: s,
        l: l
    };
}

function hslToRgb(h, s, l) {
    function hue2rgb(p, q, t) {
        return 0 > t && (t += 1), t > 1 && (t -= 1), 1 / 6 > t ? p + 6 * (q - p) * t : .5 > t ? q : 2 / 3 > t ? p + (q - p) * (2 / 3 - t) * 6 : p;
    }
    var r, g, b;
    if (0 === s) r = g = b = l; else {
        var q = .5 > l ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3), g = hue2rgb(p, q, h), b = hue2rgb(p, q, h - 1 / 3);
    }
    return {
        r: Math.round(255 * r),
        g: Math.round(255 * g),
        b: Math.round(255 * b)
    };
}

function toHex(n) {
    return n = parseInt(n, 10), isNaN(n) ? "00" : (n = Math.max(0, Math.min(n, 255)), 
    "0123456789ABCDEF".charAt((n - n % 16) / 16) + "0123456789ABCDEF".charAt(n % 16));
}

function rgbToHex(R, G, B) {
    return parseInt("0x" + toHex(R) + toHex(G) + toHex(B));
}

function hexToRgb(hex) {
    var r = hex >> 16, g = hex >> 8 & 255, b = 255 & hex;
    return {
        r: r,
        g: g,
        b: b
    };
}

function addHue(color, value) {
    var rgb = hexToRgb(color), hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return hsl.s *= value, hsl.h > 1 && (hsl.h = 1), hsl.h < 0 && (hsl.h = 0), rgb = hslToRgb(hsl.h, hsl.s, hsl.l), 
    rgbToHex(rgb.r, rgb.g, rgb.b);
}

function setSaturation(color, value) {
    var rgb = hexToRgb(color), hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return hsl.s = value, rgb = hslToRgb(hsl.h, hsl.s, hsl.l), rgbToHex(rgb.r, rgb.g, rgb.b);
}

function addSaturation(color, value) {
    var rgb = hexToRgb(color), hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return hsl.s *= value, hsl.s > 1 && (hsl.s = 0), hsl.s < 0 && (hsl.s = 1), rgb = hslToRgb(hsl.h, hsl.s, hsl.l), 
    rgbToHex(rgb.r, rgb.g, rgb.b);
}

function addBright(color, value) {
    var rgb = hexToRgb(color), hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return hsl.l *= value, hsl.l > 1 && (hsl.l = 1), hsl.l < 0 && (hsl.l = 0), rgb = hslToRgb(hsl.h, hsl.s, hsl.l), 
    rgbToHex(rgb.r, rgb.g, rgb.b);
}

function pointDistance(x, y, x0, y0) {
    return Math.sqrt((x -= x0) * x + (y -= y0) * y);
}

function degreesToRadians(deg) {
    return deg * (Math.PI / 180);
}

function radiansToDegrees(rad) {
    return rad / (Math.PI / 180);
}

function scaleConverter(current, max, _scale, object) {
    var scale = max * _scale / current;
    return object ? (object.scale ? object.scale.x = object.scale.y = scale : object.getContent() && object.getContent().scale && (object.getContent().scale.x = object.getContent().scale.y = scale), 
    scale) : scale;
}

function shuffle(array) {
    for (var temp, index, counter = array.length; counter > 0; ) index = Math.floor(Math.random() * counter), 
    counter--, temp = array[counter], array[counter] = array[index], array[index] = temp;
    return array;
}

function testMobile() {
    return Modernizr.touch;
}

function isPortait() {
    return window.innerHeight > window.innerWidth;
}

function possibleFullscreen() {
    var elem = gameView;
    return elem.requestFullscreen || elem.msRequestFullscreen || elem.mozRequestFullScreen || elem.webkitRequestFullscreen;
}

function updateResolution(orientation, scale) {
    "portait" === orientation ? screen.height > screen.width ? (windowWidth = screen.width * scale, 
    windowWidthVar = screen.width, possibleFullscreen() ? (windowHeight = screen.height * scale, 
    windowHeightVar = screen.height) : (windowHeight = window.devicePixelRatio >= 2 ? window.innerHeight * scale : window.outerHeight * scale, 
    windowHeight = window.outerHeight * scale, windowHeightVar = window.outerHeight * scale)) : (windowWidth = screen.height * scale, 
    windowHeight = screen.width * scale, windowWidthVar = screen.height, windowHeightVar = screen.width) : screen.height < screen.width ? (windowWidth = screen.width * scale, 
    windowHeight = screen.height * scale, windowWidthVar = screen.width, windowHeightVar = screen.height) : (windowWidth = screen.height * scale, 
    windowHeight = screen.width * scale, windowWidthVar = screen.height, windowHeightVar = screen.width), 
    realWindowWidth = windowWidth, realWindowHeight = windowHeight;
}

function update() {
    requestAnimFrame(update), init || (windowWidth = res.x, windowHeight = res.y - 50, 
    realWindowWidth = res.x, realWindowHeight = res.y, renderer = testMobile() ? PIXI.autoDetectRecommendedRenderer(realWindowWidth, realWindowHeight, {
        antialias: !0,
        resolution: retina,
        view: gameView
    }) : PIXI.autoDetectRenderer(realWindowWidth, realWindowHeight, {
        antialias: !0,
        resolution: retina,
        view: gameView
    }), retina = 2, renderer.view.style.width = windowWidthVar + "px", renderer.view.style.height = windowHeightVar + 26 + "px", 
    APP = new Application(), APP.build(), APP.show(), init = !0), renderer && (APP.update(), 
    renderer.render(APP.stage));
}

function fullscreen() {
    if (!isfull) {
        var elem = gameView;
        elem.requestFullscreen ? elem.requestFullscreen() : elem.msRequestFullscreen ? elem.msRequestFullscreen() : elem.mozRequestFullScreen ? elem.mozRequestFullScreen() : elem.webkitRequestFullscreen && elem.webkitRequestFullscreen(), 
        updateResolution(screenOrientation, gameScale), isfull = !0;
    }
}

function registerAdEvents() {
    document.addEventListener("onReceiveAd", function() {
        alert("onReceiveAd");
    }), document.addEventListener("onFailedToReceiveAd", function(data) {
        alert(JSON.stringify(data));
    }), document.addEventListener("onPresentAd", function() {
        alert("onPresentAd");
    }), document.addEventListener("onDismissAd", function() {
        alert("onDismissAd");
    }), document.addEventListener("onLeaveToAd", function() {
        alert("onLeaveToAd");
    }), document.addEventListener("onReceiveInterstitialAd", function() {
        alert("onReceiveInterstitialAd");
    }), document.addEventListener("onPresentInterstitialAd", function() {
        alert("onPresentInterstitialAd");
    }), document.addEventListener("onDismissInterstitialAd", function() {
        alert("onDismissInterstitialAd");
    });
}

function deviceReady() {
    initialize();
}

var Application = AbstractApplication.extend({
    init: function() {
        function initialize() {
            self._super(windowWidth, windowHeight), self.stage.setBackgroundColor(self.backColor), 
            self.stage.removeChild(self.loadText), self.labelDebug = new PIXI.Text("", {
                font: "15px Arial"
            }), self.labelDebug.position.y = windowHeight - 20, self.labelDebug.position.x = 20, 
            self.initialized = !0, self.audioController = new AudioController(), self.withAPI = !1, 
            "#withoutAPI" === window.location.hash && (self.withAPI = !1);
        }
        var self = this;
        this.vecColors = [ 16743382, 16735338, 16746088, 16563797, 5563861, 2783487, 9586937, 14111213, 9682753 ], 
        this.vecColorsS = [ "#FF7BD6", "#FF5C6A", "#FF8668", "#FCBE55", "#54E5D5", "#2A78FF", "#9248F9", "#D751ED", "#93BF41" ], 
        this.vecPerfects = [ "PERFECT!", "AWESOME!", "AMAZING!", "GOD!!!", "WOWOWOW", "YEAH!" ], 
        this.vecGood = [ "GOOD", "COOL", "YEP", "NOT BAD" ], this.vecError = [ "NOOOO!", "BAD", "MISS!", "NOT", "AHHHH" ], 
        this.currentColorID = Math.floor(this.vecColors.length * Math.random()), this.backColor = this.vecColors[this.currentColorID], 
        initialize(), this.mute = !1;
    },
    update: function() {
        this.initialized && (this._super(), this.withAPI && this.apiLogo && this.apiLogo.getContent().height > 1 && 0 === this.apiLogo.getContent().position.x && (scaleConverter(this.apiLogo.getContent().width, windowWidth, .5, this.apiLogo), 
        this.apiLogo.getContent().position.x = windowWidth / 2 - this.apiLogo.getContent().width / 2), 
        this.screenManager && this.screenManager.currentScreen && this.labelDebug && this.labelDebug.parent && (this.childsCounter = 1, 
        this.recursiveCounter(this.screenManager.currentScreen), this.labelDebug.setText(this.childsCounter)));
    },
    apiLoaded: function(apiInstance) {
        if (this.withAPI) {
            this.apiInstance = apiInstance;
            var logoData = apiInstance.Branding.getLogo();
            this.apiLogo = new DefaultButton(logoData.image, logoData.image), this.apiLogo.build(), 
            this.apiLogo.clickCallback = function() {
                logoData.action();
            }, this.stage.addChild(this.apiLogo.getContent()), this.buttonProperties = apiInstance.Branding.getLink("more_games"), 
            this.apiInstance.Branding.displaySplashScreen(function() {
                APP.initApplication();
            });
        }
    },
    recursiveCounter: function(obj) {
        var j = 0;
        if (obj.children) for (j = obj.children.length - 1; j >= 0; j--) this.childsCounter++, 
        this.recursiveCounter(obj.children[j]); else {
            if (!obj.childs) return;
            for (j = obj.childs.length - 1; j >= 0; j--) this.childsCounter++, this.recursiveCounter(obj.childs[j]);
        }
    },
    build: function() {
        this._super(), this.cookieManager = new CookieManager(), this.initApplication();
    },
    initApplication: function() {
        this.gameScreen = new GameScreen("Game"), this.loadScreen = new LoadScreen("Loader"), 
        this.screenManager.addScreen(this.loadScreen), this.screenManager.addScreen(this.gameScreen), 
        this.screenManager.change("Loader");
    },
    show: function() {},
    hide: function() {},
    destroy: function() {}
}), BarView = Class.extend({
    init: function(width, height, maxValue, currentValue) {
        this.maxValue = maxValue, this.text = "default", this.currentValue = currentValue, 
        this.container = new PIXI.DisplayObjectContainer(), this.width = width, this.height = height, 
        this.backShape = new PIXI.Graphics(), this.backShape.beginFill(16711680), this.backShape.drawRect(0, 0, width, height), 
        this.container.addChild(this.backShape), this.frontShape = new PIXI.Graphics(), 
        this.frontShape.beginFill(65280), this.frontShape.drawRect(0, 0, width, height), 
        this.container.addChild(this.frontShape), this.frontShape.scale.x = this.currentValue / this.maxValue;
    },
    addBackShape: function(color, size) {
        this.back = new PIXI.Graphics(), this.back.beginFill(color), this.back.drawRect(-size / 2, -size / 2, this.width + size, this.height + size), 
        this.container.addChildAt(this.back, 0);
    },
    setFrontColor: function(color) {
        this.frontShape && this.container.removeChild(this.frontShape), this.frontShape = new PIXI.Graphics(), 
        this.frontShape.beginFill(color), this.frontShape.drawRect(0, 0, this.width, this.height), 
        this.container.addChild(this.frontShape);
    },
    setBackColor: function(color) {
        this.backShape && this.container.removeChild(this.backShape), this.backShape = new PIXI.Graphics(), 
        this.backShape.beginFill(color), this.backShape.drawRect(0, 0, this.width, this.height), 
        this.container.addChildAt(this.backShape, 0);
    },
    setText: function(text) {
        this.text !== text && (this.lifebar ? this.lifebar.setText(text) : (this.lifebar = new PIXI.Text(text, {
            fill: "white",
            align: "center",
            font: "10px Arial"
        }), this.container.addChild(this.lifebar)));
    },
    updateBar: function(currentValue, maxValue) {
        (this.currentValue !== currentValue || this.maxValue !== maxValue && currentValue >= 0) && (this.currentValue = currentValue, 
        this.maxValue = maxValue, this.frontShape.scale.x = this.currentValue / this.maxValue, 
        this.frontShape.scale.x < 0 && (this.frontShape.scale.x = 0));
    },
    getContent: function() {
        return this.container;
    },
    setPosition: function(x, y) {
        this.container.position.x = x, this.container.position.y = y;
    }
}), LifeBarHUD = Class.extend({
    init: function(width, height, incX, frontColor, baseColor) {
        this.text = "default", this.container = new PIXI.DisplayObjectContainer(), this.width = width, 
        this.height = height, this.incX = incX, this.backShape = new PIXI.Graphics();
        var w = width, xAcc = 0;
        this.rect = [ [ 0, 0 ], [ w, 0 ], [ w + xAcc, 0 ], [ xAcc, 0 ] ], this.frontRect = [ [ 0, 0 ], [ w, 0 ], [ w + xAcc, 0 ], [ xAcc, 0 ] ];
        var i = 0, acc = height, xAcc2 = incX;
        for (this.baseRect = [ this.rect[3], this.rect[2], [ this.rect[2][0] - xAcc2, this.rect[2][1] + acc ], [ this.rect[3][0] - xAcc2, this.rect[3][1] + acc ] ], 
        this.baseFrontRect = [ this.rect[3], this.rect[2], [ this.rect[2][0] - xAcc2, this.rect[2][1] + acc ], [ this.rect[3][0] - xAcc2, this.rect[3][1] + acc ] ], 
        this.backBaseShape = new PIXI.Graphics(), this.backBaseShape.beginFill(baseColor ? baseColor : 9837082), 
        this.backBaseShape.moveTo(this.baseRect[0][0], this.baseRect[0][1]), i = 1; i < this.baseRect.length; i++) this.backBaseShape.lineTo(this.baseRect[i][0], this.baseRect[i][1]);
        for (this.backBaseShape.endFill(), this.container.addChild(this.backBaseShape), 
        this.backFrontShape = new PIXI.Graphics(), this.backFrontShape.beginFill(frontColor ? frontColor : 3192624), 
        this.backFrontShape.moveTo(this.baseFrontRect[0][0], this.baseFrontRect[0][1]), 
        i = 1; i < this.baseFrontRect.length; i++) this.backFrontShape.lineTo(this.baseFrontRect[i][0], this.baseFrontRect[i][1]);
        for (this.backFrontShape.endFill(), this.container.addChild(this.backFrontShape), 
        this.backMask = new PIXI.Graphics(), this.backMask.beginFill(255), this.backMask.moveTo(this.baseRect[0][0], this.baseRect[0][1]), 
        i = 1; i < this.baseRect.length; i++) this.backMask.lineTo(this.baseRect[i][0], this.baseRect[i][1]);
        this.backMask.endFill(), this.container.addChild(this.backMask), this.backFrontShape.mask = this.backMask;
    },
    setBackColor: function(color) {
        var acc = this.height, xAcc2 = this.incX;
        for (this.baseRect = [ this.rect[3], this.rect[2], [ this.rect[2][0] - xAcc2, this.rect[2][1] + acc ], [ this.rect[3][0] - xAcc2, this.rect[3][1] + acc ] ], 
        this.baseFrontRect = [ this.rect[3], this.rect[2], [ this.rect[2][0] - xAcc2, this.rect[2][1] + acc ], [ this.rect[3][0] - xAcc2, this.rect[3][1] + acc ] ], 
        this.backBaseShape.clear(), this.backBaseShape.beginFill(color), this.backBaseShape.moveTo(this.baseRect[0][0], this.baseRect[0][1]), 
        i = 1; i < this.baseRect.length; i++) this.backBaseShape.lineTo(this.baseRect[i][0], this.baseRect[i][1]);
        this.backBaseShape.endFill();
    },
    setText: function(text) {
        this.text !== text && (this.lifebar ? this.lifebar.setText(text) : this.lifebar = new PIXI.Text(text, {
            fill: "white",
            align: "center",
            font: "10px Arial"
        }));
    },
    updateBar: function(currentValue, maxValue) {
        return this.currentValue < 0 ? void (this.backFrontShape.position.x = this.backFrontShape.position.width) : (this.currentValue = currentValue, 
        this.maxValue = maxValue, void (this.backFrontShape.position.x = this.backFrontShape.width * (this.currentValue / this.maxValue) - this.backFrontShape.width));
    },
    getContent: function() {
        return this.container;
    },
    setPosition: function(x, y) {
        this.container.position.x = x, this.container.position.y = y;
    }
}), AudioController = Class.extend({
    init: function() {
        function end() {
            self.updateAudioList(this);
        }
        function load() {
            self.currentLoaded++, self.currentLoaded >= self.audioList.length && (self.loadedAudioComplete = !0, 
            self.onCompleteCallback && self.onCompleteCallback());
        }
        this.audioList = [ {
            label: "loop",
            urls: [ "dist/audio/loop.mp3" ],
            volume: .1,
            loop: !0
        }, {
            label: "wub",
            urls: [ "dist/audio/wub.mp3" ],
            volume: .2,
            loop: !1
        }, {
            label: "error",
            urls: [ "dist/audio/error.mp3" ],
            volume: .5,
            loop: !1
        }, {
            label: "laser1",
            urls: [ "dist/audio/laser1.mp3" ],
            volume: .05,
            loop: !1
        }, {
            label: "laser2",
            urls: [ "dist/audio/laser2.mp3" ],
            volume: .05,
            loop: !1
        }, {
            label: "laser3",
            urls: [ "dist/audio/laser3.mp3" ],
            volume: .05,
            loop: !1
        }, {
            label: "laser4",
            urls: [ "dist/audio/laser4.mp3" ],
            volume: .05,
            loop: !1
        }, {
            label: "fall",
            urls: [ "dist/audio/fall.mp3" ],
            volume: .3,
            loop: !1
        }, {
            label: "explode1",
            urls: [ "dist/audio/explode1.mp3" ],
            volume: .15,
            loop: !1
        }, {
            label: "play",
            urls: [ "dist/audio/play.mp3" ],
            volume: .6,
            loop: !1
        }, {
            label: "perfect",
            urls: [ "dist/audio/perfect.mp3" ],
            volume: .1,
            loop: !1
        } ], this.onCompleteCallback = null, this.loadedAudioComplete = !1, this.audios = [];
        for (var self = this, i = this.audioList.length - 1; i >= 0; i--) {
            var tempObj = {
                label: this.audioList[i].label,
                audio: new Howl({
                    urls: this.audioList[i].urls,
                    volume: this.audioList[i].volume,
                    loop: this.audioList[i].loop,
                    onend: end,
                    onload: load
                })
            };
            this.audioList[i].loop || (tempObj.audio.onend = end), this.audios.push(tempObj);
        }
        this.currentLoaded = 0, this.playingAudios = [], this.ambientLabel = "";
    },
    updateAudioList: function(target) {
        if (this.ambientPlaying === target) return void this.playSound(this.ambientLabel);
        for (var j = this.playingAudios.length - 1; j >= 0; j--) this.playingAudios[j] === target && this.playingAudios.splice(j, 1);
    },
    playSound: function(id) {
        for (var audioP = null, i = this.audios.length - 1; i >= 0; i--) this.audios[i].label === id && (audioP = this.audios[i].audio, 
        audioP.play(), this.playingAudios.push(audioP));
        return audioP;
    },
    stopSound: function(id) {
        for (var audioP = null, i = this.audios.length - 1; i >= 0; i--) if (this.audios[i].label === id) {
            audioP = this.audios[i].audio, audioP.stop();
            for (var j = this.playingAudios.length - 1; j >= 0; j--) this.playingAudios[j] === audioP && this.playingAudios.splice(j, 1);
        }
        return audioP;
    },
    playAmbientSound: function(id) {
        this.ambientLabel !== id && (this.ambientPlaying && this.stopSound(this.ambientLabel), 
        this.ambientLabel = id, this.ambientPlaying = this.playSound(id));
    }
}), Ball = Entity.extend({
    init: function(vel, screen) {
        this._super(!0), this.updateable = !1, this.deading = !1, this.screen = screen, 
        this.range = 80, this.width = 1, this.height = 1, this.type = "bullet", this.target = "enemy", 
        this.fireType = "physical", this.node = null, this.velocity.x = vel.x, this.velocity.y = vel.y, 
        this.power = 1, this.defaultVelocity = 1, this.imgSource = "bullet.png", this.particleSource = "bullet.png";
    },
    startScaleTween: function() {
        TweenLite.from(this.getContent().scale, .3, {
            x: 0,
            y: 0,
            ease: "easeOutBack"
        });
    },
    build: function() {
        this.color = 16777215, this.spriteBall = new PIXI.Graphics(), this.spriteBall.beginFill(this.color), 
        this.maxSize = .05 * windowHeight, this.spriteBall.drawCircle(0, -this.maxSize, this.maxSize), 
        this.sprite = new PIXI.Sprite(), this.sprite.addChild(this.spriteBall), this.sprite.anchor.x = .5, 
        this.sprite.anchor.y = .5, this.updateable = !0, this.collidable = !0, this.getContent().alpha = .1, 
        TweenLite.to(this.getContent(), .3, {
            alpha: 1
        }), this.collideArea = new PIXI.Rectangle(-50, -50, windowWidth + 100, windowHeight + 100), 
        this.particlesCounterMax = 2, this.particlesCounter = 1, this.floorPos = windowHeight, 
        this.gravity = 0, this.gravityVal = .15, this.breakJump = !1, this.blockCollide = !1, 
        this.inError = !1, this.perfectShoot = 0, this.perfectShootAcum = 0, this.force = 0, 
        this.inJump = !1;
    },
    setFloor: function(pos) {
        this.floorPos = pos, this.velocity.y += this.gravityVal;
    },
    hideShadows: function() {
        TweenLite.to(this.shadow, .1, {
            alpha: 0
        });
    },
    updateShadow: function(angle) {
        TweenLite.to(this.shadow, .3, {
            delay: .1,
            alpha: this.shadowAlpha
        });
    },
    jump: function(force) {
        return this.breakJump ? void this.screen.miss() : (this.gravity = 0, this.velocity.y = -force - this.gravityVal * this.gravityVal / 1.5 * 10, 
        console.log(this.velocity.y, this.gravityVal), this.firstJump = !0, void (this.inJump = !0));
    },
    improveGravity: function() {
        this.gravityVal >= 1.2 || (this.gravityVal += .05);
    },
    update: function() {
        this._super(), this.blockCollide || this.layer.collideChilds(this), this.spriteBall.width = this.force + this.maxSize - Math.abs(this.velocity.y), 
        this.spriteBall.width < this.maxSize && (this.spriteBall.width = this.maxSize), 
        this.spriteBall.height = this.force + this.maxSize + Math.abs(this.velocity.y), 
        this.range = this.spriteBall.height / 2, this.getContent().position.y + this.velocity.y >= this.floorPos + this.maxSize ? (this.firstJump && this.screen.addCrazyMessage(this.screen.force > .5 ? "RELEASE" : "HOLD!"), 
        this.getContent().position.y = this.floorPos + this.maxSize, this.velocity.y = 0, 
        this.gravity = 0, this.breakJump = !1, this.blockCollide = !1, this.inError = !1, 
        this.force = 0, this.inJump && (this.explode(), APP.audioController.playSound("fall"), 
        this.inJump = !1)) : (this.breakJump || 0 !== this.velocity.y) && (this.velocity.y += this.gravityVal, 
        this.breakJump = !0), 0 !== this.velocity.y ? this.updateableParticles() : this.perfectShoot++;
    },
    updateableParticles: function() {
        if (this.particlesCounter--, this.particlesCounter <= 0) {
            this.particlesCounter = this.particlesCounterMax;
            var tempPart = new PIXI.Graphics();
            tempPart.beginFill(this.color), tempPart.drawCircle(0, 0, this.spriteBall.width);
            var particle = new Particles({
                x: 4 * Math.random() - 2,
                y: Math.random()
            }, 120, tempPart, .05 * Math.random());
            particle.initScale = this.getContent().scale.x / 2, particle.build(), particle.gravity = 0, 
            particle.alphadecress = .05, particle.scaledecress = -.05, particle.setPosition(this.getPosition().x - (Math.random() + .1 * this.getContent().width) / 2, this.getPosition().y - this.spriteBall.height / 2), 
            this.layer.addChild(particle), particle.getContent().parent.setChildIndex(particle.getContent(), 0);
        }
    },
    collide: function(arrayCollide) {
        if (0 !== this.velocity.y && this.collidable) for (var i = arrayCollide.length - 1; i >= 0; i--) if ("enemy" === arrayCollide[i].type) {
            var enemy = arrayCollide[i];
            this.velocity.y = 0, this.getContent().position.y = enemy.getContent().position.y, 
            enemy.preKill(), this.screen.getBall();
        } else if ("killer" === arrayCollide[i].type) this.screen.gameOver(), this.preKill(); else if ("coin" === arrayCollide[i].type) {
            this.velocity.y = 0;
            var isPerfect = !1;
            this.perfectShoot <= 4 ? (this.screen.getPerfect(), isPerfect = !0, 0 === this.perfectShootAcum ? this.perfectShootAcum = 4 : this.perfectShootAcum++) : this.perfectShootAcum = 0, 
            this.perfectShoot = 0, this.blockCollide = !0;
            var value = 1 + this.perfectShootAcum;
            APP.points += value, APP.audioController.playSound("explode1");
            var rot = .005 * Math.random(), tempLabel = new PIXI.Text("+" + value, {
                font: "50px Vagron",
                fill: "#13c2b6"
            }), labelCoin = new Particles({
                x: 0,
                y: 0
            }, 120, tempLabel, rot);
            labelCoin.maxScale = this.getContent().scale.x, labelCoin.build(), labelCoin.gravity = -.2, 
            labelCoin.alphadecress = .01, labelCoin.scaledecress = .05, labelCoin.setPosition(this.getPosition().x - tempLabel.width / 2, this.getPosition().y), 
            this.screen.layer.addChild(labelCoin);
            var labelCoin2 = new Particles({
                x: 0,
                y: 0
            }, 120, new PIXI.Text("+" + value, {
                font: "50px Vagron",
                fill: "#9d47e0"
            }), -rot);
            labelCoin2.maxScale = this.getContent().scale.x, labelCoin2.build(), labelCoin2.gravity = -.2, 
            labelCoin2.alphadecress = .01, labelCoin2.scaledecress = .05, labelCoin2.setPosition(this.getPosition().x - tempLabel.width / 2 + 2, this.getPosition().y + 2), 
            this.screen.layer.addChild(labelCoin2), this.screen.getCoin(isPerfect);
        }
    },
    setColor: function(color) {
        this.color = color, this.spriteBall.clear(), this.spriteBall.beginFill(color), this.spriteBall.drawCircle(0, -this.maxSize, this.maxSize);
    },
    charge: function(force) {
        var angle = degreesToRadians(360 * Math.random()), dist = .9 * this.spriteBall.height, pPos = {
            x: dist * Math.sin(angle) + this.getContent().position.x,
            y: dist * Math.cos(angle) + this.getContent().position.y
        }, vector = Math.atan2(this.getPosition().x - pPos.x, this.getPosition().y - pPos.y), vel = 2, vecVel = {
            x: Math.sin(vector) * vel,
            y: Math.cos(vector) * vel
        }, tempPart = new PIXI.Graphics();
        tempPart.beginFill(this.color), tempPart.drawCircle(0, 0, .05 * windowHeight);
        var particle = new Particles(vecVel, 800, tempPart, 0);
        particle.initScale = this.getContent().scale.x / 10, particle.maxScale = this.getContent().scale.x / 3, 
        particle.build(), particle.gravity = 0, particle.scaledecress = -.01, particle.setPosition(pPos.x, pPos.y - this.spriteBall.height / 2), 
        this.layer.addChild(particle), particle.getContent().parent.setChildIndex(particle.getContent(), 0);
    },
    explode: function() {
        tempParticle = new PIXI.Graphics(), tempParticle.beginFill(this.color), tempParticle.drawCircle(0, 0, this.spriteBall.width), 
        particle = new Particles({
            x: 0,
            y: 0
        }, 600, tempParticle, 0), particle.maxScale = 5 * this.getContent().scale.x, particle.maxInitScale = 1, 
        particle.build(), particle.alphadecress = .08, particle.scaledecress = .1, particle.setPosition(this.getPosition().x, this.getPosition().y), 
        this.layer.addChild(particle);
    },
    preKill: function() {
        if (!this.invencible) {
            APP.audioController.playSound("explode1"), this.collidable = !1, this.kill = !0;
            for (var i = 10; i >= 0; i--) tempParticle = new PIXI.Graphics(), tempParticle.beginFill(this.color), 
            tempParticle.drawCircle(0, 0, .2 * this.spriteBall.width), particle = new Particles({
                x: 10 * Math.random() - 5 - 10,
                y: 10 * Math.random() - 5 + 10
            }, 600, tempParticle, .05 * Math.random()), particle.build(), particle.alphadecress = .008, 
            particle.setPosition(this.getPosition().x - (Math.random() + .4 * this.getContent().width) + .2 * this.getContent().width, this.getPosition().y - (Math.random() + .4 * this.getContent().width) + .2 * this.getContent().width), 
            this.layer.addChild(particle);
            tempParticle = new PIXI.Graphics(), tempParticle.beginFill(this.color), tempParticle.drawCircle(0, 0, this.spriteBall.width), 
            particle = new Particles({
                x: 0,
                y: 0
            }, 600, tempParticle, 0), particle.maxScale = 5 * this.getContent().scale.x, particle.maxInitScale = 1, 
            particle.build(), particle.alphadecress = .05, particle.scaledecress = .1, particle.setPosition(this.getPosition().x, this.getPosition().y), 
            this.layer.addChild(particle);
        }
    }
}), Coin = Entity.extend({
    init: function(vel, behaviour) {
        this._super(!0), this.updateable = !1, this.deading = !1, this.range = 80, this.width = 1, 
        this.height = 1, this.type = "coin", this.node = null, this.velocity.x = vel.x, 
        this.velocity.y = vel.y, this.timeLive = 1e3, this.power = 1, this.defaultVelocity = 1, 
        this.imgSource = "bullet.png", this.particleSource = "bullet.png", this.rot = 0, 
        this.inMove = !1;
    },
    startScaleTween: function() {
        TweenLite.from(this.getContent().scale, .3, {
            x: 0,
            y: 0,
            ease: "easeOutBack"
        });
    },
    randomPos: function(rangeMin, rangeMax) {
        var yDest = rangeMin + Math.random() * rangeMax;
        this.inMove = !0;
        var self = this;
        TweenLite.to(this.getContent(), .5, {
            delay: .4,
            y: yDest,
            onComplete: function() {
                self.inMove = !1;
            }
        });
    },
    build: function() {
        this.spriteBall = new PIXI.Graphics(), this.spriteBall.beginFill(16777215);
        var size = .05 * windowHeight;
        this.spriteBall.drawRect(-size / 2, -size / 2, size, size), this.sprite = new PIXI.Sprite(), 
        this.sprite.addChild(this.spriteBall), this.updateable = !0, this.collidable = !0, 
        this.getContent().alpha = .5, TweenLite.to(this.getContent(), .3, {
            alpha: 1
        }), this.collideArea = new PIXI.Rectangle(-50, -50, windowWidth + 100, windowHeight + 100), 
        this.particlesCounterMax = 8, this.particlesCounter = 1;
    },
    update: function() {
        this.range = this.spriteBall.width, this._super(), this.inMove && this.updateableParticles();
    },
    changeShape: function() {},
    explode: function(velX, velY) {
        var particle = null, tempParticle = null;
        this.size = 8;
        for (var i = 10; i >= 0; i--) console.log("part"), tempParticle = new PIXI.Graphics(), 
        tempParticle.beginFill(16777215), tempParticle.drawRect(-this.size / 2, -this.size / 2, this.size, this.size), 
        particle = new Particles({
            x: 10 * Math.random() - 5 + (velX ? velX : 0),
            y: 10 * Math.random() - 5 + (velY ? velY : 0)
        }, 600, tempParticle, .05 * Math.random()), particle.build(), particle.alphadecress = .008, 
        particle.setPosition(this.getPosition().x - (Math.random() + .4 * this.getContent().width) + .2 * this.getContent().width, this.getPosition().y - (Math.random() + .4 * this.getContent().width) + .2 * this.getContent().width), 
        this.layer.addChild(particle);
        tempParticle = new PIXI.Graphics(), this.size = .05 * windowHeight, tempParticle.beginFill(16777215), 
        tempParticle.drawRect(-this.size / 2, -this.size / 2, this.size, this.size), particle = new Particles({
            x: 0,
            y: 0
        }, 600, tempParticle, 0), particle.maxScale = 5 * this.getContent().scale.x, particle.maxInitScale = 1, 
        particle.build(), particle.alphadecress = .05, particle.scaledecress = .1, particle.setPosition(this.getPosition().x, this.getPosition().y), 
        this.layer.addChild(particle);
    },
    updateableParticles: function() {
        if (this.particlesCounter--, this.particlesCounter <= 0) {
            this.particlesCounter = this.particlesCounterMax;
            var tempPart = new PIXI.Graphics();
            tempPart.beginFill(16777215), tempPart.drawRect(-this.size / 2, -this.size / 2, this.size, this.size);
            var particle = new Particles({
                x: 0,
                y: 0
            }, 120, tempPart, 0);
            particle.build(), particle.gravity = 0, particle.alphadecress = .04, particle.scaledecress = -.01, 
            particle.setPosition(this.getPosition().x, this.getPosition().y), this.layer.addChild(particle), 
            particle.getContent().parent.setChildIndex(particle.getContent(), 0);
        }
    },
    preKill: function() {
        this.invencible || (this.explode(-2, 2), this.collidable = !1, this.kill = !0);
    }
}), CrazyLogo = Entity.extend({
    init: function(screen) {
        this._super(!0), this.screen = screen, this.container = new PIXI.DisplayObjectContainer(), 
        this.title = "XPLODE", this.vecLetters = [], this.tempCounter = 0, this.colorsCounter = 300, 
        this.interval = 0;
    },
    build: function() {
        this.updateable = !0;
        for (var before = 0, i = 1; i <= this.title.length; i++) tempText = new PIXI.Text(this.title[i - 1], {
            align: "center",
            font: "48px Vagron",
            fill: APP.vecColorsS[this.tempCounter],
            stroke: "#FFFFFF",
            strokeThickness: 5
        }), console.log(this.title[i - 1], tempText.width), tempText.resolution = 2, tempText.sin = .5 * i, 
        tempText.position.x = this.container.width + before / 4, tempText.position.y = 50 * Math.sin(tempText.sin), 
        console.log(tempText.position.y), this.container.addChild(tempText), before = tempText.width, 
        this.vecLetters.push(tempText), this.tempCounter++, this.tempCounter >= APP.vecColorsS.length && (this.tempCounter = 0);
        var self = this;
        clearInterval(this.interval), this.interval = setInterval(function() {
            self.screen.changeColor(!1, !1, !0);
        }, 1e3);
    },
    removeInterval: function() {
        clearInterval(this.interval);
    },
    getContent: function() {
        return this.container;
    },
    update: function() {
        if (this.updateable) {
            var changeColors = !1;
            this.colorsCounter--, this.colorsCounter < 0 && (changeColors = !0, this.colorsCounter = 200);
            for (var i = 0; i < this.vecLetters.length; i++) this.vecLetters[i].position.y = 50 * Math.sin(this.vecLetters[i].sin += .2), 
            (changeColors || Math.random() < .05) && (this.tempCounter++, this.tempCounter >= APP.vecColorsS.length && (this.tempCounter = 0), 
            this.vecLetters[i].setStyle({
                align: "center",
                font: "48px Vagron",
                fill: APP.vecColorsS[this.tempCounter],
                stroke: "#FFFFFF",
                strokeThickness: 5
            }));
        }
    }
}), EnemyBall = Entity.extend({
    init: function(vel, behaviour) {
        this._super(!0), this.updateable = !1, this.deading = !1, this.range = 80, this.width = 1, 
        this.height = 1, this.type = "enemy", this.node = null, this.velocity.x = vel.x, 
        this.velocity.y = vel.y, this.timeLive = 1e3, this.power = 1, this.defaultVelocity = 1, 
        this.behaviour = behaviour.clone(), this.imgSource = "burger.png", this.particleSource = "bullet.png";
    },
    startScaleTween: function() {
        TweenLite.from(this.getContent().scale, .3, {
            x: 0,
            y: 0,
            ease: "easeOutBack"
        });
    },
    build: function() {
        this.sprite = new PIXI.Sprite.fromFrame(this.imgSource), this.sprite.anchor.x = .5, 
        this.sprite.anchor.y = .5, this.updateable = !0, this.collidable = !0, this.getContent().alpha = .5, 
        TweenLite.to(this.getContent(), .3, {
            alpha: 1
        }), this.collideArea = new PIXI.Rectangle(-50, -50, windowWidth + 100, windowHeight + 100), 
        this.particlesCounterMax = 5, this.particlesCounter = 5;
    },
    update: function() {
        this.range = this.sprite.height / 4, this._super(), this.behaviour.update(this);
    },
    updateableParticles: function() {
        if (this.particlesCounter--, this.particlesCounter <= 0) {
            this.particlesCounter = this.particlesCounterMax;
            var particle = new Particles({
                x: 0,
                y: 0
            }, 120, this.particleSource, .05 * Math.random());
            particle.maxScale = this.getContent().scale.x, particle.maxInitScale = particle.maxScale, 
            particle.build(), particle.gravity = 0, particle.alphadecress = .08, particle.scaledecress = -.04, 
            particle.setPosition(this.getPosition().x - (Math.random() + .1 * this.getContent().width) / 2, this.getPosition().y), 
            this.layer.addChild(particle), particle.getContent().parent.setChildIndex(particle.getContent(), 0);
        }
    },
    preKill: function() {
        if (!this.invencible) {
            this.velocity = {
                x: 0,
                y: 0
            };
            var self = this;
            TweenLite.to(this.getContent().scale, .2, {
                x: .5,
                y: .5
            }), TweenLite.to(this.getContent(), .2, {
                alpha: 0,
                onComplete: function() {
                    self.kill = !0;
                }
            });
            for (var i = 6; i >= 0; i--) {
                var particle = new Particles({
                    x: 8 * Math.random() - 4,
                    y: 8 * Math.random() - 4
                }, 120, this.particleSource, .05 * Math.random());
                particle.build(), particle.getContent().tint = APP.appModel.currentPlayerModel.color, 
                particle.alphadecress = .02, particle.scaledecress = -.05, particle.setPosition(this.getPosition().x - (Math.random() + .1 * this.getContent().width) / 2, this.getPosition().y), 
                this.layer.addChild(particle);
            }
            this.collidable = !1, this.updateable = !1;
        }
    }
}), InteractiveBackground = Entity.extend({
    init: function(screen) {
        this._super(!0), this.screen = screen, this.container = new PIXI.DisplayObjectContainer(), 
        this.vecDots = [], this.gravity = 0, this.accel = 0;
    },
    build: function() {
        this.dist = 60;
        for (var _w = windowWidth / this.dist, _h = windowHeight / this.dist, i = 0; _w > i; i++) for (var j = 0; _h > j; j++) if (Math.random() > .2) {
            var dot = new PIXI.Graphics();
            dot.beginFill(16777215), dot.velocity = {
                x: 0,
                y: 0
            }, dot.velocity.y = .1 + .2 * Math.random(), dot.velocity.x = 0, dot.drawRect(0, 0, Math.ceil(6 * dot.velocity.y), Math.ceil(10 * dot.velocity.y)), 
            dot.position.x = this.dist * i + Math.random() * this.dist / 2, dot.position.y = this.dist * j + Math.random() * this.dist / 2, 
            this.container.addChild(dot), dot.alpha = .5 * Math.random() + .3, dot.side = Math.random() < .5 ? 1 : -1, 
            this.vecDots.push(dot);
        }
    },
    getContent: function() {
        return this.container;
    },
    update: function() {
        for (var i = this.vecDots.length - 1; i >= 0; i--) this.vecDots[i].position.x += this.vecDots[i].velocity.x + this.accel, 
        this.vecDots[i].position.y += this.vecDots[i].velocity.y + this.gravity, this.vecDots[i].alpha += .01 * this.vecDots[i].side, 
        (this.vecDots[i].alpha <= 0 || this.vecDots[i].alpha >= .8) && (this.vecDots[i].side *= -1), 
        this.vecDots[i].position.y > windowHeight + this.dist && (this.vecDots[i].position.y = 0), 
        this.vecDots[i].position.x > windowWidth + this.dist ? this.vecDots[i].position.x = 0 : this.vecDots[i].position.x < 0 && (this.vecDots[i].position.x = windowWidth + this.dist);
    }
}), KillerBall = Entity.extend({
    init: function(vel, behaviour) {
        this._super(!0), this.updateable = !1, this.deading = !1, this.range = 80, this.width = 1, 
        this.height = 1, this.type = "killer", this.node = null, this.velocity.x = vel.x, 
        this.velocity.y = vel.y, this.timeLive = 1e3, this.power = 1, this.defaultVelocity = 1, 
        this.behaviour = behaviour.clone(), this.imgSource = "inimigo.png", this.particleSource = "partEnemy.png";
    },
    startScaleTween: function() {
        TweenLite.from(this.getContent().scale, .3, {
            x: 0,
            y: 0,
            ease: "easeOutBack"
        });
    },
    build: function() {
        this.sprite = new PIXI.Sprite.fromFrame(this.imgSource), this.sprite.anchor.x = .5, 
        this.sprite.anchor.y = .5, this.updateable = !0, this.collidable = !0, this.getContent().alpha = .5, 
        TweenLite.to(this.getContent(), .3, {
            alpha: 1
        }), this.collideArea = new PIXI.Rectangle(-50, -50, windowWidth + 100, windowHeight + 100), 
        this.particlesCounterMax = 5, this.particlesCounter = 5;
    },
    update: function() {
        this.range = this.sprite.height / 2.5;
        var tempRot = 0;
        tempRot = this.behaviour.tempPosition ? Math.atan2(this.behaviour.tempPosition.y, this.behaviour.tempPosition.x) : Math.atan2(this.velocity.y, this.velocity.x), 
        this.getContent().rotation = -tempRot, this._super(), this.behaviour.update(this), 
        this.updateableParticles();
    },
    updateableParticles: function() {
        if (this.particlesCounter--, this.particlesCounter <= 0) {
            this.particlesCounter = this.particlesCounterMax;
            var particle = new Particles({
                x: 4 * Math.random() - 2,
                y: 4 * Math.random() - 2
            }, 120, this.particleSource, .3 * Math.random() - .15);
            particle.maxScale = this.getContent().scale.x / 2 + Math.random() * this.getContent().scale.x / 2, 
            particle.maxInitScale = particle.maxScale, particle.growType = -1, particle.build(), 
            particle.gravity = 0, particle.alphadecress = .08, particle.scaledecress = -.04, 
            particle.setPosition(this.getPosition().x - (Math.random() + .1 * this.getContent().width) / 2, this.getPosition().y), 
            this.layer.addChild(particle);
        }
    },
    preKill: function() {
        if (!this.invencible) {
            for (var i = 5; i >= 0; i--) {
                var particle = new Particles({
                    x: 8 * Math.random() - 4,
                    y: 8 * Math.random() - 4
                }, 120, this.particleSource, .1 * Math.random());
                particle.maxScale = this.getContent().scale.x / 2, particle.maxInitScale = particle.maxScale, 
                particle.build(), particle.gravity = .3 * Math.random(), particle.alphadecress = .04, 
                particle.scaledecress = -.05, particle.setPosition(this.getPosition().x - (Math.random() + .1 * this.getContent().width) / 2, this.getPosition().y), 
                this.layer.addChild(particle);
            }
            this.collidable = !1, this.kill = !0;
        }
    }
}), AppModel = Class.extend({
    init: function() {
        console.log(APP);
        var coins = APP.cookieManager.getSafeCookie("coins"), high = APP.cookieManager.getSafeCookie("highScore"), plays = APP.cookieManager.getSafeCookie("plays");
        APP.totalCoins = coins ? coins : 0, APP.highScore = high ? high : 0, APP.plays = plays ? plays : 0, 
        APP.currentPoints = 0, this.playerModels = [], this.playerModels.push({
            value: 0,
            label: "KETCHUP",
            color: 15152942,
            id: this.playerModels.length,
            enabled: !0
        }), this.playerModels.push({
            value: 10,
            label: "WASABI",
            color: 6073388,
            id: this.playerModels.length,
            enabled: !1
        }), this.playerModels.push({
            value: 20,
            label: "MAYO",
            color: 15461547,
            id: this.playerModels.length,
            enabled: !1
        }), this.playerModels.push({
            value: 30,
            label: "MOUSTARD",
            color: 15790663,
            id: this.playerModels.length,
            enabled: !1
        }), this.playerModels.push({
            value: 40,
            label: "BARBIECUE",
            color: 11619621,
            id: this.playerModels.length,
            enabled: !1
        }), this.playerModels.push({
            value: 50,
            label: "PUTONIUM",
            color: 7927665,
            id: this.playerModels.length,
            enabled: !1
        }), this.towelModels = [], this.towelModels.push({
            value: 0,
            color: 65280,
            imgSrc: "dist/img/2.png",
            thumb: "fundot2.png",
            id: this.towelModels.length,
            enabled: !1
        }), this.towelModels.push({
            value: 5,
            color: 16729404,
            imgSrc: "dist/img/1.png",
            thumb: "fundot1.png",
            id: this.towelModels.length,
            enabled: !0
        }), this.towelModels.push({
            value: 10,
            color: 255,
            imgSrc: "dist/img/3.png",
            thumb: "fundot3.png",
            id: this.towelModels.length,
            enabled: !1
        }), this.towelModels.push({
            value: 15,
            color: 10487543,
            imgSrc: "dist/img/4.png",
            thumb: "fundot4.png",
            id: this.towelModels.length,
            enabled: !1
        }), this.towelModels.push({
            value: 20,
            color: 364288,
            imgSrc: "dist/img/5.png",
            thumb: "fundot5.png",
            id: this.towelModels.length,
            enabled: !1
        }), this.towelModels.push({
            value: 25,
            color: 9830655,
            imgSrc: "dist/img/6.png",
            thumb: "fundot6.png",
            id: this.towelModels.length,
            enabled: !1
        }), this.burguersModels = [], this.burguersModels.push({
            value: 0,
            color: 16729404,
            imgSrc: "burger.png",
            thumb: "burger.png",
            id: this.burguersModels.length,
            enabled: !0
        }), this.burguersModels.push({
            value: 5,
            color: 65280,
            imgSrc: "burger.png",
            thumb: "burger.png",
            id: this.burguersModels.length,
            enabled: !1
        }), this.burguersModels.push({
            value: 10,
            color: 255,
            imgSrc: "burger.png",
            thumb: "burger.png",
            id: this.burguersModels.length,
            enabled: !1
        }), this.burguersModels.push({
            value: 15,
            color: 10487543,
            imgSrc: "burger.png",
            thumb: "burger.png",
            id: this.burguersModels.length,
            enabled: !1
        }), this.burguersModels.push({
            value: 20,
            color: 364288,
            imgSrc: "burger.png",
            thumb: "burger.png",
            id: this.burguersModels.length,
            enabled: !1
        }), this.burguersModels.push({
            value: 25,
            color: 9830655,
            imgSrc: "burger.png",
            thumb: "burger.png",
            id: this.burguersModels.length,
            enabled: !1
        }), this.updateTowels(), this.updateBurguers();
        var enableds = APP.cookieManager.getSafeCookie("enableds"), j = 0;
        if (enableds) for (enableds = enableds.split(","), j = 0; j < this.playerModels.length - 1; j++) console.log(enableds[j]), 
        "1" === enableds[j] && (this.playerModels[j].enabled = !0); else {
            for (console.log("whata"), enableds = "1", j = 0; j < this.playerModels.length - 1; j++) enableds += ",0";
            APP.cookieManager.setSafeCookie("enableds", enableds);
        }
        this.currentPlayerModel = this.playerModels[0], this.currentTowelModel = this.towelModels[0], 
        this.currentBurguerlModel = this.burguersModels[0], this.totalPlayers = 0;
        for (var i = this.playerModels.length - 1; i >= 0; i--) this.playerModels[i].toAble <= this.totalPoints && (this.playerModels[i].able = !0, 
        this.totalPlayers++);
        this.currentHorde = 0;
    },
    updateBurguers: function() {
        var i = 0;
        for (i = this.burguersModels.length - 1; i >= 0; i--) this.burguersModels[i].value <= APP.highScore && (this.burguersModels[i].enabled = !0);
    },
    updateTowels: function() {
        var i = 0;
        for (i = this.towelModels.length - 1; i >= 0; i--) this.towelModels[i].value <= APP.plays && (this.towelModels[i].enabled = !0);
    },
    saveScore: function() {
        APP.cookieManager.setSafeCookie("coins", APP.totalCoins), APP.cookieManager.setSafeCookie("highScore", APP.highScore), 
        APP.cookieManager.setSafeCookie("plays", APP.plays);
        var i = 0;
        this.updateTowels(), this.updateBurguers();
        var enableds = "1";
        for (i = 1; i < this.playerModels.length; i++) enableds += this.playerModels[i].enabled ? ",1" : ",0";
        console.log(enableds), APP.cookieManager.setSafeCookie("enableds", enableds), console.log(APP.cookieManager.getSafeCookie("enableds"));
    },
    setModel: function(id) {
        this.currentID = id, this.currentPlayerModel = this.playerModels[id];
    },
    zerarTudo: function() {
        APP.totalCoins = 0, APP.highScore = 0, APP.plays = 0, APP.cookieManager.setSafeCookie("enableds", "0"), 
        APP.cookieManager.setSafeCookie("coins", APP.totalCoins), APP.cookieManager.setSafeCookie("highScore", APP.highScore), 
        APP.cookieManager.setSafeCookie("plays", APP.plays);
    },
    maxPoints: function() {
        this.currentHorde = 0, this.totalPoints = 999999, this.totalBirds = 8, APP.cookieManager.setCookie("totalPoints", this.totalPoints, 500), 
        APP.cookieManager.setCookie("totalBirds", this.totalBirds, 500);
        for (var i = this.playerModels.length - 1; i >= 0; i--) this.playerModels[i].toAble <= this.totalPoints ? this.playerModels[i].able = !0 : this.playerModels[i].able = !1;
    },
    getNewObstacle: function(screen) {
        var id = Math.floor(this.obstacleModels.length * Math.random()), obs = new Obstacle(this.obstacleModels[id], screen);
        return obs;
    },
    getNewEnemy: function(player, screen) {
        this.currentHorde++;
        var max = this.birdProbs.length;
        this.currentHorde < max && (max = this.currentHorde);
        for (var id = 99999; id > this.totalBirds - 1; ) id = this.birdProbs[Math.floor(max * Math.random())];
        this.birdModels[id].target = player;
        var bird = new Bird(this.birdModels[id], screen);
        return bird.id = id, console.log(bird.id), this.lastID = id, bird;
    },
    ableNewBird: function(birdModel) {
        if (birdModel && !(this.totalBirds >= this.birdModels.length)) {
            this.totalBirds = 0;
            for (var i = 0; i < this.birdModels.length; i++) if (this.totalBirds++, this.birdModels[i].label === birdModel.label) {
                console.log(this.birdModels[i].label, birdModel.label);
                break;
            }
            console.log(this.totalBirds), APP.cookieManager.setCookie("totalBirds", this.totalBirds, 500);
        }
    },
    add100Points: function() {
        this.totalPoints += 100, APP.cookieManager.setCookie("totalPoints", 100, 500), this.totalPlayers = 0;
        for (var i = this.playerModels.length - 1; i >= 0; i--) this.playerModels[i].toAble <= this.totalPoints && !this.playerModels[i].able && (this.playerModels[i].able = !0), 
        this.playerModels[i].able && this.totalPlayers++;
    },
    addPoints: function() {
        this.currentHorde = 0, this.totalPoints += this.currentPoints, this.highScore < this.currentPoints && (this.highScore = this.currentPoints, 
        APP.cookieManager.setCookie("highScore", this.highScore, 500), APP.dataManager.saveScore()), 
        APP.cookieManager.setCookie("totalPoints", this.totalPoints, 500), this.maxPoints < this.currentPoints && (this.maxPoints = this.currentPoints);
        var tempReturn = [];
        this.totalPlayers = 0;
        for (var i = this.playerModels.length - 1; i >= 0; i--) this.playerModels[i].toAble <= this.totalPoints && !this.playerModels[i].able && (this.playerModels[i].able = !0, 
        tempReturn.push(this.playerModels[i])), this.playerModels[i].able && this.totalPlayers++;
        return tempReturn;
    },
    build: function() {},
    destroy: function() {},
    serialize: function() {}
}), DataManager = Class.extend({
    init: function() {
        this.highscore = APP.cookieManager.getCookie("highScore"), console.log("highscore", this.highscore.points);
    },
    saveScore: function(id) {
        var i = 0, tempBirds = [ [ "caralinhoDaTerra", 0 ], [ "caralhoBelga", 0 ], [ "lambecuFrances", 0 ], [ "papacuDeCabecaRoxa", 0 ], [ "galinhoPapoDeBago", 0 ], [ "nocututinha", 0 ], [ "calopsuda", 0 ], [ "picudaoAzulNigeriano", 0 ] ];
        for (i = APP.getGameModel().killedBirds.length - 1; i >= 0; i--) tempBirds[APP.getGameModel().killedBirds[i]][1]++;
        var sendObject = '{\n"character":"' + APP.getGameModel().playerModels[APP.getGameModel().currentID].label + '",\n"points":"' + APP.getGameModel().currentPoints + '",\n"birds":{\n';
        for (i = 0; i < tempBirds.length; i++) sendObject += i >= tempBirds.length - 1 ? '"' + tempBirds[i][0] + '":"' + tempBirds[i][1] + '"\n' : '"' + tempBirds[i][0] + '":"' + tempBirds[i][1] + '",\n';
        sendObject += "}\n}", console.log(sendObject);
        ({
            character: APP.getGameModel().playerModels[APP.getGameModel().currentID].label,
            points: APP.getGameModel().currentPoints
        });
        this.highscore = JSON.parse(sendObject), APP.cookieManager.setCookie("highScore", this.highscore, 500);
    }
}), GameScreen = AbstractScreen.extend({
    init: function(label) {
        this._super(label), this.isLoaded = !1, this.fistTime = !1, APP.points = 0, APP.cookieManager.getSafeCookie("highscore") ? APP.highscore = APP.cookieManager.getSafeCookie("highscore") : (APP.cookieManager.setSafeCookie("highscore", 0), 
        APP.highscore = 0), APP.audioController.playAmbientSound("loop");
    },
    destroy: function() {
        this._super();
    },
    build: function() {
        this._super();
        var assetsToLoader = [];
        void 0 !== assetsToLoader && assetsToLoader.length > 0 && !this.isLoaded ? this.initLoad() : this.onAssetsLoaded(), 
        this.pinVel = {
            x: 0,
            y: 0
        }, console.log("buid"), this.addSoundButton();
    },
    onProgress: function() {
        this._super();
    },
    onAssetsLoaded: function() {
        this.initApplication();
    },
    addSoundButton: function() {
        this.soundButtonContainer = new PIXI.DisplayObjectContainer(), this.soundOn = new PIXI.Graphics(), 
        this.soundOn.beginFill(16777215), this.soundOn.moveTo(10, 0), this.soundOn.lineTo(0, 0), 
        this.soundOn.lineTo(0, 20), this.soundOn.lineTo(10, 20), this.soundOn.moveTo(15, 20), 
        this.soundOn.lineTo(25, 20), this.soundOn.lineTo(25, 0), this.soundOn.lineTo(15, 0), 
        this.soundOff = new PIXI.Graphics(), this.soundOff.beginFill(16777215), this.soundOff.moveTo(20, 10), 
        this.soundOff.lineTo(5, 0), this.soundOff.lineTo(5, 20), this.soundButtonContainer.addChild(APP.mute ? this.soundOff : this.soundOn), 
        this.addChild(this.soundButtonContainer), this.soundButtonContainer.position.x = windowWidth - 1.5 * this.soundButtonContainer.width, 
        this.soundButtonContainer.position.y = this.soundButtonContainer.width, this.soundButtonContainer.hitArea = new PIXI.Rectangle(-5, -5, 35, 35), 
        this.soundButtonContainer.interactive = !0, this.soundButtonContainer.buttonMode = !0;
        var self = this;
        this.soundButtonContainer.touchstart = this.soundButtonContainer.mousedown = function(mouseData) {
            APP.mute ? (APP.mute = !1, Howler.unmute()) : (APP.mute = !0, Howler.mute()), self.soundOff.parent && self.soundOff.parent.removeChild(self.soundOff), 
            self.soundOn.parent && self.soundOn.parent.removeChild(self.soundOn), self.soundButtonContainer.addChild(APP.mute ? self.soundOff : self.soundOn);
        };
    },
    initApplication: function() {
        var self = this;
        this.background ? this.addChild(this.background) : (this.background = new PIXI.Graphics(), 
        this.background.beginFill(APP.backColor), this.background.drawRect(0, 0, windowWidth, windowHeight), 
        this.addChild(this.background)), this.interactiveBackground ? this.addChild(this.interactiveBackground) : (this.interactiveBackground = new InteractiveBackground(this), 
        this.interactiveBackground.build(), this.addChild(this.interactiveBackground)), 
        this.hitTouch = new PIXI.Graphics(), this.hitTouch.interactive = !0, this.hitTouch.beginFill(0), 
        this.hitTouch.drawRect(0, 0, windowWidth, windowHeight), this.hitTouch.alpha = 0, 
        this.hitTouch.hitArea = new PIXI.Rectangle(0, 0, windowWidth, windowHeight), this.tapDown = !1, 
        this.hitTouch.touchend = this.hitTouch.mouseup = function(mouseData) {
            self.tapDown = !1, self.shoot(self.force / 30 * windowHeight * .1);
        }, this.hitTouch.touchstart = this.hitTouch.mousedown = function(touchData) {
            self.tapDown = !0;
        }, this.updateable = !0, APP.withAPI && GameAPI.GameBreak.request(function() {
            self.pauseModal.show();
        }, function() {
            self.pauseModal.hide();
        }), this.layerManager = new LayerManager(), this.layerManager.build("Main"), this.addChild(this.layerManager), 
        this.layer = new Layer(), this.layer.build("EntityLayer"), this.layerManager.addLayer(this.layer), 
        this.coinsLabel = new PIXI.Text("0", {
            align: "center",
            font: "72px Vagron",
            fill: "#FFFFFF",
            wordWrap: !0,
            wordWrapWidth: 500
        }), this.coinsLabel.resolution = retina, this.coinsLabel.alpha = 0, this.addChild(this.coinsLabel), 
        this.crazyContent = new PIXI.DisplayObjectContainer(), this.addChild(this.crazyContent), 
        this.loaderBar = new LifeBarHUD(windowWidth, 30, 0, 16777215, 16777215), this.addChild(this.loaderBar.getContent()), 
        this.loaderBar.getContent().position.x = 0, this.loaderBar.getContent().position.y = 0, 
        this.loaderBar.updateBar(0, 100), this.loaderBar.getContent().alpha = 0, this.fistTime ? this.initLevel() : (this.changeColor(!0, !0), 
        this.openEndMenu(), this.fistTime = !0), this.startLevel = !1;
    },
    addCrazyMessage: function(message) {
        if (this.crazyLabel && this.crazyLabel.parent) {
            if (this.crazyLabel.text === message) return;
            this.crazyLabel.parent.removeChild(this.crazyLabel);
        }
        this.crazyLabel2 && this.crazyLabel2.parent && this.crazyLabel2.parent.removeChild(this.crazyLabel2);
        var rot = .03 * Math.random() + .05;
        rot = Math.random() < .5 ? -rot : rot;
        var scl = 1;
        this.crazyLabel = new PIXI.Text(message, {
            align: "center",
            font: "40px Vagron",
            fill: "#9d47e0",
            wordWrap: !0,
            wordWrapWidth: 500
        }), this.crazyLabel.resolution = 2, this.crazyLabel.rotation = rot, this.crazyLabel.position.y = windowHeight / 2 + this.crazyLabel.height, 
        this.crazyLabel.position.x = windowWidth / 2, this.crazyLabel.anchor = {
            x: .5,
            y: .5
        }, this.crazyLabel2 = new PIXI.Text(message, {
            align: "center",
            font: "40px Vagron",
            fill: "#13c2b6",
            wordWrap: !0,
            wordWrapWidth: 500
        }), this.crazyLabel2.resolution = 2, this.crazyLabel2.rotation = -rot, this.crazyLabel2.position.y = windowHeight / 2 + this.crazyLabel2.height, 
        this.crazyLabel2.position.x = windowWidth / 2, this.crazyLabel2.anchor = {
            x: .5,
            y: .5
        }, this.crazyContent.addChild(this.crazyLabel), this.crazyContent.addChild(this.crazyLabel2), 
        this.crazyContent.alpha = 1, this.crazyContent.rotation = 0, TweenLite.from(this.crazyLabel, .4, {
            rotation: 0
        }), TweenLite.from(this.crazyLabel2, .4, {
            rotation: 0
        }), TweenLite.from(this.crazyLabel.scale, .2, {
            x: 2 * scl,
            y: 2 * scl
        }), TweenLite.from(this.crazyLabel2.scale, .2, {
            x: 2 * scl,
            y: 2 * scl
        });
    },
    miss: function() {
        APP.audioController.playSound("error"), this.player.breakJump = !0, this.player.velocity.y = 0;
        var wrongLabel = APP.vecError[Math.floor(APP.vecError.length * Math.random())], rot = .004 * Math.random(), tempLabel = new PIXI.Text(wrongLabel, {
            font: "35px Vagron",
            fill: "#ec8b78"
        }), errou = new Particles({
            x: 0,
            y: 0
        }, 120, tempLabel, rot);
        errou.maxScale = this.player.getContent().scale.x, errou.build(), errou.gravity = .1, 
        errou.alphadecress = .01, errou.scaledecress = .05, errou.setPosition(this.player.getPosition().x - tempLabel.width / 2, this.player.getPosition().y - 50), 
        this.layer.addChild(errou);
        var errou2 = new Particles({
            x: 0,
            y: 0
        }, 120, new PIXI.Text(wrongLabel, {
            font: "35px Vagron",
            fill: "#c01f2e"
        }), -rot);
        errou2.maxScale = this.player.getContent().scale.x, errou2.build(), errou2.gravity = .1, 
        errou2.alphadecress = .01, errou2.scaledecress = .05, errou2.setPosition(this.player.getPosition().x - tempLabel.width / 2 + 2, this.player.getPosition().y - 50 + 2), 
        this.layer.addChild(errou2), errou2.getContent().parent.setChildIndex(errou.getContent(), errou.getContent().parent.children.length - 1), 
        errou2.getContent().parent.setChildIndex(errou2.getContent(), errou2.getContent().parent.children.length - 1), 
        this.player.inError = !0, this.levelCounter -= .1 * this.levelCounterMax, this.levelCounter < 0 && (this.levelCounter = 0);
    },
    shoot: function(force) {
        if (this.player.inError) return void APP.audioController.playSound("error");
        this.startLevel = !0, this.player.jump(force), this.player.improveGravity(), this.force = 0, 
        TweenLite.to(this.loaderBar.getContent(), .2, {
            delay: .2,
            alpha: 1
        });
        var ls = Math.floor(4 * Math.random()) + 1;
        APP.audioController.playSound("laser" + ls), this.addCrazyMessage("HOLD");
    },
    reset: function() {
        this.destroy(), this.build();
    },
    update: function() {
        this.updateable && (this.player ? (this.player.inError || (this.tapDown && this.force < 30 && (this.force += .9, 
        this.player.charge(), clearInterval(this.holdInterval)), this.startLevel && (this.levelCounter--, 
        this.levelCounter < 0 && (this.levelCounter = 0))), this.player.force = this.force, 
        this.player.velocity.y < 0 ? this.interactiveBackground.gravity = Math.abs(this.player.velocity.y) / 15 : this.interactiveBackground.gravity = 0, 
        this.levelCounter <= 0 && this.gameOver(), this.loaderBar.updateBar(this.levelCounter, this.levelCounterMax)) : this.interactiveBackground.gravity = 1, 
        this.crazyLogo && this.crazyLogo.update(), this.base && (this.base.side || (this.base.side = 1), 
        this.base.alpha += .01 * this.base.side, (this.base.alpha > .5 || this.base.alpha <= .1) && (this.base.side *= -1)), 
        this._super());
    },
    gameOver: function() {
        if (this.endGame) return this.crazyContent.alpha = 0, this.coinsLabel.alpha = 0, 
        void (this.loaderBar.getContent().alpha = 0);
        window.navigator && navigator.vibrate(200), this.hitTouch.parent.removeChild(this.hitTouch), 
        setTimeout(function() {
            self.player.preKill();
        }, 100), this.targetJump.preKill(), this.base.parent.removeChild(this.base), this.earthquake(40), 
        this.endGame = !0, this.crazyContent.alpha = 0, this.coinsLabel.alpha = 0, this.loaderBar.getContent().alpha = 0, 
        this.interactiveBackground.accel = -5;
        var self = this;
        setTimeout(function() {
            self.openEndMenu(), APP.audioController.playSound("wub");
        }, 1e3);
    },
    openEndMenu: function() {
        var self = this;
        this.endMenuContainer = new PIXI.DisplayObjectContainer(), this.container.addChild(this.endMenuContainer), 
        this.crazyLogo = new CrazyLogo(this), this.crazyLogo.build(), this.crazyLogo.getContent().position.x = windowWidth / 2 - this.crazyLogo.getContent().width / 2, 
        this.crazyLogo.getContent().position.y = .1 * windowHeight, this.endMenuContainer.addChild(this.crazyLogo.getContent()), 
        this.inHigh = !1, APP.points > APP.highscore && (APP.cookieManager.setSafeCookie("highscore", APP.points), 
        APP.highscore = APP.points, this.inHigh = !0);
        var scoreContainer = null;
        if (this.fistTime) {
            scoreContainer = new PIXI.DisplayObjectContainer();
            var scoreBack = new PIXI.Graphics();
            scoreBack.beginFill(this.inHigh ? addBright(APP.vecColors[APP.currentColorID], .65) : 16777215), 
            scoreBack.drawRoundedRect(0, 0, 160, 250, 5), scoreContainer.addChild(scoreBack);
            var highscoreLabel1 = new PIXI.Text("NEW HIGHSCORE", {
                align: "center",
                font: "20px Vagron",
                fill: "#FFFFFF",
                wordWrap: !0,
                wordWrapWidth: 180
            });
            scoreContainer.addChild(highscoreLabel1), highscoreLabel1.resolution = retina, highscoreLabel1.alpha = 0, 
            highscoreLabel1.position.x = scoreBack.width / 2 - highscoreLabel1.width / 2 / highscoreLabel1.resolution, 
            highscoreLabel1.position.y = -highscoreLabel1.height / 2, this.inHigh && (highscoreLabel1.alpha = 1);
            var currentScoreTitle = new PIXI.Text("SCORE", {
                align: "center",
                font: "30px Vagron",
                fill: this.inHigh ? "#FFFFFF" : APP.vecColorsS[APP.currentColorID],
                wordWrap: !0,
                wordWrapWidth: 100
            });
            scoreContainer.addChild(currentScoreTitle), currentScoreTitle.resolution = retina, 
            currentScoreTitle.position.x = scoreBack.width / 2 - currentScoreTitle.width / 2 / currentScoreTitle.resolution, 
            currentScoreTitle.position.y = 10;
            var currentScore = new PIXI.Text(APP.points, {
                align: "center",
                font: "38px Vagron",
                fill: this.inHigh ? "#FFFFFF" : APP.vecColorsS[APP.currentColorID],
                wordWrap: !0,
                wordWrapWidth: 500
            });
            scoreContainer.addChild(currentScore), currentScore.resolution = retina, currentScore.position.x = scoreBack.width / 2 - currentScore.width / 2 / currentScore.resolution, 
            currentScore.position.y = currentScoreTitle.position.y + currentScoreTitle.height / currentScoreTitle.resolution - 10;
            var highscoreTitle = new PIXI.Text("BEST", {
                align: "center",
                font: "20px Vagron",
                fill: this.inHigh ? "#FFFFFF" : APP.vecColorsS[APP.currentColorID],
                wordWrap: !0,
                wordWrapWidth: 100
            });
            scoreContainer.addChild(highscoreTitle), highscoreTitle.resolution = retina, highscoreTitle.position.x = scoreBack.width / 2 - highscoreTitle.width / 2 / highscoreTitle.resolution, 
            highscoreTitle.position.y = currentScore.position.y + currentScore.height / currentScore.resolution;
            var highScoreLabel = new PIXI.Text(APP.highscore, {
                align: "center",
                font: "28px Vagron",
                fill: this.inHigh ? "#FFFFFF" : APP.vecColorsS[APP.currentColorID],
                wordWrap: !0,
                wordWrapWidth: 500
            });
            scoreContainer.addChild(highScoreLabel), highScoreLabel.resolution = retina, highScoreLabel.position.x = scoreBack.width / 2 - highScoreLabel.width / 2 / highScoreLabel.resolution, 
            highScoreLabel.position.y = highscoreTitle.position.y + highscoreTitle.height / highscoreTitle.resolution - 10, 
            scoreContainer.position.x = windowWidth / 2 - scoreBack.width / 2, scoreContainer.position.y = windowHeight / 2 - scoreBack.height / 2, 
            this.endMenuContainer.addChild(scoreContainer);
            var twContainer = new PIXI.DisplayObjectContainer(), twButton = new PIXI.Graphics();
            twButton.beginFill(4233727), twButton.drawRoundedRect(0, 0, 120, 30, 5);
            var twLabel = new PIXI.Text("Twitter", {
                align: "center",
                font: "20px Vagron",
                fill: "#FFFFFF",
                wordWrap: !0,
                wordWrapWidth: 500
            });
            twLabel.position.x = 29, twLabel.position.y = 3, twLabel.resolution = 2, twContainer.addChild(twButton), 
            twContainer.addChild(twLabel), scoreContainer.addChild(twContainer), twContainer.position.x = scoreBack.width / 2 - twButton.width / 2, 
            twContainer.position.y = 166, twContainer.interactive = !0, twContainer.buttonMode = !0, 
            twContainer.touchstart = twContainer.mousedown = function(mouseData) {};
            var fbContainer = new PIXI.DisplayObjectContainer(), fbButton = new PIXI.Graphics();
            fbButton.beginFill(3889560), fbButton.drawRoundedRect(0, 0, 120, 30, 5);
            var fbLabel = new PIXI.Text("Facebook", {
                align: "center",
                font: "20px Vagron",
                fill: "#FFFFFF",
                wordWrap: !0,
                wordWrapWidth: 500
            });
            fbLabel.position.x = 17, fbLabel.position.y = 3, fbLabel.resolution = 2, fbContainer.addChild(fbButton), 
            fbContainer.addChild(fbLabel), scoreContainer.addChild(fbContainer), fbContainer.position.x = scoreBack.width / 2 - fbButton.width / 2, 
            fbContainer.position.y = 204, fbContainer.interactive = !0, fbContainer.buttonMode = !0, 
            fbContainer.touchstart = fbContainer.mousedown = function(mouseData) {};
        }
        var playAgainContainer = new PIXI.DisplayObjectContainer(), playAgainButton = new PIXI.Graphics();
        playAgainButton.beginFill(16777215), playAgainButton.drawRoundedRect(0, 0, 100, 60, 5);
        var playAgainLabel = new PIXI.Text("PLAY", {
            align: "center",
            font: "30px Vagron",
            fill: APP.vecColorsS[APP.currentColorID],
            wordWrap: !0,
            wordWrapWidth: 500
        });
        playAgainLabel.position.x = 15, playAgainLabel.position.y = 10, playAgainLabel.resolution = 2, 
        playAgainContainer.addChild(playAgainButton), playAgainContainer.addChild(playAgainLabel), 
        this.endMenuContainer.addChild(playAgainContainer), playAgainContainer.position.x = windowWidth / 2 - playAgainButton.width / 2, 
        playAgainContainer.position.y = scoreContainer ? scoreContainer.position.y + scoreContainer.height + 20 : .8 * windowHeight - playAgainContainer.height, 
        playAgainContainer.interactive = !0, playAgainContainer.buttonMode = !0, playAgainContainer.touchstart = playAgainContainer.mousedown = function(mouseData) {
            TweenLite.to(self.endMenuContainer, 1, {
                x: windowWidth,
                y: -50,
                ease: "easeOutCubic",
                onComplete: function() {
                    self.reset();
                }
            }), self.crazyLogo.removeInterval(), self.interactiveBackground.accel = 5, TweenLite.to(self.interactiveBackground, 2, {
                accel: 0
            }), APP.audioController.playSound("play");
        }, TweenLite.from(this.crazyLogo.getContent(), 4.5, {
            x: 1.1 * windowWidth,
            y: this.crazyLogo.getContent().position.y - 50,
            ease: "easeOutElastic"
        }), TweenLite.from(this.endMenuContainer, 5, {
            x: 1.1 * windowWidth,
            y: this.endMenuContainer.position.y - 50,
            ease: "easeOutElastic"
        }), TweenLite.to(this.interactiveBackground, 2, {
            accel: 0
        });
    },
    addRegularLabel: function(label, font, initY) {
        var rot = .004 * Math.random(), tempLabel = new PIXI.Text(label, {
            font: font,
            fill: "#9d47e0"
        }), perfect = new Particles({
            x: 0,
            y: 0
        }, 120, tempLabel, rot);
        perfect.maxScale = this.player.getContent().scale.x, perfect.build(), perfect.gravity = -.2, 
        perfect.alphadecress = .01, perfect.scaledecress = .05, perfect.setPosition(this.player.getPosition().x - tempLabel.width / 2, initY ? initY : this.player.getPosition().y + 50), 
        this.layer.addChild(perfect);
        var perfect2 = new Particles({
            x: 0,
            y: 0
        }, 120, new PIXI.Text(label, {
            font: font,
            fill: "#13c2b6"
        }), -rot);
        perfect2.maxScale = this.player.getContent().scale.x, perfect2.build(), perfect2.gravity = -.2, 
        perfect2.alphadecress = .01, perfect2.scaledecress = .05, perfect2.setPosition(this.player.getPosition().x - tempLabel.width / 2 + 2, initY ? initY : this.player.getPosition().y + 50 + 2), 
        this.layer.addChild(perfect2);
    },
    getPerfect: function() {
        window.navigator && navigator.vibrate(200), APP.audioController.playSound("perfect"), 
        this.addRegularLabel(APP.vecPerfects[Math.floor(APP.vecPerfects.length * Math.random())], "50px Vagron");
        this.earthquake(40), this.levelCounter += .05 * this.levelCounterMax, this.levelCounter > this.levelCounterMax && (this.levelCounter = this.levelCounterMax);
    },
    getCoin: function(isPerfect) {
        this.levelCounter += .015 * this.levelCounterMax, this.levelCounter > this.levelCounterMax && (this.levelCounter = this.levelCounterMax), 
        this.targetJump.randomPos(.05 * windowHeight, .4 * windowHeight), this.updateCoins(), 
        this.targetJump.explode(), isPerfect || this.addRegularLabel(APP.vecGood[Math.floor(APP.vecGood.length * Math.random())], "30px Vagron"), 
        this.earthquake(20), this.changeColor();
    },
    changeColor: function(force, first, forceColor) {
        var tempColor = 0, self = this;
        first || (APP.currentColorID = forceColor ? APP.currentColorID : Math.floor(APP.vecColors.length * Math.random()));
        var temptempColor = APP.vecColors[APP.currentColorID];
        force ? (self.background.clear(), self.background.beginFill(temptempColor), self.background.drawRect(-80, -80, windowWidth + 160, windowHeight + 160)) : (forceColor && (APP.backColor = APP.vecColors[Math.floor(APP.vecColors.length * Math.random())]), 
        TweenLite.to(APP, .3, {
            backColor: temptempColor,
            onUpdate: function() {
                self.background.clear(), self.background.beginFill(APP.backColor), self.background.drawRect(-80, -80, windowWidth + 160, windowHeight + 160);
            }
        })), document.body.style.backgroundColor = APP.vecColorsS[APP.currentColorID], console.log(document.body.style.backgroundColor), 
        this.player && (tempColor = addBright(temptempColor, .65), this.player.setColor(tempColor), 
        this.loaderBar.setBackColor(tempColor));
    },
    earthquake: function(force) {
        var earth = new TimelineLite();
        earth.append(TweenLite.to(this.container, .2, {
            y: -Math.random() * force,
            x: Math.random() * force - force / 2
        })), earth.append(TweenLite.to(this.container, .2, {
            y: -Math.random() * force,
            x: Math.random() * force - force / 2
        })), earth.append(TweenLite.to(this.container, .2, {
            y: 0,
            x: 0
        }));
    },
    updateCoins: function() {
        if (this.coinsLabel.setText(APP.points), TweenLite.to(this.coinsLabel, .2, {
            alpha: .5
        }), this.coinsLabel.position.x = windowWidth / 2 - this.coinsLabel.width / 2 / this.coinsLabel.resolution, 
        this.coinsLabel.position.y = windowHeight / 2 - this.coinsLabel.height / 2 / this.coinsLabel.resolution, 
        this.background.parent && this.background.parent.setChildIndex(this.background, 0), 
        this.coinsLabel.parent.setChildIndex(this.coinsLabel, 1), !(this.coinsLabel.alpha < .5)) {
            var tempCoins = new PIXI.Text(APP.points, {
                align: "center",
                font: "72px Vagron",
                fill: "#FFFFFF",
                wordWrap: !0,
                wordWrapWidth: 500
            });
            tempCoins.anchor = {
                x: .5,
                y: .5
            }, tempCoins.resolution = retina;
            var particle = new Particles({
                x: 0,
                y: 0
            }, 120, tempCoins, 0);
            particle.maxScale = 5, particle.maxInitScale = 1, particle.build(), particle.alphadecress = .02, 
            particle.scaledecress = .02, particle.setPosition(this.coinsLabel.position.x + tempCoins.width / 2 / tempCoins.resolution, this.coinsLabel.position.y + tempCoins.height / 2 / tempCoins.resolution), 
            this.layer.addChild(particle);
        }
    },
    initLevel: function(whereInit) {
        APP.points = 0, this.player = new Ball({
            x: 0,
            y: 0
        }, this), this.player.build(), this.layer.addChild(this.player), this.player.getContent().position.x = windowWidth / 2, 
        this.player.getContent().position.y = windowHeight / 1.2;
        var baseFloor = windowHeight / 1.2;
        this.player.setFloor(baseFloor), this.base = new PIXI.Graphics(), this.base.beginFill(16777215), 
        this.base.drawCircle(0, 0, windowHeight - baseFloor), this.addChild(this.base), 
        this.base.alpha = .3, this.base.position.x = windowWidth / 2, this.base.position.y = windowHeight + this.player.spriteBall.height / 2, 
        this.targetJump = new Coin({
            x: 0,
            y: 0
        }), this.targetJump.build(), this.layer.addChild(this.targetJump), this.targetJump.getContent().position.x = windowWidth / 2, 
        this.targetJump.getContent().position.y = .2 * windowHeight, this.updateCoins();
        var self = this;
        this.addChild(self.hitTouch), TweenLite.from(this.layer.getContent().position, 3.5, {
            y: 50,
            x: -windowWidth / 2,
            ease: "easeOutElastic",
            onComplete: function() {
                self.addCrazyMessage("HOLD AND RELEASE");
            }
        }), TweenLite.from(this.base.position, 4, {
            y: this.base.position.y + 50,
            x: this.base.position.x - windowWidth / 2,
            ease: "easeOutElastic"
        }), TweenLite.from(this.coinsLabel.position, 4, {
            y: this.coinsLabel.position.y + 50,
            x: this.coinsLabel.position.x - windowWidth / 2,
            ease: "easeOutElastic",
            onComplete: function() {}
        }), this.holdIntervalCounter = 0, this.holdInterval = setInterval(function() {
            self.addRegularLabel("HOLD!", "50px Vagron", windowHeight / 2), self.holdIntervalCounter++, 
            self.holdIntervalCounter > 5 && clearInterval(self.holdInterval);
        }, 1e3), this.force = 0, this.levelCounter = 800, this.levelCounterMax = 800, this.changeColor(!0, !0), 
        this.endGame = !1, this.crazyLogo && (this.crazyLogo.updateable = !1);
    },
    transitionIn: function() {
        this.build();
    },
    transitionOut: function(nextScreen, container) {
        console.log("out");
        var self = this;
        this.frontShape ? (this.frontShape.parent.setChildIndex(this.frontShape, this.frontShape.parent.children.length - 1), 
        TweenLite.to(this.frontShape, .3, {
            alpha: 1,
            onComplete: function() {
                self.destroy(), container.removeChild(self.getContent()), nextScreen.transitionIn();
            }
        })) : (self.destroy(), container.removeChild(self.getContent()), nextScreen.transitionIn());
    }
}), LoadScreen = AbstractScreen.extend({
    init: function(label) {
        this._super(label), this.isLoaded = !1;
    },
    destroy: function() {
        this._super();
    },
    build: function() {
        this._super();
        var assetsToLoader = [];
        assetsToLoader.length > 0 && !this.isLoaded ? (this.loader = new PIXI.AssetLoader(assetsToLoader), 
        this.initLoad()) : this.onAssetsLoaded();
    },
    initLoad: function() {
        var barHeight = 20;
        this.loaderContainer = new PIXI.DisplayObjectContainer(), this.addChild(this.loaderContainer), 
        this.loaderBar = new LifeBarHUD(.6 * windowWidth, barHeight, 0, 16777215, addBright(APP.vecColors[APP.currentColorID], .65)), 
        this.loaderContainer.addChild(this.loaderBar.getContent()), this.loaderBar.getContent().position.x = windowWidth / 2 - this.loaderBar.getContent().width / 2, 
        this.loaderBar.getContent().position.y = windowHeight - this.loaderBar.getContent().height - .1 * windowHeight, 
        this.loaderBar.updateBar(0, 100), this._super();
        var text = new PIXI.Text("PLAY", {
            font: "50px Vagron",
            fill: "#FFFFFF"
        });
        this.addChild(text), text.alpha = 0;
    },
    onProgress: function() {
        this._super(), this.loaderBar.updateBar(Math.floor(100 * this.loadPercent), 100);
    },
    onAssetsLoaded: function() {
        var text = new PIXI.Text("PLAY", {
            font: "50px Vagron",
            fill: "#FFFFFF"
        });
        this.addChild(text), text.alpha = 0, this.ready = !0;
        var self = this;
        this.loaderBar ? TweenLite.to(this.loaderBar.getContent(), .5, {
            delay: .2,
            alpha: 0,
            onComplete: function() {
                self.initApplication();
            }
        }) : TweenLite.to(text, .5, {
            delay: .2,
            alpha: 0,
            onComplete: function() {
                self.initApplication();
            }
        });
    },
    initApplication: function() {
        this.isLoaded = !0;
        this.screenManager.change("Game");
    },
    transitionIn: function() {
        return this.isLoaded ? void this.build() : void this.build();
    },
    transitionOut: function(nextScreen, container) {
        var self = this;
        this.frontShape ? (this.frontShape.parent.setChildIndex(this.frontShape, this.frontShape.parent.children.length - 1), 
        TweenLite.to(this.frontShape, .3, {
            alpha: 1,
            onComplete: function() {
                self.destroy(), container.removeChild(self.getContent()), nextScreen.transitionIn();
            }
        })) : (self.destroy(), container.removeChild(self.getContent()), nextScreen.transitionIn());
    }
}), CreditsModal = Class.extend({
    init: function(screen) {
        this.screen = screen, this.container = new PIXI.DisplayObjectContainer();
        var self = this;
        this.container.buttonMode = !0, this.container.interactive = !0, this.container.mousedown = this.container.touchstart = function(data) {
            self.hide();
        };
        var credits = new SimpleSprite("dist/img/UI/creditos.jpg");
        this.container.addChild(credits.getContent()), scaleConverter(credits.getContent().height, windowHeight, 1, credits), 
        credits.getContent().position.x = windowWidth / 2 - credits.getContent().width / 2, 
        credits.getContent().position.y = windowHeight / 2 - credits.getContent().height / 2;
    },
    show: function(points) {
        this.screen.addChild(this), this.container.parent.setChildIndex(this.container, this.container.parent.children.length - 1);
        var self = this;
        this.screen.updateable = !1, this.container.alpha = 0, TweenLite.to(this.container, .5, {
            alpha: 1,
            onComplete: function() {
                self.container.buttonMode = !0, self.container.interactive = !0;
            }
        }), this.container.buttonMode = !1, this.container.interactive = !1;
    },
    hide: function(callback) {
        var self = this;
        this.container.buttonMode = !1, this.container.interactive = !1, TweenLite.to(this.container, .5, {
            alpha: 0,
            onComplete: function() {
                callback && (callback(), self.container.parent && self.container.parent.removeChild(self.container));
            }
        });
    },
    getContent: function() {
        return this.container;
    }
}), EndModal = Class.extend({
    init: function(screen) {
        this.screen = screen, this.container = new PIXI.DisplayObjectContainer(), this.boxContainer = new PIXI.DisplayObjectContainer(), 
        this.bg = new PIXI.Graphics(), this.bg.beginFill(14370108), this.bg.drawRect(0, 0, windowWidth, windowHeight), 
        this.bg.alpha = .8, this.container.addChild(this.boxContainer);
        var self = this;
        this.backBox = new PIXI.Graphics(), this.backBox.beginFill(14370108), this.backBox.drawRect(0, 0, windowWidth, windowHeight), 
        this.boxContainer.addChild(this.backBox), this.backBox.alpha = 0, this.gameOver = new PIXI.Text("GAME OVER", {
            font: "50px Vagron",
            fill: "#FFF"
        }), scaleConverter(this.gameOver.width, this.boxContainer.width, 1, this.gameOver), 
        this.gameOver.position.y = 0, this.boxContainer.addChild(this.gameOver), this.newHigh = new PIXI.Text("NEW HIGHSCORE", {
            font: "20px Vagron",
            fill: "#FFF"
        }), this.newHigh.position.y = this.gameOver.position.y + this.gameOver.height, this.newHigh.position.x = this.boxContainer.width / 2 - this.newHigh.width / 2, 
        this.boxContainer.addChild(this.newHigh), this.playedLabel = new PIXI.Text("GAMES PLAYED", {
            font: "20px Vagron",
            fill: "#FFF"
        }), this.playedLabel.position.y = this.newHigh.position.y + this.newHigh.height, 
        this.playedLabel.position.x = this.boxContainer.width / 2 - this.playedLabel.width / 2, 
        this.boxContainer.addChild(this.playedLabel), this.playedLabelValue = new PIXI.Text("0", {
            font: "30px Vagron",
            fill: "#FFF"
        }), this.playedLabelValue.position.y = this.playedLabel.position.y + this.playedLabel.height, 
        this.playedLabelValue.position.x = this.boxContainer.width / 2 - this.playedLabelValue.width / 2, 
        this.boxContainer.addChild(this.playedLabelValue), this.score = new PIXI.Text("SCORE", {
            font: "20px Vagron",
            fill: "#FFF"
        }), this.score.position.y = this.playedLabelValue.position.y + this.playedLabelValue.height, 
        this.score.position.x = this.boxContainer.width / 2 - this.score.width / 2, this.boxContainer.addChild(this.score), 
        this.scoreValue = new PIXI.Text("0", {
            font: "30px Vagron",
            fill: "#FFF"
        }), this.scoreValue.position.y = this.score.position.y + this.score.height, this.scoreValue.position.x = this.boxContainer.width / 2 - this.scoreValue.width / 2, 
        this.boxContainer.addChild(this.scoreValue), this.bestScore = new PIXI.Text("BEST SCORE", {
            font: "20px Vagron",
            fill: "#FFF"
        }), this.bestScore.position.y = this.scoreValue.position.y + this.scoreValue.height, 
        this.bestScore.position.x = this.boxContainer.width / 2 - this.bestScore.width / 2, 
        this.boxContainer.addChild(this.bestScore), this.bestScoreValue = new PIXI.Text("0", {
            font: "30px Vagron",
            fill: "#FFF"
        }), this.bestScoreValue.position.y = this.bestScore.position.y + this.bestScore.height, 
        this.bestScoreValue.position.x = this.boxContainer.width / 2 - this.bestScoreValue.width / 2, 
        this.boxContainer.addChild(this.bestScoreValue), this.replayButton = new DefaultButton("UI_button_default_1.png", "UI_button_default_1.png"), 
        this.replayButton.build(), this.replayButton.addLabel(new PIXI.Text("REPLAY", {
            font: "30px Vagron",
            fill: "#db453c"
        }), 25, 2), scaleConverter(this.replayButton.getContent().width, this.boxContainer.width, .5, this.replayButton), 
        this.replayButton.setPosition(this.boxContainer.width / 2 - this.replayButton.getContent().width / 2, this.bestScoreValue.position.y + this.bestScoreValue.height), 
        this.replayButton.clickCallback = function() {
            self.hide(function() {
                self.screen.updateable = !0, self.screen.startGame();
            });
        }, this.boxContainer.addChild(this.replayButton.getContent()), this.newSeed = new DefaultButton("UI_button_default_1.png", "UI_button_default_1.png"), 
        this.newSeed.build(), this.newSeed.addLabel(new PIXI.Text("NEW", {
            font: "30px Vagron",
            fill: "#db453c"
        }), 45, 2), scaleConverter(this.newSeed.getContent().width, this.boxContainer.width, .5, this.newSeed), 
        this.newSeed.setPosition(this.boxContainer.width / 2 - this.newSeed.getContent().width / 2, this.replayButton.getContent().position.y + this.replayButton.getContent().height + 20), 
        this.newSeed.clickCallback = function() {
            self.hide(function() {
                self.screen.updateable = !0, APP.seed.seed = 65535 * Math.random(), self.screen.startGame();
            });
        }, this.boxContainer.addChild(this.newSeed.getContent()), this.shopButton = new DefaultButton("UI_button_default_1.png", "UI_button_default_1.png"), 
        this.shopButton.build(), this.shopButton.addLabel(new PIXI.Text("SHOP", {
            font: "30px Vagron",
            fill: "#db453c"
        }), 45, 2), scaleConverter(this.shopButton.getContent().width, this.boxContainer.width, .5, this.shopButton), 
        this.shopButton.setPosition(this.boxContainer.width / 2 - this.shopButton.getContent().width / 2, this.newSeed.getContent().position.y + this.newSeed.getContent().height + 20), 
        this.shopButton.clickCallback = function() {
            self.screen.screenManager.change("Choice");
        }, this.boxContainer.addChild(this.shopButton.getContent()), this.shareButton = new DefaultButton("UI_button_default_1.png", "UI_button_default_1.png"), 
        this.shareButton.build(), this.shareButton.addLabel(new PIXI.Text("SHARE", {
            font: "30px Vagron",
            fill: "#db453c"
        }), 30, 2), scaleConverter(this.shareButton.getContent().width, this.boxContainer.width, .5, this.shareButton), 
        this.shareButton.setPosition(this.boxContainer.width / 2 - this.shareButton.getContent().width / 2, this.shopButton.getContent().position.y + this.shopButton.getContent().height + 20), 
        this.shareButton.clickCallback = function() {}, this.boxContainer.addChild(this.shareButton.getContent()), 
        this.rateButton = new DefaultButton("UI_button_default_1.png", "UI_button_default_1.png"), 
        this.rateButton.build(), this.rateButton.addLabel(new PIXI.Text("RATE", {
            font: "30px Vagron",
            fill: "#db453c"
        }), 45, 2), scaleConverter(this.rateButton.getContent().width, this.boxContainer.width, .5, this.rateButton), 
        this.rateButton.setPosition(this.boxContainer.width / 2 - this.rateButton.getContent().width / 2, this.shareButton.getContent().position.y + this.shareButton.getContent().height + 20), 
        this.rateButton.clickCallback = function() {}, this.boxContainer.addChild(this.rateButton.getContent()), 
        this.backBox.height = this.boxContainer.height, scaleConverter(this.boxContainer.height, windowHeight, .9, this.boxContainer);
    },
    show: function() {
        this.screen.addChild(this), this.screen.blockPause = !0, this.boxContainer.visible = !0, 
        this.container.parent.setChildIndex(this.container, this.container.parent.children.length - 1), 
        APP.highScore < APP.currentPoints ? (APP.highScore = APP.currentPoints, this.newHigh.alpha = 1) : this.newHigh.alpha = 0, 
        this.scoreValue.setText(APP.currentPoints), this.bestScoreValue.setText(APP.highScore), 
        this.playedLabelValue.setText(APP.plays), this.scoreValue.position.x = windowWidth / 2 - this.scoreValue.width / 2, 
        this.bestScoreValue.position.x = windowWidth / 2 - this.bestScoreValue.width / 2, 
        this.playedLabelValue.position.x = windowWidth / 2 - this.playedLabelValue.width / 2, 
        this.boxContainer.position.x = windowWidth / 2 - this.boxContainer.width / 2, this.boxContainer.position.y = windowHeight / 2 - this.boxContainer.height / 2, 
        this.bg.alpha = .8, this.boxContainer.alpha = 1, TweenLite.from(this.bg, .5, {
            alpha: 0
        }), TweenLite.from(this.boxContainer, .5, {
            y: -this.boxContainer.height
        }), console.log("show"), APP.appModel.saveScore();
    },
    hide: function(callback) {
        var self = this;
        this.screen.blockPause = !1, this.screen.updateable = !0, TweenLite.to(this.bg, .5, {
            delay: .1,
            alpha: 0,
            onComplete: function() {
                self.container.parent && self.container.parent.removeChild(self.container), callback && callback();
            }
        }), TweenLite.to(this.boxContainer.position, .5, {
            y: -this.boxContainer.height,
            ease: "easeInBack"
        }), TweenLite.to(this.boxContainer, .5, {
            alpha: 0
        }), TweenLite.to(this.bg, .5, {
            alpha: 0
        });
    },
    getContent: function() {
        return this.container;
    }
}), NewBirdModal = Class.extend({
    init: function(screen) {
        this.screen = screen, this.container = new PIXI.DisplayObjectContainer(), this.boxContainer = new PIXI.DisplayObjectContainer(), 
        this.bg = new PIXI.Graphics(), this.bg.beginFill(74275), this.bg.drawRect(0, 0, windowWidth, windowHeight), 
        this.bg.alpha = 0, this.container.addChild(this.bg), this.container.addChild(this.boxContainer);
        this.feito = new SimpleSprite("feitoo.png"), this.container.addChild(this.feito.getContent()), 
        scaleConverter(this.feito.getContent().width, windowWidth, .35, this.feito), this.feito.setPosition(windowWidth / 2 - this.feito.getContent().width / 2, -10), 
        this.boxContainer.alpha = 0, this.boxContainer.visible = !1, scaleConverter(this.boxContainer.height, windowHeight, .18, this.boxContainer), 
        this.boxContainer.position.x = windowWidth / 2 - this.boxContainer.width / 2, this.boxContainer.position.y = windowHeight;
    },
    show: function(bird) {
        if (bird || (bird = [ APP.getGameModel().birdModels[Math.floor(Math.random() * APP.getGameModel().birdModels.length)] ]), 
        bird && bird.length > 0) {
            var self = this;
            this.newCharContainer = new PIXI.DisplayObjectContainer();
            var pista = new SimpleSprite("pista.png"), holofote = new SimpleSprite("holofote.png"), novo = new SimpleSprite("nova_ave.png"), ovoquebrado = new SimpleSprite("ovoquebrado.png"), penas1 = new SimpleSprite("penasfundo1.png"), penas2 = new SimpleSprite("penasfundo2.png");
            this.playerImage = null, this.playerImage = new SimpleSprite(bird[0].cover);
            var degrade = new SimpleSprite("dist/img/UI/fundo_degrade.png");
            this.container.addChild(degrade.getContent()), degrade.getContent().width = windowWidth / 1.5;
            var sH = scaleConverter(degrade.getContent().height, windowHeight, 1);
            degrade.getContent().scale.y = sH, degrade.getContent().height = windowHeight, degrade.setPosition(windowWidth / 2 - degrade.getContent().width / 2, windowHeight / 2 - degrade.getContent().height / 2), 
            this.newCharContainer.addChild(pista.getContent()), pista.setPosition(0, holofote.getContent().height - 35), 
            this.newCharContainer.addChild(holofote.getContent()), this.newCharContainer.addChild(ovoquebrado.getContent()), 
            this.newCharContainer.addChild(penas1.getContent()), this.newCharContainer.addChild(penas2.getContent()), 
            this.container.addChild(this.playerImage.getContent()), this.newCharContainer.addChild(novo.getContent()), 
            holofote.setPosition(pista.getContent().width / 2 - holofote.getContent().width / 2, 0);
            var charLabel = new PIXI.Text(bird[0].label, {
                align: "center",
                fill: "#FFFFFF",
                stroke: "#033E43",
                strokeThickness: 5,
                font: "30px Luckiest Guy",
                wordWrap: !0,
                wordWrapWidth: 500
            });
            this.newCharContainer.addChild(charLabel), this.container.addChild(this.newCharContainer), 
            charLabel.position.x = pista.getContent().width / 2 - charLabel.width / 2, charLabel.position.y = pista.getContent().position.y + pista.getContent().height - charLabel.height - 20, 
            novo.setPosition(pista.getContent().width / 2 - novo.getContent().width / 2, charLabel.position.y - novo.getContent().height - 20), 
            scaleConverter(ovoquebrado.getContent().height, this.newCharContainer.height, .15, ovoquebrado), 
            scaleConverter(penas1.getContent().height, this.newCharContainer.height, .2, penas1), 
            scaleConverter(penas2.getContent().height, this.newCharContainer.height, .2, penas2), 
            penas1.setPosition(pista.getContent().width / 2 - 2 * penas1.getContent().width, holofote.getContent().height - penas1.getContent().height), 
            penas2.setPosition(pista.getContent().width / 2 + penas1.getContent().width, holofote.getContent().height - penas2.getContent().height), 
            ovoquebrado.setPosition(pista.getContent().width / 2 - ovoquebrado.getContent().width / 2, holofote.getContent().height - ovoquebrado.getContent().height), 
            scaleConverter(this.newCharContainer.height, windowHeight, 1, this.newCharContainer), 
            this.playerImage.setPosition(windowWidth / 2 - this.playerImage.getContent().width / 2, windowHeight / 2 - this.playerImage.getContent().height / 2 - 20), 
            this.newCharContainer.position.x = windowWidth / 2 - this.newCharContainer.width / 2, 
            this.feito.getContent().parent.setChildIndex(this.feito.getContent(), this.feito.getContent().parent.children.length - 1), 
            setTimeout(function() {
                self.container.buttonMode = !0, self.container.interactive = !0, self.container.mousedown = self.container.touchstart = function(data) {
                    self.hide(function() {
                        self.screen.updateable = !0;
                    });
                };
            }, 2e3);
        }
        this.screen.addChild(this), this.screen.updateable = !1, TweenLite.to(this.bg, .5, {
            alpha: .8
        }), this.container.parent.setChildIndex(this.container, this.container.parent.children.length - 1), 
        this.playerImage.getContent().parent.setChildIndex(this.playerImage.getContent(), this.playerImage.getContent().parent.children.length - 1);
    },
    hide: function(callback) {
        var self = this;
        TweenLite.to(this.bg, .5, {
            alpha: 0,
            onComplete: function() {
                callback && (callback(), self.container.parent && self.container.parent.removeChild(self.container));
            }
        }), TweenLite.to(this.boxContainer.position, 1, {
            y: -this.boxContainer.height,
            ease: "easeInBack"
        }), TweenLite.to(this.boxContainer, .5, {
            alpha: 0
        }), TweenLite.to(this.container, .5, {
            alpha: 0
        });
    },
    getContent: function() {
        return this.container;
    }
}), PauseModal = Class.extend({
    init: function(screen) {
        this.screen = screen, this.container = new PIXI.DisplayObjectContainer(), this.boxContainer = new PIXI.DisplayObjectContainer(), 
        this.bg = new PIXI.Graphics(), this.bg.beginFill(1383495), this.bg.drawRect(0, 0, windowWidth, windowHeight), 
        this.bg.alpha = .8, this.container.addChild(this.bg), this.container.addChild(this.boxContainer);
        var self = this;
        this.back = new SimpleSprite("UI_modal_back_1.png"), this.boxContainer.addChild(this.back.getContent());
        var thirdPart = this.back.getContent().width / 3;
        this.backButton = new DefaultButton("UI_button_play_1.png", "UI_button_play_1.png"), 
        this.backButton.build(), this.backButton.setPosition(1 * thirdPart - thirdPart / 2 - this.backButton.getContent().width / 2, this.back.getContent().height / 2 - this.backButton.getContent().height / 2), 
        this.backButton.clickCallback = function() {
            self.hide(function() {
                self.screen.screenManager.prevScreen();
            });
        }, this.back.getContent().addChild(this.backButton.getContent()), this.continueButton = new DefaultButton("UI_button_play_1_retina.png", "UI_button_play_1_over_retina.png"), 
        this.continueButton.build(), scaleConverter(this.continueButton.getContent().width, this.back.getContent().width, .3, this.continueButton), 
        this.continueButton.setPosition(2 * thirdPart - thirdPart / 2 - this.continueButton.getContent().width / 2, this.back.getContent().height / 2 - this.continueButton.getContent().height / 2), 
        this.continueButton.clickCallback = function() {
            self.hide(function() {
                self.screen.updateable = !0;
            });
        }, this.back.getContent().addChild(this.continueButton.getContent()), this.restartButton = new DefaultButton("UI_button_play_1.png", "UI_button_play_1.png"), 
        this.restartButton.build(), this.restartButton.setPosition(3 * thirdPart - thirdPart / 2 - this.restartButton.getContent().width / 2, this.back.getContent().height / 2 - this.restartButton.getContent().height / 2), 
        this.restartButton.clickCallback = function() {
            self.hide(function() {
                self.screen.updateable = !0, self.screen.reset();
            });
        }, this.back.getContent().addChild(this.restartButton.getContent()), scaleConverter(this.boxContainer.width, windowWidth, .8, this.boxContainer);
    },
    show: function() {
        this.screen.addChild(this), this.screen.blockPause = !0, this.boxContainer.visible = !0, 
        this.container.parent.setChildIndex(this.container, this.container.parent.children.length - 1), 
        this.screen.updateable = !1, this.boxContainer.position.x = windowWidth / 2 - this.boxContainer.width / 2, 
        this.boxContainer.position.y = windowHeight / 2 - this.boxContainer.height / 2, 
        this.bg.alpha = .8, this.boxContainer.alpha = 1, TweenLite.from(this.bg, .5, {
            alpha: 0
        }), TweenLite.from(this.boxContainer, .5, {
            y: -this.boxContainer.height
        });
    },
    hide: function(callback) {
        var self = this;
        this.screen.blockPause = !1, this.screen.updateable = !0, TweenLite.to(this.bg, .5, {
            delay: .1,
            alpha: 0,
            onComplete: function() {
                self.container.parent && self.container.parent.removeChild(self.container), callback && callback(), 
                self.kill = !0;
            }
        }), TweenLite.to(this.boxContainer.position, .5, {
            y: -this.boxContainer.height,
            ease: "easeInBack"
        }), TweenLite.to(this.boxContainer, .5, {
            alpha: 0
        });
    },
    getContent: function() {
        return this.container;
    }
}), RankinkgModal = Class.extend({
    init: function(screen) {
        this.screen = screen, this.container = new PIXI.DisplayObjectContainer();
        var self = this;
        this.container.buttonMode = !0, this.container.interactive = !0, this.container.mousedown = this.container.touchstart = function(data) {
            self.hide();
        };
        var credits = new SimpleSprite("dist/img/UI/creditos.jpg");
        this.container.addChild(credits.getContent()), scaleConverter(credits.getContent().height, windowHeight, 1, credits), 
        credits.getContent().position.x = windowWidth / 2 - credits.getContent().width / 2, 
        credits.getContent().position.y = windowHeight / 2 - credits.getContent().height / 2;
    },
    show: function(points) {
        this.screen.addChild(this), this.container.parent.setChildIndex(this.container, this.container.parent.children.length - 1);
        var self = this;
        this.screen.updateable = !1, this.container.alpha = 0, TweenLite.to(this.container, .5, {
            alpha: 1,
            onComplete: function() {
                self.container.buttonMode = !0, self.container.interactive = !0;
            }
        }), this.container.buttonMode = !1, this.container.interactive = !1;
    },
    hide: function(callback) {
        var self = this;
        this.container.buttonMode = !1, this.container.interactive = !1, TweenLite.to(this.container, .5, {
            alpha: 0,
            onComplete: function() {
                callback && (callback(), self.container.parent && self.container.parent.removeChild(self.container));
            }
        });
    },
    getContent: function() {
        return this.container;
    }
}), InputManager = Class.extend({
    init: function(parent) {
        var game = parent, self = this;
        this.vecPositions = [], document.body.addEventListener("mouseup", function(e) {
            game.player && (game.mouseDown = !1);
        }), document.body.addEventListener("mousedown", function(e) {
            game.player && APP.getMousePos().x < windowWidth && APP.getMousePos().y < windowHeight - 70 && (game.mouseDown = !0);
        }), document.body.addEventListener("keyup", function(e) {
            if (game.player) {
                if (87 === e.keyCode || 38 === e.keyCode && game.player.velocity.y < 0) self.removePosition("up"); else if (83 === e.keyCode || 40 === e.keyCode && game.player.velocity.y > 0) self.removePosition("down"); else if (65 === e.keyCode || 37 === e.keyCode && game.player.velocity.x < 0) self.removePosition("left"); else if (68 === e.keyCode || 39 === e.keyCode && game.player.velocity.x > 0) self.removePosition("right"); else if (32 === e.keyCode) game.player.hurt(5); else if (49 === e.keyCode || 50 === e.keyCode || 51 === e.keyCode || 52 === e.keyCode || 81 === e.keyCode || 69 === e.keyCode) {
                    var id = 1;
                    50 === e.keyCode ? id = 2 : 51 === e.keyCode ? id = 3 : 52 === e.keyCode && (id = 4), 
                    game.useShortcut(id - 1);
                }
                game.player.updatePlayerVel(self.vecPositions);
            }
        }), document.body.addEventListener("keydown", function(e) {
            game.player && (87 === e.keyCode || 38 === e.keyCode ? (self.removePosition("down"), 
            self.addPosition("up")) : 83 === e.keyCode || 40 === e.keyCode ? (self.removePosition("up"), 
            self.addPosition("down")) : 65 === e.keyCode || 37 === e.keyCode ? (self.removePosition("right"), 
            self.addPosition("left")) : (68 === e.keyCode || 39 === e.keyCode) && (self.removePosition("left"), 
            self.addPosition("right")), game.player.updatePlayerVel(self.vecPositions));
        });
    },
    removePosition: function(position) {
        for (var i = this.vecPositions.length - 1; i >= 0; i--) this.vecPositions[i] === position && this.vecPositions.splice(i, 1);
    },
    addPosition: function(position) {
        for (var exists = !1, i = this.vecPositions.length - 1; i >= 0; i--) this.vecPositions[i] === position && (exists = !0);
        exists || this.vecPositions.push(position);
    }
}), CookieManager = Class.extend({
    init: function() {
        function getLocalStorage() {
            try {
                if (window.localStorage) return window.localStorage;
            } catch (e) {
                return void 0;
            }
        }
        this.db = getLocalStorage();
    },
    setCookie: function(cname, cvalue, exdays) {
        var d = new Date(), days = exdays ? exdays : 5e4;
        d.setTime(d.getTime() + 24 * days * 60 * 60 * 1e3);
        "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + days;
    },
    getCookie: function(name) {
        return (name = new RegExp("(?:^|;\\s*)" + ("" + name).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") + "=([^;]*)").exec(document.cookie)) && name[1];
    },
    setSafeCookie: function(key, value) {
        window.localStorage.setItem(key, value);
    },
    getSafeCookie: function(key, callback) {
        var value = window.localStorage.getItem(key);
        return value;
    }
}), Environment = Class.extend({
    init: function(maxWidth, maxHeight) {
        this.velocity = {
            x: 0,
            y: 0
        }, this.texture = "", this.sprite = "", this.container = new PIXI.DisplayObjectContainer(), 
        this.updateable = !0, this.arraySprt = [], this.maxWidth = maxWidth, this.maxHeight = maxHeight, 
        this.texWidth = 0, this.spacing = 0, this.totTiles = 0, this.currentSprId = 0;
    },
    build: function(imgs, spacing) {
        this.arraySprt = imgs, spacing && (this.spacing = spacing);
        for (var i = Math.floor(this.arraySprt.length * Math.random()); i < this.arraySprt.length && !(this.container.width > this.maxWidth); i++) this.currentSprId = i, 
        this.addEnv();
    },
    addEnv: function() {
        this.sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(this.arraySprt[this.currentSprId])), 
        this.sprite.cacheAsBitmap = !0;
        var last = this.container.children[this.container.children.length - 1];
        last && (this.sprite.position.x = last.position.x + last.width - 2), this.sprite.position.y = this.maxHeight - this.sprite.height, 
        this.container.addChild(this.sprite);
    },
    update: function() {
        if (this.container.children) {
            for (var i = this.container.children.length - 1; i >= 0; i--) this.container.children[i].position.x + this.container.children[i].width < 0 && this.container.removeChild(this.container.children[i]), 
            this.container.children[i].position.x += this.velocity.x;
            var last = this.container.children[this.container.children.length - 1];
            last.position.x + last.width - 20 < this.maxWidth && (this.currentSprId++, this.currentSprId >= this.arraySprt.length && (this.currentSprId = 0), 
            this.addEnv());
        }
    },
    getContent: function() {
        return this.container;
    }
}), Paralax = Class.extend({
    init: function(maxWidth) {
        this.velocity = {
            x: 0,
            y: 0
        }, this.texture = "", this.sprite = "", this.container = new PIXI.DisplayObjectContainer(), 
        this.updateable = !0, this.arraySprt = [], this.maxWidth = maxWidth, this.texWidth = 0, 
        this.spacing = 0, this.totTiles = 0;
    },
    build: function(img, spacing) {
        spacing && (this.spacing = spacing), this.texture = PIXI.Texture.fromFrame(img), 
        this.texWidth = this.texture.width, this.totTiles = Math.ceil(this.maxWidth / this.texWidth) + 1;
        for (var i = 0; i < this.totTiles; i++) this.sprite = new PIXI.Sprite(this.texture), 
        this.sprite.position.x = (this.texWidth + this.spacing) * i, this.container.addChild(this.sprite);
        console.log("this");
    },
    update: function() {
        Math.abs(this.container.position.x + this.velocity.x) >= this.texWidth + this.totTiles * this.spacing ? this.container.position.x = 0 : this.container.position.x += this.velocity.x, 
        this.container.position.y += this.velocity.y;
    },
    getContent: function() {
        return this.container;
    }
}), Particles = Entity.extend({
    init: function(vel, timeLive, source, rotation) {
        this._super(!0), this.updateable = !1, this.colidable = !1, this.deading = !1, this.range = 40, 
        this.width = 1, this.height = 1, this.type = "particle", this.target = "enemy", 
        this.fireType = "physical", this.node = null, this.velocity.x = vel.x, this.velocity.y = vel.y, 
        this.timeLive = timeLive, this.power = 1, this.defaultVelocity = 1, this.imgSource = source, 
        this.alphadecress = .03, this.scaledecress = .03, this.gravity = 0, rotation && (this.rotation = rotation), 
        this.maxScale = 1, this.growType = 1, this.maxInitScale = 1, this.initScale = 1;
    },
    build: function() {
        this.updateable = !0, this.imgSource instanceof PIXI.Text || this.imgSource instanceof PIXI.Graphics ? this.sprite = this.imgSource : (this.sprite = new PIXI.Sprite.fromFrame(this.imgSource), 
        this.sprite.anchor.x = .5, this.sprite.anchor.y = .5), this.sprite.alpha = 1, this.sprite.scale.x = this.initScale, 
        this.sprite.scale.y = this.initScale, -1 === this.growType && (this.sprite.scale.x = this.maxScale, 
        this.sprite.scale.y = this.maxScale), this.getContent().rotation = this.rotation;
    },
    update: function() {
        this._super(), 0 !== this.gravity && (this.velocity.y += this.gravity), this.timeLive--, 
        this.timeLive <= 0 && this.preKill(), this.range = this.width, this.rotation && (this.getContent().rotation += this.rotation), 
        this.sprite.alpha > 0 && (this.sprite.alpha -= this.alphadecress, this.sprite.alpha <= 0 && this.preKill()), 
        this.sprite.scale.x < 0 && this.preKill(), this.sprite.scale.x > this.maxScale || (this.sprite.scale.x += this.scaledecress, 
        this.sprite.scale.y += this.scaledecress);
    },
    preKill: function() {
        this.sprite.alpha = 0, this.updateable = !0, this.kill = !0;
    }
}), res = {
    x: window.outerWidth,
    y: window.outerHeight
}, resizeProportional = !0, windowWidth = res.x, windowHeight = res.y, realWindowWidth = res.x, realWindowHeight = res.y, gameScale = 1, screenOrientation = "portait", windowWidthVar = window.innerWidth, windowHeightVar = window.innerHeight, gameView = document.getElementById("game");

testMobile() || (document.body.className = ""), console.log(gameView);

var ratio = 1, init = !1, renderer, APP, retina = window.devicePixelRatio >= 2 ? 2 : 1, initialize = function() {
    PIXI.BaseTexture.SCALE_MODE = PIXI.scaleModes.NEAREST, requestAnimFrame(update);
}, isfull = !1;

window.console.log = function() {};

var apps = -1 === document.URL.indexOf("http://") && -1 === document.URL.indexOf("https://");

apps ? document.addEventListener("deviceready", deviceReady) : (res = {
    x: window.innerWidth,
    y: window.innerHeight
}, deviceReady());