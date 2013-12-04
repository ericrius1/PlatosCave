/**
 * @author Philipp Graf
 */
var grow3 = grow3 || {};
var growthTime = 1000;

grow3.State = (function() {
    var standardMaterial = new THREE.MeshPhongMaterial({color: 0xcccccc});

    var state = function(parent) {
        this.objectProto = new THREE.Object3D();
        this.objectProto.matrixAutoUpdate = false;
        
        this.textParamId = undefined;
        if (parent === undefined) {
            this.mat = standardMaterial;
            this.textParam = {size: 1.0, height: 0.3, curveSegments: 2, font: "helvetiker"};
        } else {
            this.mat = parent.mat;
            this.textParam = parent.textParam;
        }
    };
    state.prototype.constructor = state;

    state.prototype.clone = function() {
        var o = new grow3.State(this, this.sys);
        this.objectProto.clone(o.objectProto);
        return o;
    };

    return state;
})();

grow3.System = (function() {

    var cubeGeometry = new THREE.CubeGeometry(1, 1, 1);
    var sphereGeometry = new THREE.SphereGeometry(0.5, 32, 16);

    var system = function(scene, camera /* optional */, script /* optional */) {
        this.scene = scene;
        this.script = script;

        this.backlog = [];
        this.backlogBuild = [];

        this.mDepth = 20;
        this.depth = 0;

        this.state = this.rollback = new grow3.State(undefined);
        this.state.objectProto.matrixAutoUpdate = true;

        this.parent = new grow3.State(undefined);
        this.parent.objectProto = scene;
        this.scene.add(this.state.objectProto);

        this.cameraObj = camera;

        this.hasLighting = false;

        this.backgroundColor = 0xcccccc;
    };

    system.prototype.constructor = system;

    system.prototype.toString = function() {
        return "[grow3.System]";
    };

    system.prototype.maxDepth = function(md) {
        this.mDepth = md;
    };

    system.prototype.rule = function(func) {

        var fnew = function(isRoot /*, additional args */) {

            var otherArgs = Array.prototype.slice.call(arguments, 1);

            if (isRoot === true) {
                this.parent = this.state;                                  // aktueller state -> parent f. folgende 
                this.rollback = new grow3.State(this.state);               // Vorlage für Rollbacks
                this.state = this.rollback.clone();                        // Nächster State (f. Unterfunkt)!

                // check if parameters are arrays and select an element
                otherArgs.forEach(function(el, index, array) {
                    if (Array.isArray(el)) {
                        array[index] = this.handleParameter(el);
                    }
                }, this);


                if (typeof(func) === "function") {
                    func.apply(this, otherArgs);
                } else {        // TODO: Check if array
                    var index = Math.floor(Math.random() * func.length);
                    func[index].call(this, otherArgs);
                }
            } else if (this.depth < this.mDepth) {
                this.backlogBuild.push([fnew, this.state, otherArgs]);                 // inkl. Trafo ausgewertet
                this.parent.objectProto.add(this.state.objectProto);

                this.state = this.rollback.clone();                         // Wieder Vorlage (rollback)
            }
            return this;
        };

        return fnew;
    };



    system.prototype.rules = function(map) {
        for (var e in map) {
            this[e] = this.rule(map[e]);
        }
    };

    /*
     * Start evaluation
     **** BEGIN BUILD******
     */
    system.prototype.build = function(start, startPos) {
        console.log("START POS", startPos)
        this.scene.add(this.state.objectProto);
        var rootNode = this.state.objectProto;
        rootNode.position.set(startPos.x, startPos.y, startPos.z)

        this.depth = 0;

        if (this.script !== undefined) {
            this.script.call(this, this);
        }

        if ((start !== undefined)||(this.backlogBuild.length === 0)) {
            start = start || "start";
            this.backlogBuild.push([this[start], this.state, []]);
        }

    
        this.depth++;
        this.backlog = this.backlogBuild;
        this.backlogBuild = [];

        while (this.backlog.length > 0) {
            //console.log("[RULE] " + this.backlog[0] + ":" + this.depth + ":" + this.backlog.length);
            var entry = this.backlog.shift();
            this.state = entry[1];
            entry[2].unshift(true);
            entry[0].apply(this, entry[2]);
        }

        nextOne(this);

        function nextOne (obj) {
            window.obj = obj;
            obj.depth++;
            obj.backlog = obj.backlogBuild;
            obj.backlogBuild = [];

            while (obj.backlog.length > 0) {
                //console.log("[RULE] " + obj.backlog[0] + ":" + obj.depth + ":" + obj.backlog.length);
                var entry = obj.backlog.shift();
                obj.state = entry[1];
                entry[2].unshift(true);
                entry[0].apply(obj, entry[2]);
            }
            if (obj.backlogBuild.length > 0) {
              nextOne(obj)
            }
        }
        return rootNode;
    };


    system.prototype.rnd = function(p1, p2) {
        var r = Math.random();
        if (Array.isArray(p1)) {
            return p1[Math.floor(r * p1.length)];
        }

        if (!(p1 === undefined)) {
            if (!(p2 === undefined)) {
                r = r * (p2 - p1) + p1;
            } else {
                r = r * 2 * p1 - p1;
            }
        }
        return r;
    };

    system.prototype.select = function(arr, index) {
        var size = arr.length;
        var i = index % size;
        i =  i<0 ? i+size : i;
        return arr[i];
    };

    system.prototype.handleParameter = function(param) {
        if (Array.isArray(param)) {
            if (param.startDepth === undefined) {
                param.startDepth = this.depth;
            }
            return param[(this.depth - param.startDepth) % param.length];
        } else {
            return param;
        }


    };

    system.prototype.background = function(col) {
        this.backgroundColor = col;
    };

    system.prototype.addMesh = function(geo) {
        var mesh = new THREE.Mesh(geo, this.state.mat);
        this.parent.objectProto.clone(mesh);
        this.parent.objectProto.parent.add(mesh);
    };

    //


    /**
     * BUILTIN RULES
     */

    var rule = system.prototype.rule;

    system.prototype.mesh = rule(system.prototype.addMesh);

    system.prototype.cube = rule(function() {
        this.addMesh(cubeGeometry);
    });

    system.prototype.sphere = rule(function() {
        this.addMesh(sphereGeometry);
    });

    //ERIC'S ADDED RULES
    system.prototype.emitter = rule(function(){
      this.addEmmitter(emitter)
    })


    var centerX = function(geometry) {
        geometry.computeBoundingBox();
        var bb = geometry.boundingBox;
        var offsetX = -0.5 * (bb.min.x + bb.max.x);
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(offsetX, 0, 0));
        geometry.computeBoundingBox();

        return offsetX;
    };

    var glyphsCache = {};

    system.prototype.glyphs = rule(function(text) {
        var p = this.parent.textParam;
        if (this.parent.textParamId === undefined) {                                         // Font change -> check if cache exists & build
            this.parent.textParamId = p.font + ":" + p.size + ":" + p.height + ":" + p.curveSegments;
            glyphsCache[this.parent.textParamId] = glyphsCache[this.parent.textParamId] || {};
        }

        if (text !== " ") {
            if (!glyphsCache[this.parent.textParamId].hasOwnProperty(text)) {     // Build (cached) text geometry
                var geo = new THREE.TextGeometry(text, this.parent.textParam);
                centerX(geo);
                glyphsCache[this.parent.textParamId][text] = geo;
            }

            this.addMesh(glyphsCache[this.parent.textParamId][text]);
        }
    });

    var qDummy = new THREE.Quaternion();
    var sDummy = new THREE.Vector3();

    system.prototype.camera = rule(function() {
        if (this.cameraObj !== undefined) {
            // this.scene.updateMatrixWorld(true);

            // this.parent.objectProto.matrixWorld.decompose(this.cameraObj.position, qDummy, sDummy);
            // this.cameraObj.lookAt(0);
        }
    });

    system.prototype.light = rule(function(hex, intensity, distance) {
        var light = new THREE.PointLight(hex, intensity, distance);
        this.parent.objectProto.clone(light);
        this.parent.objectProto.parent.add(light);

        this.hasLighting = true;
    });


    /**
     * MODIFIERS
     */

    system.prototype.buildModifier = function(fun) {
        return function(param) {
            var argsH = new Array();
            for (var i=0; i<arguments.length; i++) {
                argsH[i] = this.handleParameter(arguments[i]);
            }

            fun.apply(this, argsH);
            return this;
        };
    };


    var buildModifier = system.prototype.buildModifier;
    /*
     * Move forward (scale sensitive)
     */
    var trafo4 = new THREE.Matrix4();

    system.prototype.move = buildModifier(function(amount) {
        trafo4.makeTranslation(amount, 0, 0);
        this.state.objectProto.matrix.multiplyMatrices(trafo4, this.state.objectProto.matrix);
//        this.state.objectProto.position.x += amount;
    });

    system.prototype.m = system.prototype.move;

    system.prototype.transHoriz = buildModifier(function(amount) {
        trafo4.makeTranslation(0, amount, 0);
        this.state.objectProto.matrix.multiplyMatrices(trafo4, this.state.objectProto.matrix);
//        this.state.objectProto.position.y += amount;
    });

    system.prototype.tH = system.prototype.transHoriz;

    system.prototype.transVert = buildModifier(function(amount) {
        trafo4.makeTranslation(0, 0, amount);
        this.state.objectProto.matrix.multiplyMatrices(trafo4, this.state.objectProto.matrix);
//        this.state.objectProto.position.z += amount;
    });

    system.prototype.tV = system.prototype.transVert;

    /*
     * Change scale by factor amount
     */
    system.prototype.scale = buildModifier(function(amount1, amount2, amount3) {
        if (!(amount2 === undefined)&&(!(amount3 == undefined))) {
            trafo4.makeScale(amount1, amount2, amount3);
        } else {
            trafo4.makeScale(amount1, amount1, amount1);
        }
        this.state.objectProto.matrix.multiplyMatrices(trafo4, this.state.objectProto.matrix);
//        this.state.objectProto.scale.multiplyScalar(amount);
    });

    system.prototype.s = system.prototype.scale;

    // pitch roll yaw
    system.prototype.roll = buildModifier(function(angle) {
        angle = angle * Math.PI / 180.0;
        trafo4.makeRotationX(angle);
        this.state.objectProto.matrix.multiplyMatrices(trafo4, this.state.objectProto.matrix);
//        this.state.objectProto.rotation.x += angle;
    });

    system.prototype.rX = system.prototype.roll;

    system.prototype.yaw = buildModifier(function(angle) {
        angle = angle * Math.PI / 180.0;
        trafo4.makeRotationY(angle);
        this.state.objectProto.matrix.multiplyMatrices(trafo4, this.state.objectProto.matrix);
//        this.state.objectProto.rotation.y += angle;
    });

    system.prototype.rY = system.prototype.yaw;

    system.prototype.pitch = buildModifier(function(angle) {
        angle = angle * Math.PI / 180.0;
        trafo4.makeRotationZ(angle);
        this.state.objectProto.matrix.multiplyMatrices(trafo4, this.state.objectProto.matrix);
//        this.state.objectProto.rotation.z += angle;
    });

    system.prototype.rZ = system.prototype.pitch;

    system.prototype.material = buildModifier(function(mat) {
        this.state.mat = mat;
    });

    system.prototype.textParam = buildModifier(function(o) {
        if (this.state.textParam !== o) {
            this.state.textParamId = undefined;
        }
        this.state.textParam = o;
    });

    return system;
})();

