+ function() {
    if (typeof Object.assign != 'function') {
        Object.assign = function(target, varArgs) { // .length of function is 2
            'use strict';
            if (target == null) { // TypeError if undefined or null
                throw new TypeError('Cannot convert undefined or null to object');
            }
            var to = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];
                if (nextSource != null) { // Skip over if undefined or null
                    for (var nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        };
    }
    var context;
    var AudioContext = {
        getContext: function() {
            if (context === undefined) {
                context = new(window.AudioContext || window.webkitAudioContext)();
            }
            return context;
        },
        setContext: function(value) {
            context = value;
        }
    };
    function AudioAnalyser(audio, fftSize) {
        alert(audio.context.createAnalyser)
        this.analyser = audio.context.createAnalyser();
        this.analyser.fftSize = fftSize !== undefined ? fftSize : 2048;
        this.data = new Uint8Array(this.analyser.frequencyBinCount);
        audio.source.connect(this.analyser);
        this.analyser.connect(audio.getOutput());
    }
    Object.assign(AudioAnalyser.prototype, {
        getFrequencyData: function() {
            this.analyser.getByteFrequencyData(this.data);
            return this.data;
        },
        getAverageFrequency: function() {
            var value = 0,
                data = this.getFrequencyData();
            for (var i = 0; i < data.length; i++) {
                value += data[i];
            }
            return value / data.length;
        }
    });
    function Audio() {
        this.type = 'Audio';
        this.context = AudioContext.getContext();
        this.autoplay = false;
        this.buffer = null;
        this.loop = false;
        this.startTime = 0;
        this.playbackRate = 1;
        this.isPlaying = false;
        this.hasPlaybackControl = true;
        this.sourceType = 'empty';
        this.filters = [];
    }
    Audio.prototype = Object.assign({}, {
        constructor: Audio,
        getOutput: function() {
            return this.context.destination;
        },
        setNodeSource: function(audioNode) {
            this.hasPlaybackControl = false;
            this.sourceType = 'audioNode';
            this.source = audioNode;
            this.connect();
            return this;
        },
        setBuffer: function(audioBuffer) {
            this.buffer = audioBuffer;
            this.sourceType = 'buffer';
            if (this.autoplay) this.play();
            return this;
        },
        play: function() {
            if (this.isPlaying === true) {
                console.warn('THREE.Audio: Audio is already playing.');
                return;
            }
            if (this.hasPlaybackControl === false) {
                console.warn('THREE.Audio: this Audio has no playback control.');
                return;
            }
            var source = this.context.createBufferSource();
            source.buffer = this.buffer;
            source.loop = this.loop;
            source.onended = this.onEnded.bind(this);
            source.start ? source.start(0, this.startTime) : source.noteGrainOn(0, this.startTime);
            this.isPlaying = true;
            this.source = source;
            return this.connect();
        },
        pause: function() {
            if (this.hasPlaybackControl === false) {
                console.warn('THREE.Audio: this Audio has no playback control.');
                return;
            }
            this.source.stop();
            this.startTime = this.context.currentTime;
            this.isPlaying = false;
            return this;
        },
        stop: function() {
            if (this.hasPlaybackControl === false) {
                console.warn('THREE.Audio: this Audio has no playback control.');
                return;
            }
            this.source.stop();
            this.startTime = 0;
            this.isPlaying = false;
            return this;
        },
        connect: function() {
            this.source.connect(this.getOutput());
            return this;
        },
        disconnect: function() {
            this.source.disconnect(this.getOutput());
            return this;
        },
        onEnded: function() {
            this.isPlaying = false;
        },
        getLoop: function() {
            if (this.hasPlaybackControl === false) {
                console.warn('THREE.Audio: this Audio has no playback control.');
                return false;
            }
            return this.loop;
        },
        setLoop: function(value) {
            if (this.hasPlaybackControl === false) {
                console.warn('THREE.Audio: this Audio has no playback control.');
                return;
            }
            this.loop = value;
            if (this.isPlaying === true) {
                this.source.loop = this.loop;
            }
            return this;
        }
    });
    var Cache = {
        enabled: false,
        files: {},
        add: function(key, file) {
            if (this.enabled === false) return;
            // console.log( 'THREE.Cache', 'Adding key:', key );
            this.files[key] = file;
        },
        get: function(key) {
            if (this.enabled === false) return;
            // console.log( 'THREE.Cache', 'Checking key:', key );
            return this.files[key];
        },
        remove: function(key) {
            delete this.files[key];
        },
        clear: function() {
            this.files = {};
        }
    };
    function LoadingManager(onLoad, onProgress, onError) {
        var scope = this;
        var isLoading = false,
            itemsLoaded = 0,
            itemsTotal = 0;
        this.onStart = undefined;
        this.onLoad = onLoad;
        this.onProgress = onProgress;
        this.onError = onError;
        this.itemStart = function(url) {
            itemsTotal++;
            if (isLoading === false) {
                if (scope.onStart !== undefined) {
                    scope.onStart(url, itemsLoaded, itemsTotal);
                }
            }
            isLoading = true;
        };
        this.itemEnd = function(url) {
            itemsLoaded++;
            if (scope.onProgress !== undefined) {
                scope.onProgress(url, itemsLoaded, itemsTotal);
            }
            if (itemsLoaded === itemsTotal) {
                isLoading = false;
                if (scope.onLoad !== undefined) {
                    scope.onLoad();
                }
            }
        };
        this.itemError = function(url) {
            if (scope.onError !== undefined) {
                scope.onError(url);
            }
        };
    }
    var DefaultLoadingManager = new LoadingManager();
    function FileLoader(manager) {
        this.manager = (manager !== undefined) ? manager : DefaultLoadingManager;
    }
    Object.assign(FileLoader.prototype, {
        load: function(url, onLoad, onProgress, onError) {
            if (url === undefined) url = '';
            if (this.path !== undefined) url = this.path + url;
            var scope = this;
            var cached = Cache.get(url);
            if (cached !== undefined) {
                scope.manager.itemStart(url);
                setTimeout(function() {
                    if (onLoad) onLoad(cached);
                    scope.manager.itemEnd(url);
                }, 0);
                return cached;
            }
            // Check for data: URI
            var dataUriRegex = /^data:(.*?)(;base64)?,(.*)$/;
            var dataUriRegexResult = url.match(dataUriRegex);
            // Safari can not handle Data URIs through XMLHttpRequest so process manually
            if (dataUriRegexResult) {
                var mimeType = dataUriRegexResult[1];
                var isBase64 = !!dataUriRegexResult[2];
                var data = dataUriRegexResult[3];
                data = window.decodeURIComponent(data);
                if (isBase64) data = window.atob(data);
                try {
                    var response;
                    var responseType = (this.responseType || '').toLowerCase();
                    switch (responseType) {
                        case 'arraybuffer':
                        case 'blob':
                            response = new ArrayBuffer(data.length);
                            var view = new Uint8Array(response);
                            for (var i = 0; i < data.length; i++) {
                                view[i] = data.charCodeAt(i);
                            }
                            if (responseType === 'blob') {
                                response = new Blob([response], {
                                    type: mimeType
                                });
                            }
                            break;
                        case 'document':
                            var parser = new DOMParser();
                            response = parser.parseFromString(data, mimeType);
                            break;
                        case 'json':
                            response = JSON.parse(data);
                            break;
                        default: // 'text' or other
                            response = data;
                            break;
                    }
                    // Wait for next browser tick
                    window.setTimeout(function() {
                        if (onLoad) onLoad(response);
                        scope.manager.itemEnd(url);
                    }, 0);
                } catch (error) {
                    // Wait for next browser tick
                    window.setTimeout(function() {
                        if (onError) onError(error);
                        scope.manager.itemError(url);
                    }, 0);
                }
            } else {
                var request = new XMLHttpRequest();
                request.open('GET', url, true);
                request.addEventListener('load', function(event) {
                    var response = event.target.response;
                    Cache.add(url, response);
                    if (this.status === 200) {
                        if (onLoad) onLoad(response);
                        scope.manager.itemEnd(url);
                    } else if (this.status === 0) {
                        // Some browsers return HTTP Status 0 when using non-http protocol
                        // e.g. 'file://' or 'data://'. Handle as success.
                        console.warn('THREE.FileLoader: HTTP Status 0 received.');
                        if (onLoad) onLoad(response);
                        scope.manager.itemEnd(url);
                    } else {
                        if (onError) onError(event);
                        scope.manager.itemError(url);
                    }
                }, false);
                if (onProgress !== undefined) {
                    request.addEventListener('progress', function(event) {
                        onProgress(event);
                    }, false);
                }
                request.addEventListener('error', function(event) {
                    if (onError) onError(event);
                    scope.manager.itemError(url);
                }, false);
                if (this.responseType !== undefined) request.responseType = this.responseType;
                if (this.withCredentials !== undefined) request.withCredentials = this.withCredentials;
                if (request.overrideMimeType) request.overrideMimeType(this.mimeType !== undefined ? this.mimeType : 'text/plain');
                request.send(null);
            }
            scope.manager.itemStart(url);
            return request;
        },
        setPath: function(value) {
            this.path = value;
            return this;
        },
        setResponseType: function(value) {
            this.responseType = value;
            return this;
        },
        setWithCredentials: function(value) {
            this.withCredentials = value;
            return this;
        },
        setMimeType: function(value) {
            this.mimeType = value;
            return this;
        }
    });
    function AudioLoader(manager) {
        this.manager = (manager !== undefined) ? manager : DefaultLoadingManager;
    }
    Object.assign(AudioLoader.prototype, {
        load: function(url, onLoad, onProgress, onError) {
            var loader = new FileLoader(this.manager);
            loader.setResponseType('arraybuffer');
            loader.load(url, function(buffer) {
                var context = AudioContext.getContext();
                context.decodeAudioData(buffer, function(audioBuffer) {
                    onLoad(audioBuffer);
                });
            }, onProgress, onError);
        }
    });
    window.WA = {
        AudioLoader: AudioLoader,
        Audio: Audio,
        AudioAnalyser: AudioAnalyser
    }
}()
