! function(e) {
    "use strict";

    function t(e) {
        return "function" == typeof e || "object" === ("undefined" == typeof e ? "undefined" : J(e)) && null !== e
    }

    function n(e) {
        return "function" == typeof e
    }

    function i(e) { se = e }

    function r(e) { oe = e }

    function s() {
        return function() {
            return process.nextTick(f)
        }
    }

    function o() {
        return "undefined" != typeof re ? function() { re(f) } : c()
    }

    function a() {
        var e = 0,
            t = new ce(f),
            n = document.createTextNode("");
        return t.observe(n, { characterData: !0 }),
            function() { n.data = e = ++e % 2 }
    }

    function u() {
        var e = new MessageChannel;
        return e.port1.onmessage = f,
            function() {
                return e.port2.postMessage(0)
            }
    }

    function c() {
        var e = setTimeout;
        return function() {
            return e(f, 1)
        }
    }

    function f() {
        for (var e = 0; ie > e; e += 2) {
            var t = he[e],
                n = he[e + 1];
            t(n), he[e] = void 0, he[e + 1] = void 0
        }
        ie = 0
    }

    function l() {
        try {
            var e = require,
                t = e("vertx");
            return re = t.runOnLoop || t.runOnContext, o()
        } catch (n) {
            return c()
        }
    }

    function h(e, t) {
        var n = arguments,
            i = this,
            r = new this.constructor(v);
        void 0 === r[ve] && O(r);
        var s = i._state;
        return s ? ! function() {
            var e = n[s - 1];
            oe(function() {
                return A(s, r, e, i._result)
            })
        }() : T(i, r, e, t), r
    }

    function d(e) {
        var t = this;
        if (e && "object" === ("undefined" == typeof e ? "undefined" : J(e)) && e.constructor === t) return e;
        var n = new t(v);
        return k(n, e), n
    }

    function v() {}

    function p() {
        return new TypeError("You cannot resolve a promise with itself")
    }

    function m() {
        return new TypeError("A promises callback cannot return that same promise.")
    }

    function y(e) {
        try {
            return e.then
        } catch (t) {
            return ge.error = t, ge
        }
    }

    function g(e, t, n, i) {
        try { e.call(t, n, i) } catch (r) {
            return r
        }
    }

    function _(e, t, n) {
        oe(function(e) {
            var i = !1,
                r = g(n, t, function(n) { i || (i = !0, t !== n ? k(e, n) : E(e, n)) }, function(t) { i || (i = !0, M(e, t)) }, "Settle: " + (e._label || " unknown promise"));
            !i && r && (i = !0, M(e, r))
        }, e)
    }

    function b(e, t) {
        t._state === me ? E(e, t._result) : t._state === ye ? M(e, t._result) : T(t, void 0, function(t) {
            return k(e, t)
        }, function(t) {
            return M(e, t)
        })
    }

    function w(e, t, i) { t.constructor === e.constructor && i === h && t.constructor.resolve === d ? b(e, t) : i === ge ? (M(e, ge.error), ge.error = null) : void 0 === i ? E(e, t) : n(i) ? _(e, t, i) : E(e, t) }

    function k(e, n) { e === n ? M(e, p()) : t(n) ? w(e, n, y(n)) : E(e, n) }

    function x(e) { e._onerror && e._onerror(e._result), L(e) }

    function E(e, t) { e._state === pe && (e._result = t, e._state = me, 0 !== e._subscribers.length && oe(L, e)) }

    function M(e, t) { e._state === pe && (e._state = ye, e._result = t, oe(x, e)) }

    function T(e, t, n, i) {
        var r = e._subscribers,
            s = r.length;
        e._onerror = null, r[s] = t, r[s + me] = n, r[s + ye] = i, 0 === s && e._state && oe(L, e)
    }

    function L(e) {
        var t = e._subscribers,
            n = e._state;
        if (0 !== t.length) {
            for (var i = void 0, r = void 0, s = e._result, o = 0; o < t.length; o += 3) i = t[o], r = t[o + n], i ? A(n, i, r, s) : r(s);
            e._subscribers.length = 0
        }
    }

    function S() { this.error = null }

    function C(e, t) {
        try {
            return e(t)
        } catch (n) {
            return _e.error = n, _e
        }
    }

    function A(e, t, i, r) {
        var s = n(i),
            o = void 0,
            a = void 0,
            u = void 0,
            c = void 0;
        if (s) {
            if (o = C(i, r), o === _e ? (c = !0, a = o.error, o.error = null) : u = !0, t === o) return void M(t, m())
        } else o = r, u = !0;
        t._state !== pe || (s && u ? k(t, o) : c ? M(t, a) : e === me ? E(t, o) : e === ye && M(t, o))
    }

    function P(e, t) {
        try { t(function(t) { k(e, t) }, function(t) { M(e, t) }) } catch (n) { M(e, n) }
    }

    function R() {
        return be++
    }

    function O(e) { e[ve] = be++, e._state = void 0, e._result = void 0, e._subscribers = [] }

    function B(e, t) { this._instanceConstructor = e, this.promise = new e(v), this.promise[ve] || O(this.promise), ne(t) ? (this._input = t, this.length = t.length, this._remaining = t.length, this._result = new Array(this.length), 0 === this.length ? E(this.promise, this._result) : (this.length = this.length || 0, this._enumerate(), 0 === this._remaining && E(this.promise, this._result))) : M(this.promise, I()) }

    function I() {
        return new Error("Array Methods must be provided an Array")
    }

    function U(e) {
        return new B(this, e).promise
    }

    function j(e) {
        var t = this;
        return new t(ne(e) ? function(n, i) {
            for (var r = e.length, s = 0; r > s; s++) t.resolve(e[s]).then(n, i)
        } : function(e, t) {
            return t(new TypeError("You must pass an array to race."))
        })
    }

    function z(e) {
        var t = this,
            n = new t(v);
        return M(n, e), n
    }

    function N() {
        throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")
    }

    function F() {
        throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")
    }

    function D(e) { this[ve] = R(), this._result = this._state = void 0, this._subscribers = [], v !== e && ("function" != typeof e && N(), this instanceof D ? P(this, e) : F()) }

    function H() {
        var e = void 0;
        if ("undefined" != typeof global) e = global;
        else if ("undefined" != typeof self) e = self;
        else try { e = Function("return this")() } catch (t) {
            throw new Error("polyfill failed because global object is unavailable in this environment")
        }
        var n = e.Promise;
        if (n) {
            var i = null;
            try { i = Object.prototype.toString.call(n.resolve()) } catch (t) {}
            if ("[object Promise]" === i && !n.cast) return
        }
        e.Promise = D
    }

    function W() {
        var e, t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
            n = t.responseType,
            i = void 0 === n ? "arraybuffer" : n,
            r = r || self,
            s = void 0 !== importScripts,
            o = function() {
                var e = null;
                if (void 0 != r.XMLHttpRequest) e = new XMLHttpRequest;
                else try { e = new ActiveXObject("MSXML2.XMLHTTP") } catch (t) {
                    try { e = new ActiveXObject("Microsoft.XMLHTTP") } catch (t) { e = null }
                }
                return e
            };
        return s ? (r = self, e = o(), self.onmessage = function(t) {
            (t.data || t.data.src) && (e = o(), e.responseType = i, e.onerror = function(e) { self.postMessage({ type: "error", data: e.toString() }) }, e.onload = function(t) { self.postMessage(e.status < 400 ? { type: "success", data: e.response } : { type: "error", data: t.toString() }) }, e.onprogress = function(e) { self.postMessage({ type: "progress", data: { loaded: e.loaded, total: e.total } }) }, e.open(t.data.method, t.data.src, !0), e.send(t.data.formData))
        }, void 0) : e
    }

    function X(e) {
        for (var t = new ArrayBuffer(e.length), n = new Uint8Array(t), i = 0, r = e.length; r > i; i++) n[i] = 255 & e.charCodeAt(i);
        return t
    }

    function q() {
        var e = this;
        if (this._list.length > 0) {
            var t = this._list.shift();
            setTimeout(function() { V.bind(e)(t) }, 50), this._currentCount++
        } else this.dispatchEvent(new Ge("complete"))
    }

    function G(e) {
        var t = this,
            n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : function() {};
        if (e.length > 0) {
            var i = e.shift();
            i.isFile ? i.execute(this.factory, function() { G.bind(t)(e, n) }) : G.bind(this)(e, n)
        } else n()
    }

    function V(e) {
        var t, n = this,
            i = new Ye(e),
            r = this,
            s = document.createElement("a");
        s.href = e.src, Ne.file[e.id ? e.id : s.pathname] = e, i.on("complete", function(i) {
            if (t = new Ge("fileload"), void 0 !== e.id ? n._item[e.id] = e : n._item[e.src] = e, e.isZip) {
                var o = new ze;
                o.parse(i.data), e.response = i.data, e.file = o, o.decompress(function() {
                    t.item = e;
                    var i = o.files.concat();
                    G.bind(r)(i, function() { Ne.zip[e.id ? e.id : s.pathname] = o, n.dispatchEvent(t), q.bind(n)() })
                })
            } else e.response = i.data, t.item = e, n.factory.execute(e, function() { r.dispatchEvent(t), setTimeout(function() { q.bind(r)() }, 100) })
        }), i.on("progress", function(e) {
            var i = (n._currentCount - 1 + e.loaded / e.total) / n._count;
            t = new Ge("progress"), t.progress = i, n.dispatchEvent(t)
        }), i.on("error", function(i) { t = new Ge("error"), t.item = e, t.progress = i.toString(), n.dispatchEvent(t) })
    }
    var Z = function() {
            var e = document.createElement("canvas"),
                t = e.getContext("2d"),
                n = window.devicePixelRatio || 1,
                i = t.webkitBackingStorePixelRatio || t.mozBackingStorePixelRatio || t.msBackingStorePixelRatio || t.oBackingStorePixelRatio || t.backingStorePixelRatio || 1,
                r = n / i;
            return r
        },
        J = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        } : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        },
        Y = function(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        },
        K = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var i = t[n];
                    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
                }
            }
            return function(t, n, i) {
                return n && e(t.prototype, n), i && e(t, i), t
            }
        }(),
        $ = function vt(e, t, n) {
            null === e && (e = Function.prototype);
            var i = Object.getOwnPropertyDescriptor(e, t);
            if (void 0 === i) {
                var r = Object.getPrototypeOf(e);
                return null === r ? void 0 : vt(r, t, n)
            }
            if ("value" in i) return i.value;
            var s = i.get;
            return void 0 === s ? void 0 : s.call(n)
        },
        Q = function(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, { constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 } }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        },
        ee = function(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        },
        te = void 0;
    te = Array.isArray ? Array.isArray : function(e) {
        return "[object Array]" === Object.prototype.toString.call(e)
    };
    var ne = te,
        ie = 0,
        re = void 0,
        se = void 0,
        oe = function(e, t) { he[ie] = e, he[ie + 1] = t, ie += 2, 2 === ie && (se ? se(f) : de()) },
        ae = "undefined" != typeof window ? window : void 0,
        ue = ae || {},
        ce = ue.MutationObserver || ue.WebKitMutationObserver,
        fe = "undefined" == typeof self && "undefined" != typeof process && "[object process]" === {}.toString.call(process),
        le = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel,
        he = new Array(1e3),
        de = void 0;
    de = fe ? s() : ce ? a() : le ? u() : void 0 === ae && "function" == typeof require ? l() : c();
    var ve = Math.random().toString(36).substring(16),
        pe = void 0,
        me = 1,
        ye = 2,
        ge = new S,
        _e = new S,
        be = 0;
    B.prototype._enumerate = function() {
        for (var e = this.length, t = this._input, n = 0; this._state === pe && e > n; n++) this._eachEntry(t[n], n)
    }, B.prototype._eachEntry = function(e, t) {
        var n = this._instanceConstructor,
            i = n.resolve;
        if (i === d) {
            var r = y(e);
            if (r === h && e._state !== pe) this._settledAt(e._state, t, e._result);
            else if ("function" != typeof r) this._remaining--, this._result[t] = e;
            else if (n === D) {
                var s = new n(v);
                w(s, e, r), this._willSettleAt(s, t)
            } else this._willSettleAt(new n(function(t) {
                return t(e)
            }), t)
        } else this._willSettleAt(i(e), t)
    }, B.prototype._settledAt = function(e, t, n) {
        var i = this.promise;
        i._state === pe && (this._remaining--, e === ye ? M(i, n) : this._result[t] = n), 0 === this._remaining && E(i, this._result)
    }, B.prototype._willSettleAt = function(e, t) {
        var n = this;
        T(e, void 0, function(e) {
            return n._settledAt(me, t, e)
        }, function(e) {
            return n._settledAt(ye, t, e)
        })
    }, D.all = U, D.race = j, D.resolve = d, D.reject = z, D._setScheduler = i, D._setAsap = r, D._asap = oe, D.prototype = {
        constructor: D,
        then: h,
        "catch": function(e) {
            return this.then(null, e)
        }
    }, D.polyfill = H, D.Promise = D, window.Promise = window.Promise || D, window.URL = window.URL || window.webkitURL, "URL" in window == "undefined" && (window.URL = {}, window.URL.createObjectURL = function() {}), window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
    var we, ke = function(e, t) {
            var n;
            try { n = new Blob([e], { type: t }) } catch (i) {
                if ("TypeError" == i.name && BlobBuilder) {
                    var r = new BlobBuilder;
                    if ("string" == typeof e) var s = e;
                    else {
                        e instanceof ArrayBuffer && (e = new DataView(e));
                        var s = e.buffer
                    }
                    r.append(s), n = r.getBlob(t)
                }
            }
            return n
        },
        xe = function(e, t, n) {
            t = void 0 === t ? 0 : t, n = void 0 === n ? e.byteLength : n;
            var i = new Uint8Array(e, t, n),
                r = String.fromCharCode.apply(null, i);
            return r
        },
        Ee = /\/?[^\/]+\.(\w{1,5})$/i,
        Me = /^(?:\w+:)?\/{2}/i,
        Te = /^[.\/]*?\//i,
        Le = /[^\/\\\\]+$/,
        Se = function(e) {
            var t = { absolute: !1, relative: !1 };
            if (null == e) return t;
            var n = e.indexOf("?");
            n > -1 && (e = e.substr(0, n));
            var i;
            return Me.test(e) ? t.absolute = !0 : Te.test(e) && (t.relative = !0), (i = e.match(Ee)) && (t.extension = i[1].toLowerCase()), (i = e.match(Le)) && (t.name = i[0].split(".")[0]), t
        },
        Ce = function(e, t, n) {
            for (var i = e.properties.manifest, r = 0; r < i.length; r++) {
                var s = i[r]; - 1 != s.src.indexOf("?") && (s.src = s.src.split("?")[0]);
                var o = n.getFile(s.src);
                o && (t[s.id] = o.file)
            }
        },
        Ae = function(e, t) {
            var n = { images: [e[t.name]], frames: t.frames };
            return new createjs.SpriteSheet(n)
        },
        Pe = function(e) {
            for (var t, n = 0; n < e.files.length; n++) e.files[n].isMain && (t = e.files[n]);
            for (var n = 0; n < e.files.length; n++) {
                var i = e.files[n];
                "json" == i.type && t && i.file.images && i.file.images.length > 0 && i.file.frames && Oe(i.name, i.file, e, t.file.ss)
            }
        },
        Re = function(e) {
            return void 0 === e._instance && (e._instance = null), e.getInstance = function() {
                return null === e._instance ? e._instance = new e : e._instance
            }, e
        },
        Oe = function(e, t, n, i) {
            if (t && t.images) {
                for (var r = 0; r < t.images.length; r++) {
                    var s = t.images[r];
                    if ("string" != typeof s) return; - 1 != s.indexOf("?") && (s = s.split("?")[0]), s = n.getFile(s), t.images[r] = s.file
                }
                var o = e.split(".")[0];
                return i[o] = new createjs.SpriteSheet(t), i[o]
            }
        },
        Be = { toSpriteMetadata: Ae, createSingleton: Re, getDevicePixelRatio: Z, createSprite: Oe, toSpriteSheet: Pe, toManifest: Ce, byteToString: xe, createBlob: ke, EXTENSION_PATT: Ee, parseURI: Se, ABSOLUTE_PATT: Me, RELATIVE_PATT: Te },
        Ie = function() {
            function e() { Y(this, e) }
            return K(e, [{
                key: "execute",
                value: function(e) {
                    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : function() {};
                    if (e) {
                        var n = this;
                        e.execute(this, function(e) { n._file = e, t() })
                    }
                }
            }, {
                key: "type",
                set: function(e) { this._type = e },
                get: function() {
                    return this._type
                }
            }, {
                key: "name",
                set: function(e) { this._name = e },
                get: function() {
                    return this._name
                }
            }, {
                key: "nativePath",
                set: function(e) {
                    this._nativePath = e;
                    var t = Se(this.nativePath);
                    t && t.extension && (this._isFile = !0, this.name = t.name, this.type = t.extension)
                },
                get: function() {
                    return this._nativePath
                }
            }, {
                key: "zip",
                set: function(e) { this._zip = e },
                get: function() {
                    return this._zip
                }
            }, {
                key: "isFile",
                get: function() {
                    return this._isFile
                }
            }, {
                key: "isCompressed",
                set: function(e) { this._isCompressed = e },
                get: function() {
                    return this._isCompressed
                }
            }, {
                key: "buffer",
                set: function(e) { this._buffer = e },
                get: function() {
                    return this._buffer
                }
            }, {
                key: "file",
                get: function() {
                    return this._file
                },
                set: function(e) { this._file = e }
            }, {
                key: "size",
                get: function() {
                    return this.buffer ? 0 : void 0
                }
            }]), e
        }();
    we = function() {
        function e(e) {
            var t, n, i, r, s, o, a, u, c, f, l, h = e.length,
                d = 0,
                v = Number.POSITIVE_INFINITY;
            for (u = 0, c = h; c > u; ++u) e[u] > d && (d = e[u]), e[u] < v && (v = e[u]);
            for (t = 1 << d, n = new Uint32Array(t), i = 1, r = 0, s = 2; d >= i;) {
                for (u = 0; h > u; ++u)
                    if (e[u] === i) {
                        for (o = 0, a = r, f = 0; i > f; ++f) o = o << 1 | 1 & a, a >>= 1;
                        for (l = i << 16 | u, f = o; t > f; f += s) n[f] = l;
                        ++r
                    }++i, r <<= 1, s <<= 1
            }
            return [n, d, v]
        }

        function t(e, t) {
            switch (this.blocks = [], this.bufferSize = n, this.totalpos = 0, this.ip = 0, this.bitsbuf = 0, this.bitsbuflen = 0, this.input = new Uint8Array(e), this.output, this.op, this.bfinal = !1, this.bufferType = r, this.resize = !1, this.prev, (t || !(t = {})) && (t.index && (this.ip = t.index), t.bufferSize && (this.bufferSize = t.bufferSize), t.bufferType && (this.bufferType = t.bufferType), t.resize && (this.resize = t.resize)), this.bufferType) {
                case i:
                    this.op = s, this.output = new Uint8Array(s + this.bufferSize + o);
                    break;
                case r:
                    this.op = 0, this.output = new Uint8Array(this.bufferSize), this.expandBuffer = this.expandBufferAdaptive, this.concatBuffer = this.concatBufferDynamic, this.decodeHuffman = this.decodeHuffmanAdaptive;
                    break;
                default:
                    throw new Error("invalid inflate mode")
            }
        }
        var n = 32768,
            i = 0,
            r = 1,
            s = 32768,
            o = 258,
            a = new Uint16Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]),
            u = new Uint16Array([3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 258, 258]),
            c = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0]),
            f = new Uint16Array([1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577]),
            l = new Uint8Array([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]),
            h = function(e) {
                return e
            }(function() {
                var t, n, i = new Uint8Array(288);
                for (t = 0, n = i.length; n > t; ++t) i[t] = 143 >= t ? 8 : 255 >= t ? 9 : 279 >= t ? 7 : 8;
                return e(i)
            }()),
            d = function(e) {
                return e
            }(function() {
                var t, n, i = new Uint8Array(30);
                for (t = 0, n = i.length; n > t; ++t) i[t] = 5;
                return e(i)
            }()),
            v = t.prototype;
        return v.concatBufferDynamic = function() {
            var e, t = this.op;
            return this.resize ? (e = new Uint8Array(t), e.set(this.output.subarray(0, t))) : e = this.output.subarray(0, t), this.buffer = e, this.buffer
        }, v.decodeHuffmanAdaptive = function(e, t) {
            var n = this.output,
                i = this.op;
            this.currentLitlenTable = e;
            for (var r, s, o, a, h = n.length; 256 !== (r = this.readCodeByTable(e));)
                if (256 > r) i >= h && (n = this.expandBuffer(), h = n.length), n[i++] = r;
                else
                    for (s = r - 257, a = u[s], c[s] > 0 && (a += this.readBits(c[s])), r = this.readCodeByTable(t), o = f[r], l[r] > 0 && (o += this.readBits(l[r])), i + a > h && (n = this.expandBuffer(), h = n.length); a--;) n[i] = n[i++ - o];
            for (; this.bitsbuflen >= 8;) this.bitsbuflen -= 8, this.ip--;
            this.op = i
        }, v.readCodeByTable = function(e) {
            for (var t, n, i = this.bitsbuf, r = this.bitsbuflen, s = this.input, o = this.ip, a = s.length, u = e[0], c = e[1]; c > r && !(o >= a);) i |= s[o++] << r, r += 8;
            return t = u[i & (1 << c) - 1], n = t >>> 16, this.bitsbuf = i >> n, this.bitsbuflen = r - n, this.ip = o, 65535 & t
        }, v.expandBufferAdaptive = function(e) {
            var t, n, i, r, s = this.input.length / this.ip + 1 | 0,
                o = this.input,
                a = this.output;
            return e && ("number" == typeof e.fixRatio && (s = e.fixRatio), "number" == typeof e.addRatio && (s += e.addRatio)), 2 > s ? (n = (o.length - this.ip) / this.currentLitlenTable[2], r = n / 2 * 258 | 0, i = r < a.length ? a.length + r : a.length << 1) : i = a.length * s, t = new Uint8Array(i), t.set(a), this.output = t, this.output
        }, v.parseUncompressedBlock = function() {
            var e, t, n, s = this.input,
                o = this.ip,
                a = this.output,
                u = this.op,
                c = s.length,
                f = a.length;
            if (this.bitsbuf = 0, this.bitsbuflen = 0, o + 1 >= c) throw new Error("invalid uncompressed block header: LEN");
            if (e = s[o++] | s[o++] << 8, o + 1 >= c) throw new Error("invalid uncompressed block header: NLEN");
            if (t = s[o++] | s[o++] << 8, e === ~t) throw new Error("invalid uncompressed block header: length verify");
            if (o + e > s.length) throw new Error("input buffer is broken");
            switch (this.bufferType) {
                case i:
                    for (; u + e > a.length;) n = f - u, e -= n, a.set(s.subarray(o, o + n), u), u += n, o += n, this.op = u, a = this.expandBuffer(), u = this.op;
                    break;
                case r:
                    for (; u + e > a.length;) a = this.expandBuffer({ fixRatio: 2 });
                    break;
                default:
                    throw new Error("invalid inflate mode")
            }
            a.set(s.subarray(o, o + e), u), u += e, o += e, this.ip = o, this.op = u, this.output = a
        }, v.readBits = function(e) {
            for (var t, n = this.bitsbuf, i = this.bitsbuflen, r = this.input, s = this.ip, o = r.length; e > i;) {
                if (s >= o) throw new Error("input buffer is broken");
                n |= r[s++] << i, i += 8
            }
            return t = n & (1 << e) - 1, n >>>= e, i -= e, this.bitsbuf = n, this.bitsbuflen = i, this.ip = s, t
        }, v.parseBlock = function() {
            var e = this.readBits(3);
            switch (1 & e && (this.bfinal = !0), e >>>= 1) {
                case 0:
                    this.parseUncompressedBlock();
                    break;
                case 1:
                    this.parseFixedHuffmanBlock();
                    break;
                case 2:
                    this.parseDynamicHuffmanBlock();
                    break;
                default:
                    throw new Error("unknown BTYPE: " + e)
            }
            return this.bfinal
        }, v.parseDynamicHuffmanBlock = function() {
            function t(e, t, n) {
                var i, r, s, o = this.prev;
                for (s = 0; e > s;) switch (i = this.readCodeByTable(t)) {
                    case 16:
                        for (r = 3 + this.readBits(2); r--;) n[s++] = o;
                        break;
                    case 17:
                        for (r = 3 + this.readBits(3); r--;) n[s++] = 0;
                        o = 0;
                        break;
                    case 18:
                        for (r = 11 + this.readBits(7); r--;) n[s++] = 0;
                        o = 0;
                        break;
                    default:
                        n[s++] = i, o = i
                }
                return this.prev = o, n
            }
            var n, i, r, s, o = this.readBits(5) + 257,
                u = this.readBits(5) + 1,
                c = this.readBits(4) + 4,
                f = new Uint8Array(a.length);
            for (s = 0; c > s; ++s) f[a[s]] = this.readBits(3);
            n = e(f), i = new Uint8Array(o), r = new Uint8Array(u), this.prev = 0, this.decodeHuffman(e(t.call(this, o, n, i)), e(t.call(this, u, n, r)))
        }, v.parseFixedHuffmanBlock = function() { this.decodeHuffman(h, d) }, v.decompress = function() {
            for (; !this.bfinal;) this.parseBlock();
            return this.concatBuffer()
        }, v.decompressAnyc = function(e, t) {
            var n = this,
                i = setInterval(function() {
                    var t = n.parseBlock();
                    t && (clearInterval(i), e && e.apply(self, [n.concatBuffer()]))
                }, t)
        }, t
    };
    var Ue = function() {
        function e() {
            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                n = t.run,
                i = void 0 === n ? function() { close() } : n,
                r = t.result,
                s = void 0 === r ? function() {} : r,
                o = t.method,
                a = void 0 === o ? "" : o;
            Y(this, e), this._run = i, this._result = s, this._method = a, this._init()
        }
        return K(e, [{ key: "_runProxy", value: function() { self.onmessage = function(e) { run.apply(self, e.data) } } }, {
            key: "_reusltProxy",
            value: function() {
                for (var e = arguments.length, t = Array(e), n = 0; e > n; n++) t[n] = arguments[n];
                self.postMessage(t)
            }
        }, { key: "_init", value: function() { this._messageEvent = this._onMessage.bind(this), this._errorEvent = this._onError.bind(this), this._closeEvent = this._onClose.bind(this), this._isRun = !1 } }, {
            key: "_getMethod",
            value: function() {
                var e = document.createElement("a");
                e.href = window.location.href;
                var t = e.protocol + "//" + e.host + e.pathname;
                t = t.slice(0, t.lastIndexOf("/"));
                var n = "var PATH='" + t + "'\nvar ___close__ = close;\nvar close = function(){\nresult('___exit___')\n___close__();\n};\n" + this._method + "\nvar run = " + this._run.toLocaleString() + "\n\nvar _runProxy=" + this._runProxy.toLocaleString() + "\nvar _reusltProxy=" + this._reusltProxy.toLocaleString() + "\nvar result = _reusltProxy;\n_runProxy();\n";
                return n
            }
        }, { key: "_onClose", value: function() {} }, { key: "_onError", value: function() { this.worker.dispatchEvent(new Event("close")) } }, { key: "_onMessage", value: function(e) { "___exit___" != e.data ? this._result.apply(this, e.data) : (this._isRun = !1, this.worker.dispatchEvent(new Event("close")), this.stop()) } }, {
            key: "start",
            value: function() {
                if (!this._isRun) {
                    this._isRun = !0, e.addThread(this), this._worker = new Worker(URL.createObjectURL(ke(this._getMethod())));
                    for (var t = arguments.length, n = Array(t), i = 0; t > i; i++) n[i] = arguments[i];
                    this._worker.postMessage(n), this._worker.addEventListener("message", this._messageEvent), this._worker.addEventListener("error", this._errorEvent), this._worker.addEventListener("close", this._closeEvent)
                }
            }
        }, { key: "stop", value: function() { this._worker && (this._worker.terminate(), this._worker.removeEventListener("message", this._messageEvent), this._worker.removeEventListener("error", this._errorEvent), this._worker.removeEventListener("close", this._closeEvent), this._worker = null), e.removeThread(this), this._isRun = !1 } }, {
            key: "worker",
            get: function() {
                return this._worker
            }
        }, {
            key: "isRun",
            get: function() {
                return this._isRun
            }
        }], [{
            key: "createThread",
            value: function(t) {
                return new e(t)
            }
        }, {
            key: "run",
            value: function(e) {
                function t() {
                    return e.apply(this, arguments)
                }
                return t.toString = function() {
                    return e.toString()
                }, t
            }(function(t) {
                var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : function() {},
                    i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "",
                    r = new Promise(function(r) {
                        var s = new e({
                            run: n,
                            result: function() {
                                for (var e = arguments.length, t = Array(e), n = 0; e > n; n++) t[n] = arguments[n];
                                r(1 == t.length ? t[0] : t), s.stop()
                            },
                            method: i
                        });
                        s.close = function() { r() }, t instanceof Array ? s.start.apply(s, t) : s.start(t)
                    });
                return r
            })
        }]), e
    }();
    Ue.ThreadList = [], Ue.addThread = function(e) { Ue.ThreadList.push(e) }, Ue.removeAllThread = function() {
        for (; Ue.ThreadList.length;) Ue.ThreadList[0].stop()
    }, Ue.removeThread = function(e) {
        var t = Ue.ThreadList.indexOf(e); - 1 != t && Ue.ThreadList.splice(t, 1)[0].stop()
    };
    var je = 67324752,
        ze = function() {
            function e() { Y(this, e), this._files = [], this._workerCount = 50 }
            return K(e, [{
                key: "parse",
                value: function(e) {
                    for (var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, n = new DataView(e); n.getUint32(t, !0) == je;) {
                        var i = new Ie;
                        i.zip = this, t += 6;
                        var r = 1 == n.getUint16(t, !0);
                        t += 2;
                        var s = 0 != n.getUint16(t, !0);
                        t += 10;
                        var o = n.getUint32(t, !0);
                        t += 4;
                        var a = n.getUint32(t, !0);
                        t += 4;
                        var u = n.getInt16(t, !0);
                        t += 2;
                        var c = n.getUint16(t, !0);
                        t += 2, i.nativePath = xe(n.buffer, t, u), t += u + c, i.isCompressed = s;
                        var f = s ? o : a;
                        i.buffer = n.buffer.slice(t, t + f), t += f, r && (t += 12), this._files.push(i)
                    }
                }
            }, {
                key: "getFile",
                value: function(e) {
                    for (var t = 0; t < this.files.length; t++)
                        if (this.files[t].nativePath == e) return this.files[t]
                }
            }, {
                key: "_createWoker",
                value: function(e) {
                    var t = "var RawInflates= " + we.toString() + "\n",
                        n = new Promise(function(n, i) {
                            Ue.run(e.buffer, function(e) {
                                var t = new(this.RawInflates())(e, { index: 0, bufferSize: e.byteLength, resize: !0 }),
                                    n = t.decompress();
                                result(n)
                            }, t).then(function(t) { e.isCompressed = !1, e.buffer = t, n(e) })["catch"](i)
                        });
                    return n
                }
            }, {
                key: "_wokerDecompress",
                value: function(e, t) {
                    var n = this;
                    if (e.length) {
                        for (var i = this._workerCount, r = 0, s = 0; s < e.length; s++)
                            if (i > s) {
                                var o = e.shift();
                                r++, this._createWoker(o).then(function() { r--, n._currentCount++, 0 == r && n._wokerDecompress(e, t) })["catch"](function() { r--, n._currentCount++, 0 == r && n._wokerDecompress(e, t) })
                            }
                    } else this._count == this._currentCount && t()
                }
            }, {
                key: "decompress",
                value: function() {
                    for (var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : function() {}, t = [], n = 0, i = [], r = 0; r < this.files.length; r++) {
                        var s = this.files[r];
                        s.isCompressed ? t.push(s) : (i.push(1), n++)
                    }
                    this._count = t.length, this._currentCount = 0, this._wokerDecompress(t, e)
                }
            }, {
                key: "files",
                get: function() {
                    return this._files
                }
            }]), e
        }(),
        Ne = {};
    Ne.stage = {}, Ne.zip = {}, Ne.file = {};
    var Fe = /\(\s*function\s*\((\s*\w*,\s*)*\s*\w*\s*\)\s*\{\s*[\s\S]*?\}\s*\)\s*\((\s*\w*\s*=\s*\w*\s*\|\|\s*\{\s*\}\s*,)*\s*\w*\s*=\s*\w*\s*\|\|\s*\{\s*\}\s*\)/gim,
        De = function(e) {
            for (var t = void 0, n = 0; n < He.list.length; n++)
                if (t = He.list[n], e.toLowerCase() == t.type) return t
        },
        He = function() {
            function e() { Y(this, e) }
            return K(e, null, [{
                key: "addFactory",
                value: function(t) {
                    var n = t.type,
                        i = t.name,
                        r = t.execute;
                    n && i && r && (e.removeFactory(n), e.__LIST__.push({ type: n, name: i, execute: r }))
                }
            }, {
                key: "removeFactory",
                value: function(t) {
                    for (var n = 0; n < e.__LIST__.length; n++)
                        if (e.__LIST__[n].type == t) return void e.__LIST__.splice(n, 1)
                }
            }, {
                key: "execute",
                value: function(t) {
                    var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : function() {},
                        i = De(t.type || "txt");
                    t.isMain && (i = e.list[0]), i ? i.execute(t, i, function(e) { t.file = e, n(e) }) : n()
                }
            }, {
                key: "cateateText",
                value: function(e) {
                    var t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : function() {},
                        n = ke(e.buffer || e.response, "application/javascript"),
                        i = new FileReader;
                    i.onload = function() {
                        try { t(this.result) } catch (e) { t() }
                    }, i.readAsText(n)
                }
            }, {
                key: "createCreatejs",
                value: function(t, n) {
                    var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : function() {},
                        r = ke(t.buffer || t.response, "text/html"),
                        s = new FileReader;
                    s.onload = function() {
                        try {
                            var r = this.result;
                            if (!Fe.test(r)) return void e.createJS(t, n, i);
                            var s = /lib.properties\s.*[\s\S]*\};/gm;
                            if (!s.test(r)) return void e.createJS(t, n, i);
                            r = r.match(Fe)[0], t.isStage = !0, r = r.replace(/\(.*\w*\s*\w*\|\|\{\}\)/gim, "");
                            var o = t.name.split(".")[0],
                                a = "!function(){var stage = TGMG.Assest.stage['" + o + "'] = {libs:{},images:{},ss:{}};\n stage.initialize = function (value,libs,images,ss){stage.libs = libs||stage.libs\nstage.images = images||stage.images\nstage.ss = ss||stage.ss\n\nreturn " + r + "(stage.libs,stage.images,value,stage.ss);\n};\nstage.setManifest = function (zip){\nif(stage.libs.properties.manifest && stage.libs.properties.manifest.length >0)\n{\n TGMG.utils.toManifest(stage.libs,stage.images,zip)\n}\n};stage.getStage= function()\n{ return stage.libs['" + o + "']\n\n};\nstage.main ='" + o + "';\n}();",
                                u = document.createElement("script");
                            u.charset = "utf-8", u.src = URL.createObjectURL(ke(a, "text/html")), u.onload = function() { t.file = Ne.stage[o], i(t.file) };
                            var c = document.head || document.getElementsByTagName("head")[0];
                            c.appendChild(u), setTimeout(function() { c.removeChild(u) }, 100)
                        } catch (f) { i() }
                    }, s.readAsText(r)
                }
            }, {
                key: "createImage",
                value: function(e, t) {
                    var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : function() {},
                        i = URL.createObjectURL(ke(e.buffer || e.response, t.name + "/" + t.type)),
                        r = new Image;
                    r.src = i, r.onload = function() { n(r) }, r.onerror = function() { n(r) }
                }
            }, {
                key: "createJSON",
                value: function(e) {
                    var t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : function() {},
                        n = ke(e.buffer || e.response, "application/javascript"),
                        i = new FileReader;
                    i.onload = function() {
                        try { t(JSON.parse(this.result)) } catch (e) { t("") }
                    }, i.readAsText(n)
                }
            }, {
                key: "createAudio",
                value: function(e) {
                    var t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : function() {},
                        n = ke(e.buffer || e.response, "mp3/audio"),
                        i = document.createElement("audio");
                    i.autoplay = !1, i.preload = "auto", i.src = URL.createObjectURL(n), t(i)
                }
            }, {
                key: "createJS",
                value: function(e) {
                    var t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : function() {},
                        n = URL.createObjectURL(ke(e.buffer || e.response, "text/html")),
                        i = document.createElement("script");
                    i.charset = e.charset || "utf-8", i.src = n, i.onload = function() { t(i), URL.revokeObjectURL(n) }, i.onerror = function() { t(i), URL.revokeObjectURL(n) };
                    var r = document.head || document.getElementsByTagName("head")[0];
                    r.appendChild(i), r.removeChild(i)
                }
            }, {
                key: "list",
                get: function() {
                    return e.__LIST__
                }
            }]), e
        }();
    He.__LIST__ = [{ type: "main", name: "application", execute: He.createCreatejs }, { type: "jpg", name: "image", execute: He.createImage }, { type: "png", name: "image", execute: He.createImage }, { type: "js", name: "script", execute: He.createCreatejs }, { type: "json", name: "application", execute: He.createJSON }, { type: "txt", name: "text", execute: He.cateateText }, { type: "mp3", name: "audio", execute: He.createAudio }];
    var We = { strictMode: !1, key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"], q: { name: "queryKey", parser: /(?:^|&)([^&=]*)=?([^&]*)/g }, parser: { strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/, loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ } },
        Xe = function() {
            function e() { Y(this, e) }
            return K(e, null, [{
                key: "parser",
                value: function(e) {
                    for (var t = We, n = t.parser[t.strictMode ? "strict" : "loose"].exec(e), i = {}, r = 14; r--;) i[t.key[r]] = n[r] || "";
                    return i[t.q.name] = {}, i[t.key[12]].replace(t.q.parser, function(e, n, r) { n && (i[t.q.name][n] = r) }), i
                }
            }]), e
        }(),
        qe = function() {
            function e() {
                var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                    n = t.charset,
                    i = void 0 === n ? "utf-8" : n,
                    r = t.src,
                    s = t.isWorker,
                    o = void 0 === s ? !1 : s,
                    a = t.type,
                    u = t.id,
                    c = t.isZip,
                    f = void 0 === c ? !1 : c,
                    l = t.responseType,
                    h = void 0 === l ? "arraybuffer" : l,
                    d = t.formData,
                    v = void 0 === d ? null : d,
                    p = t.method,
                    m = void 0 === p ? "GET" : p;
                Y(this, e), this.responseType = h, this.id = u, this.formData = v, this.method = m, this.isZip = f, this.isWorker = o, this.type = a, this.src = r, this._init(), this.charset = i
            }
            return K(e, [{ key: "_init", value: function() {} }, {
                key: "isZip",
                set: function(e) { this._isZip = e },
                get: function() {
                    return this._isZip
                }
            }, {
                key: "response",
                set: function(e) { this._response = e },
                get: function() {
                    return this._response
                }
            }, {
                key: "method",
                set: function(e) { this._method = e },
                get: function() {
                    return this._method
                }
            }, {
                key: "formData",
                set: function(e) { this._formData = e },
                get: function() {
                    return this._formData
                }
            }, {
                key: "responseType",
                set: function(e) { this._responseType = e },
                get: function() {
                    return this._responseType
                }
            }, {
                key: "id",
                set: function(e) { this._id = e },
                get: function() {
                    return this._id
                }
            }, {
                key: "isWorker",
                set: function(e) { this._isWorker = e },
                get: function() {
                    return this._isWorker
                }
            }, {
                key: "src",
                set: function(e) {
                    if (this._extension = Se(e), this.type = this.type || this._extension.extension, this._extension.absolute) this._src = e;
                    else {
                        var t = window.location.href,
                            n = Xe.parser(t);
                        this._src = 0 == e.indexOf("/") ? "//" + n.authority + "/" + e : "//" + n.authority + n.directory + "/" + e
                    }
                },
                get: function() {
                    return this._src
                }
            }, {
                key: "extension",
                get: function() {
                    return this._extension
                }
            }]), e
        }(),
        Ge = function() {
            function e(t, n, i) { Y(this, e), this.type = t, this.target = null, this.currentTarget = null, this.eventPhase = 0, this.bubbles = !!n, this.cancelable = !!i, this.timeStamp = (new Date).getTime(), this.defaultPrevented = !1, this.propagationStopped = !1, this.immediatePropagationStopped = !1, this.removed = !1 }
            return K(e, [{ key: "preventDefault", value: function() { this.defaultPrevented = this.cancelable && !0 } }, { key: "stopPropagation", value: function() { this.propagationStopped = !0 } }, { key: "stopImmediatePropagation", value: function() { this.immediatePropagationStopped = this.propagationStopped = !0 } }, { key: "remove", value: function() { this.removed = !0 } }, {
                key: "clone",
                value: function() {
                    return new e(this.type, this.bubbles, this.cancelable)
                }
            }, {
                key: "set",
                value: function(e) {
                    for (var t in e) this[t] = e[t];
                    return this
                }
            }, {
                key: "toString",
                value: function() {
                    return "[Event (type=" + this.type + ")]"
                }
            }]), e
        }(),
        Ve = function() {
            function e() { Y(this, e), this._listeners = null, this._captureListeners = null, this.off = this.removeEventListener.bind(this) }
            return K(e, null, [{
                key: "initialize",
                value: function(t) {
                    var n = e.prototype;
                    t.addEventListener = n.addEventListener, t.on = n.on, t.removeEventListener = t.off = n.removeEventListener, t.removeAllEventListeners = n.removeAllEventListeners, t.hasEventListener = n.hasEventListener, t.dispatchEvent = n.dispatchEvent, t._dispatchEvent = n._dispatchEvent, t.willTrigger = n.willTrigger
                }
            }]), K(e, [{
                key: "addEventListener",
                value: function(e, t, n) {
                    var i;
                    i = n ? this._captureListeners = this._captureListeners || {} : this._listeners = this._listeners || {};
                    var r = i[e];
                    return r && this.removeEventListener(e, t, n), r = i[e], r ? r.push(t) : i[e] = [t], t
                }
            }, {
                key: "on",
                value: function(e, t, n, i, r, s) {
                    return t.handleEvent && (n = n || t, t = t.handleEvent), n = n || this, this.addEventListener(e, function(e) { t.call(n, e, r), i && e.remove() }, s)
                }
            }, {
                key: "removeEventListener",
                value: function(e, t, n) {
                    var i = n ? this._captureListeners : this._listeners;
                    if (i) {
                        var r = i[e];
                        if (r)
                            for (var s = 0, o = r.length; o > s; s++)
                                if (r[s] == t) {
                                    1 == o ? delete i[e] : r.splice(s, 1);
                                    break
                                }
                    }
                }
            }, { key: "removeAllEventListeners", value: function(e) { e ? (this._listeners && delete this._listeners[e], this._captureListeners && delete this._captureListeners[e]) : this._listeners = this._captureListeners = null } }, {
                key: "dispatchEvent",
                value: function(e, t, n) {
                    if ("string" == typeof e) {
                        var i = this._listeners;
                        if (!(t || i && i[e])) return !0;

                        e = Ge(e, t, n)
                    } else e.target && e.clone && (e = e.clone());
                    try { e.target = this } catch (r) {}

                    if (e.bubbles && this.parent) {
                        for (var s = this, o = [s]; s.parent;) o.push(s = s.parent);
                        var a, u = o.length;
                        for (a = u - 1; a >= 0 && !e.propagationStopped; a--) o[a]._dispatchEvent(e, 1 + (0 == a));
                        for (a = 1; u > a && !e.propagationStopped; a++) o[a]._dispatchEvent(e, 3)
                    } else this._dispatchEvent(e, 2);
                    return !e.defaultPrevented
                }
            }, {
                key: "hasEventListener",
                value: function(e) {
                    var t = this._listeners,
                        n = this._captureListeners;
                    return !!(t && t[e] || n && n[e])
                }
            }, {
                key: "willTrigger",
                value: function(e) {
                    for (var t = this; t;) {
                        if (t.hasEventListener(e)) return !0;
                        t = t.parent
                    }
                    return !1
                }
            }, {
                key: "toString",
                value: function() {
                    return "[EventDispatcher]"
                }
            }, {
                key: "_dispatchEvent",
                value: function(e, t) {
                    var n, i = 1 == t ? this._captureListeners : this._listeners;
                    if (e && i) {
                        var r = i[e.type];
                        if (!r || !(n = r.length)) return;
                        try { e.currentTarget = this } catch (s) {}
                        try { e.eventPhase = t } catch (s) {}
                        e.removed = !1, r = r.slice();
                        for (var o = 0; n > o && !e.immediatePropagationStopped; o++) {
                            var a = r[o];
                            a.handleEvent ? a.handleEvent(e) : a(e), e.removed && (this.off(e.type, a, 1 == t), e.removed = !1)
                        }
                    }
                }
            }]), e
        }(),
        Ze = function() {
            var e = null;
            if (void 0 != window.XMLHttpRequest) e = new XMLHttpRequest;
            else try { e = new ActiveXObject("MSXML2.XMLHTTP") } catch (t) {
                try { e = new ActiveXObject("Microsoft.XMLHTTP") } catch (t) { e = null }
            }
            return e
        },
        Je = URL.createObjectURL(ke("(" + W.toString() + ")();")),
        Ye = function(e) {
            function t(e) {
                var n = e.isWorker,
                    i = void 0 === n ? !1 : n,
                    r = e.responseType,
                    s = e.src,
                    o = e.formData,
                    a = e.method;
                Y(this, t);
                var u = ee(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                u._isWorker = i;
                var c = !1;
                if (i) {
                    var f, l = new Worker(Je);
                    l.onmessage = function(e) { "success" == e.data.type ? (f = new Ge("complete"), f.data = e.data.data, u.dispatchEvent(f), l.terminate()) : "progress" == e.data.type ? (f = new Ge("progress"), f.loaded = e.data.data.loaded, f.total = e.data.data.total, u.dispatchEvent(f)) : (f = new Ge("error"), f.data = e.data.data, u.dispatchEvent(f), l.terminate()) }, l.postMessage({ src: s, formData: o, method: a })
                } else {
                    var h = Ze();
                    try { h.responseType = r } catch (d) { h.overrideMimeType("text/plain; charset=x-user-defined"), c = !0 }
                    var f;
                    h.onerror = function(e) { f = new Ge("error"), f.data = e, u.dispatchEvent(f) }, h.onload = function() { f = new Ge("complete"), f.data = c ? X(h.responseText) : h.response, u.dispatchEvent(f) }, h.onprogress = function(e) { f = new Ge("progress"), f.loaded = e.loaded, f.total = e.total, u.dispatchEvent(f) }, h.open(a, s, !0), h.send(o)
                }
                return u
            }
            return Q(t, e), K(t, [{ key: "_init", value: function() {} }, {
                key: "isWorker",
                get: function() {
                    return this._isWorker
                }
            }]), t
        }(Ve),
        Ke = function(e) {
            function t() {
                Y(this, t);
                var e = ee(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                return e._init(), e
            }
            return Q(t, e), K(t, [{ key: "_init", value: function() { this._list = [], this._count = 0, this._item = {}, this._currentCount = 0, this.factory = He } }, {
                key: "addItem",
                value: function(e) {
                    if (e instanceof qe) this._list.push(e);
                    else {
                        if ("string" == typeof e) return void this.addItem(new qe({ src: e }));
                        if (e instanceof Array) {
                            for (var t = 0; t < e.length; t++) this.addItem(e[t]);
                            return
                        }
                        if ("object" == ("undefined" == typeof e ? "undefined" : J(e))) return void this.addItem(new qe(e))
                    }
                    this.dispatchEvent(new Ge("add"))
                }
            }, { key: "start", value: function() { this._count = this._list.length, this.dispatchEvent(new Ge("start")), q.bind(this)() } }, { key: "stop", value: function() { this.dispatchEvent(new Ge("stop")) } }, {
                key: "getItem",
                value: function(e) {
                    return this._item[e]
                }
            }, {
                key: "removeItem",
                value: function(e) {
                    for (var t = 0; t < this._list.length; t++) {
                        var n = this._list[t].id;
                        if (n == e) return this.dispatchEvent(new Ge("remove")), this._list.splice(t, 1)
                    }
                }
            }, {
                key: "factory",
                set: function(e) { this._factory = e },
                get: function() {
                    return this._factory
                }
            }]), t
        }(Ve),
        $e = function() {
            function e(t, n) { Y(this, e), this._notifyMethod = t, this._notifyContext = n }
            return K(e, [{ key: "notifyObserver", value: function(e) { this._notifyMethod.apply(this._notifyContext, [e]) } }, {
                key: "compareNotifyContext",
                value: function(e) {
                    return e === this._notifyContext
                }
            }, {
                key: "notifyMethod",
                set: function(e) { this._notifyMethod = e },
                get: function() {
                    return this._notifyMethod
                }
            }, {
                key: "notifyContext",
                set: function(e) { this._notifyContext = e },
                get: function() {
                    return this._notifyContext
                }
            }]), e
        }(),
        Qe = function() {
            function e() {
                if (Y(this, e), e._instance) throw new Error("Instance!!");
                this.mediatorMap = {}, this.observerMap = {}
            }
            return K(e, [{ key: "initializeView", value: function() {} }, {
                key: "notifyObservers",
                value: function(e) {
                    if (this.observerMap[e.name])
                        for (var t, n = this.observerMap[e.name], i = 0; i < n.length; i++) t = n[i], t.notifyObserver(e)
                }
            }, {
                key: "registerObserver",
                value: function(e, t) {
                    var n = this.observerMap[e];
                    n ? n.push(t) : this.observerMap[e] = [t]
                }
            }, {
                key: "removeObserver",
                value: function(e, t) {
                    for (var n = this.observerMap[e], i = 0; i < n.length; i++)
                        if (n[i].compareNotifyContext(t)) {
                            n.splice(i, 1);
                            break
                        }
                    0 == n.length && delete this.observerMap[e]
                }
            }, {
                key: "registerMediator",
                value: function(e) {
                    if (!this.mediatorMap[e.name]) {
                        this.mediatorMap[e.name] = e;
                        var t = e.listNotificationInterests();
                        if (t.length)
                            for (var n = new $e(e.handleNotification, e), i = 0; i < t.length; i++) this.registerObserver(t[i], n);
                        e.onRegister()
                    }
                }
            }, {
                key: "retrieveMediator",
                value: function(e) {
                    return this.mediatorMap[e]
                }
            }, {
                key: "removeMediator",
                value: function(e) {
                    var t = this.mediatorMap[e];
                    if (t) {
                        for (var n = t.listNotificationInterests(), i = 0; i < n.length; i++) this.removeObserver(n[i], t);
                        delete this.mediatorMap[e], t.onRemove()
                    }
                    return t
                }
            }, {
                key: "hasMediator",
                value: function(e) {
                    return this.mediatorMap[e]
                }
            }]), e
        }();
    Qe._instance = null, Re(Qe);
    var et = function() {
        function e() {
            if (Y(this, e), Qe._instance) throw new Error("Instance!!");
            this.commandMap = {}, this.initializeController()
        }
        return K(e, [{ key: "initializeController", value: function() { this.view = Qe.getInstance() } }, {
            key: "execute",
            value: function(e) {
                var t = this.commandMap[e.name];
                if (void 0 !== t) {
                    if ("function" == typeof t) var n = new t;
                    else var n = t;
                    n.execute(e)
                }
            }
        }, { key: "register", value: function(e, t) { void 0 === this.commandMap[e] && this.view.registerObserver(e, new $e(this.execute, this)), this.commandMap[e] = t } }, {
            key: "hasCommand",
            value: function(e) {
                return null != this.commandMap[e]
            }
        }, { key: "remove", value: function(e) { this.hasCommand(e) && (this.view.removeObserver(e, this), delete this.commandMap[e]) } }]), e
    }();
    et._instance = null, Re(et);
    var tt = function() {
        function e() {
            if (Y(this, e), e._instance) throw new Error("Singleton");
            this.proxyMap = {}, this.initializeModel()
        }
        return K(e, [{ key: "initializeModel", value: function() {} }, {
            key: "register",
            value: function(e) {
                return this.proxyMap[e.name] && this.proxyMap[e.name].onRemove(), this.proxyMap[e.name] = e, e.onRegister(), e
            }
        }, {
            key: "retrieve",
            value: function(e) {
                return this.proxyMap[e]
            }
        }, {
            key: "hasProxy",
            value: function(e) {
                return null != this.proxyMap[e]
            }
        }, {
            key: "remove",
            value: function(e) {
                var t = this.proxyMap[e];
                return t && (delete this.proxyMap[e], t.onRemove()), t
            }
        }]), e
    }();
    tt._instance = null, Re(tt);
    var nt = function pt(e, t, n) { Y(this, pt), this.name = e, this.body = t, this.type = n },
        it = function() {
            function e() { Y(this, e), this.initializeFacade() }
            return K(e, [{ key: "initializeFacade", value: function() { this.initializeModel(), this.initializeController(), this.initializeView() } }, { key: "initializeModel", value: function() { this.model || (this.model = tt.getInstance()) } }, { key: "initializeController", value: function() { this.controller || (this.controller = et.getInstance()) } }, { key: "initializeView", value: function() { this.view || (this.view = Qe.getInstance()) } }, { key: "registerCommand", value: function(e, t) { this.controller.register(e, t) } }, { key: "removeCommand", value: function(e) { this.controller.remove(e) } }, {
                key: "hasCommand",
                value: function(e) {
                    return this.controller.hasCommand(e)
                }
            }, {
                key: "registerProxy",
                value: function(e) {
                    return this.model.register(e)
                }
            }, {
                key: "retrieveProxy",
                value: function(e) {
                    return this.model.retrieve(e)
                }
            }, {
                key: "removeProxy",
                value: function(e) {
                    return this.model.remove(e)
                }
            }, {
                key: "hasProxy",
                value: function(e) {
                    return this.model.hasProxy(e)
                }
            }, { key: "registerMediator", value: function(e) { this.view.registerMediator(e) } }, {
                key: "retrieveMediator",
                value: function(e) {
                    return this.view.retrieveMediator(e)
                }
            }, {
                key: "removeMediator",
                value: function(e) {
                    return "object" == ("undefined" == typeof e ? "undefined" : J(e)) && e.name && (e = e.name), this.view.removeMediator(e)
                }
            }, {
                key: "hasMediator",
                value: function(e) {
                    return this.view.hasMediator(e)
                }
            }, { key: "sendNotification", value: function(e, t, n) { this.notifyObservers(new nt(e, t, n)) } }, { key: "notifyObservers", value: function(e) { this.view.notifyObservers(e) } }], [{
                key: "getInstance",
                value: function() {
                    return void 0 === e._instance ? e._instance = new e : e._instance
                }
            }]), e
        }(),
        rt = function() {
            function e() { Y(this, e), this.facade = it.getInstance() }
            return K(e, [{ key: "sendNotification", value: function(e, t, n) { this.facade.sendNotification(e, t, n) } }, { key: "execute", value: function() {} }]), e
        }(),
        st = function() {
            function e(t) { Y(this, e), this.name = t, this.facade = it.getInstance() }
            return K(e, [{ key: "onRegister", value: function() {} }, { key: "onRemove", value: function() {} }, { key: "sendNotification", value: function(e, t, n) { this.facade.sendNotification(e, t, n) } }]), e
        }(),
        ot = function(e) {
            function t() {
                Y(this, t);
                var e = ee(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                return e._subCommands = new Array, e.initializeMacroCommand(), e
            }
            return Q(t, e), K(t, [{ key: "initializeMacroCommand", value: function() {} }, { key: "addSubCommand", value: function(e) { this._subCommands.push(e) } }, {
                key: "execute",
                value: function(e) {
                    for (; this._subCommands.length > 0;) {
                        var t = this._subCommands.shift(),
                            n = new t;
                        n.execute(e)
                    }
                }
            }]), t
        }(rt),
        at = function() {
            function e(t, n) { Y(this, e), this.name = t, this.viewComponent = n, this.facade = it.getInstance() }
            return K(e, [{ key: "onRegister", value: function() {} }, { key: "onRemove", value: function() {} }, { key: "handleNotification", value: function() {} }, {
                key: "listNotificationInterests",
                value: function() {
                    return []
                }
            }, { key: "sendNotification", value: function(e, t, n) { this.facade.sendNotification(e, t, n) } }, {
                key: "viewComponent",
                set: function(e) { this._viewComponent = e },
                get: function() {
                    return this._viewComponent
                }
            }]), e
        }(),
        ut = function() {
            function e(t) { Y(this, e), this.name = t }
            return K(e, [{
                key: "onRegister",
                value: function() {
                    var e = this;
                    this.facade = it.getInstance(), this._loader = new Ke, this.type = "main", this._loader.on("complete", function(t) { e.facade.sendNotification(e.type + "complete", t.item) }), this._loader.on("fileload", function(t) { e.facade.sendNotification(e.type + "fileload", t.item) }), this._loader.on("error", function(t) { e.facade.sendNotification(e.type + "error", t.item) }), this._loader.on("progress", function(t) { e.facade.sendNotification(e.type + "progress", t.progress) })
                }
            }, { key: "onRemove", value: function() { this._loader.removeAllEventListeners(), this._loader = null } }, {
                key: "load",
                value: function(e) {
                    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "main";
                    this.type = t, this._loader.addItem(e), this._loader.start()
                }
            }]), e
        }(),
        ct = function(e) {
            function t() {
                return Y(this, t), ee(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this))
            }
            return Q(t, e), K(t, [{ key: "startup", value: function(e) { this.sendNotification("load", e, "main") } }, { key: "initializeModel", value: function() { $(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "initializeModel", this).call(this), this.registerProxy(new ut("loader")) } }, {
                key: "initializeController",
                value: function() {
                    $(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "initializeController", this).call(this);
                    var e = this.retrieveProxy("loader");
                    this.registerCommand("load", { execute: function(t) { e.load(t.body, t.type) } })
                }
            }], [{
                key: "getInstance",
                value: function() {
                    return void 0 === t._instance ? t._instance = new t : t._instance
                }
            }]), t
        }(it),
        ft = { ZIPFile: Ie, ZIPPackage: ze, FileFactory: He },
        lt = { Loader: Ke, LoaderItem: qe, Request: Ye },
        ht = { Thread: Ue },
        dt = { Controller: et, Facade: it, View: Qe, Notification: nt, Model: tt, SimpleCommand: rt, Proxy: st, MacroCommand: ot, Mediator: at };
    e.zip = ft, e.loader = lt, e.thread = ht, e.mvc = dt, e.Manager = ct, e.Assest = Ne, e.utils = Be
}(this.TGMG = this.TGMG || {});
