/* This file was generated from TypeScript source C:/Users/autobuild/turbulenz/engine/samples/tsscripts/motion.ts */

// Copyright (c) 2010-2011 Turbulenz Limited
//
// Motion Object
//
var Motion = (function () {
    function Motion() {
        this.version = 3;
        this.pi2 = 2 * Math.PI;
        // Supported rotation types
        this.rotationType = {
            none: 0,
            weave2D: // No rotation beyond base rotation
            1,
            rotate: // Sinusoidal motion about 'up' axis
            2
        };// Rotate about the 'up' axis
        
        // Supported movement types
        this.movementType = {
            none: 0,
            constant: // No movement
            1,
            pulse: // Move at constant rate
            2
        };// Move in pulses based on sinusoidal acceleration
        
        // Supported direction types
        this.directionType = {
            none: 0,
            circular2D: // No direction
            1,
            linear: // Move in a circle about the y-axis
            2
        };// Move in a linear direction to a position
        
        // The looping rate of movement in cycles per second (> 0.0)
        this.movementRate = 1;
        // The direction of movement
        this.isMovementForward = true;
        // The radius of circular movement around the central point (> 0.0)
        this.circularRadius = 1;
        // The looping rate of the rotation modifier in cycles per second (> 0.0)
        this.rotationRate = 1;
        // The variation of the rotation modfier (0.0 - 1.0)
        this.rotationVariation = 1;
    }
    Motion.prototype.setCircularMovement = // m43
    function (radius, center) {
        var md = this.md;
        var circularCenter = this.circularCenter;
        circularCenter[0] = center[0];
        // Ignore y-value
        circularCenter[2] = center[2];
        if(radius > 0.0) {
            this.circularRadius = radius;
        }
        this.centerPosition = md.v3Build(circularCenter[0], 0, circularCenter[2]);
        this.dirMode = this.directionType.circular2D;
    };
    Motion.prototype.setRailMovement = function (endPosition, startRate) {
        this.rotMode = this.rotationType.none;
        this.dirMode = this.directionType.linear;
        this.movMode = this.movementType.constant;
        if(startRate > 0.0) {
            this.movementRate = startRate;
        }
        this.atTarget = false;
        this.targetPosition = endPosition;
    };
    Motion.prototype.setConstantMotion = function (constantRate) {
        if(constantRate > 0.0) {
            this.movementRate = constantRate;
        }
        this.movMode = this.movementType.constant;
    };
    Motion.prototype.setDuckMotion = function (swimRate, wobbleRate, wobbleVariation) {
        if(swimRate > 0.0) {
            this.movementRate = swimRate;
        }
        if(wobbleRate > 0.0) {
            this.rotationRate = wobbleRate;
        }
        if(!(wobbleVariation < 0.0 || wobbleVariation > 1.0)) {
            this.rotationVariation = wobbleVariation;
        }
        this.rotMode = this.rotationType.weave2D;
        this.movMode = this.movementType.pulse;
    };
    Motion.prototype.setConstantRotation = function (constantRate) {
        if(constantRate > 0.0) {
            this.rotationRate = constantRate;
        }
        this.rotMode = this.rotationType.rotate;
    };
    Motion.prototype.setUpdateMatrix = function (matrixToUpdate) {
        this.matrix = matrixToUpdate;
    };
    Motion.prototype.setBaseOrientation = function (rotationAngle) {
        var md = this.md;
        this.baseRotation = md.m43FromAxisRotation(this.up, rotationAngle, this.baseRotation);
    };
    Motion.prototype.reverseDirection = function () {
        this.isMovementForward = !this.isMovementForward;
    };
    Motion.prototype.getMovementRate = function () {
        return this.movementRate;
    };
    Motion.prototype.getRotationRate = function () {
        return this.rotationRate;
    };
    Motion.prototype.updateRotation = function () {
        /* delta2PI */ // Math device functions
        var md = this.md;
        var v3Normalize = md.v3Normalize;
        var v3Cross = md.v3Cross;
        var m43Mul = md.m43Mul;
        var v3Sub = md.v3Sub;
        var m43Build = md.m43Build;
        var m43FromAxisRotation = md.m43FromAxisRotation;
        // update input
        var up = this.up;
        var baseRotation = this.baseRotation;
        var centerPosition = this.centerPosition;
        var endPosition = this.endPosition;
        // update output
        var matrix = this.matrix;
        // temp variables
        var variantRotation = this.variantRotation;
        var xaxis = this.xaxis;
        var yaxis = this.yaxis;
        var zaxis = this.zaxis;
        // Rotation mode
        var mode = this.rotMode;
        var weave2D = this.rotationType.weave2D;
        var rotate = this.rotationType.rotate;
        if(weave2D === mode) {
            // Assumes forward motion is zaxis
            variantRotation = m43FromAxisRotation.call(md, up, this.rotationVariation * this.motionWaveSin, variantRotation);
            // Motion assumes that xaxis is always pointing to the center
            xaxis = v3Sub.call(md, endPosition, centerPosition, xaxis);
            v3Normalize.call(md, xaxis, xaxis);
            zaxis = v3Cross.call(md, xaxis, up);
            v3Normalize.call(md, zaxis, zaxis);
        } else if(rotate === mode) {
            variantRotation = m43FromAxisRotation.call(md, up, this.motionPhase, variantRotation);
            //TODO: not relative to up vector
            xaxis = md.v3Build(1, 0, 0);
            yaxis = md.v3Build(0, 1, 0);
            zaxis = md.v3Build(0, 0, 1);
        } else// none, default
         {
            variantRotation = m43FromAxisRotation.call(md, up, 0, variantRotation);
            // TODO: Don't create a new v3
            xaxis = md.v3Build(1, 0, 0);
            zaxis = v3Cross.call(md, xaxis, up);
            v3Normalize.call(md, zaxis, zaxis);
        }
        // Construct final world matrix
        matrix = m43Build.call(md, xaxis, up, zaxis, endPosition, matrix);
        matrix = m43Mul.call(md, matrix, baseRotation, matrix);
        this.matrix = m43Mul.call(md, matrix, variantRotation, matrix);
    };
    Motion.prototype.updateMovement = function (delta) {
        // Movement mode
        var mode = this.movMode;
        var pulse = this.movementType.pulse;
        var constant = this.movementType.constant;
        if(pulse === mode) {
            this.movementDelta = (this.movementRate * ((1.0 - this.motionWaveSin) * 0.5 + 0.2)) * delta;
        } else if(constant === mode) {
            this.movementDelta = this.movementRate * delta;
        } else// none, default
         {
            // No change to movementDelta
                    }
    };
    Motion.prototype.updateDirection = function () {
        /* delta */ var md = this.md;
        var movementDelta2PI = (this.movementDelta * this.pi2);
        var movementDelta = this.movementDelta;
        if(!this.isMovementForward) {
            movementDelta2PI *= -1;
        }
        this.circularAngle += movementDelta2PI;
        var circularAngle = this.circularAngle;
        var circularCenter = this.circularCenter;
        var circularRadius = this.circularRadius;
        var position = this.position;
        var targetPosition = this.targetPosition;
        var v3temp = this.v3temp;
        var atTarget = this.atTarget;
        var atTargetDelta = this.atTargetDelta;
        var mode = this.dirMode;
        var dirType = this.directionType;
        if(dirType.circular2D === mode) {
            // Update position
            position[0] = (circularRadius * Math.sin(circularAngle)) + circularCenter[0];
            position[2] = (circularRadius * Math.cos(circularAngle)) + circularCenter[2];
        } else if((dirType.linear === mode) && !atTarget) {
            var p0 = position[0];
            var p1 = position[1];
            var p2 = position[2];
            v3temp[0] = targetPosition[0] - p0;
            v3temp[1] = targetPosition[1] - p1;
            v3temp[2] = targetPosition[2] - p2;
            if(md.v3LengthSq(v3temp) < atTargetDelta) {
                this.atTarget = true;
            } else {
                if(movementDelta < 1.0) {
                    v3temp = md.v3ScalarMul(v3temp, movementDelta, v3temp);
                }
                position[0] = p0 + v3temp[0];
                position[1] = p1 + v3temp[1];
                position[2] = p2 + v3temp[2];
            }
        } else// none, default
         {
            // No position update
                    }
        // TODO: Avoid creating a new v3
        this.endPosition = md.v3Build(this.position[0], this.position[1], this.position[2]);
    };
    Motion.prototype.update = function (delta) {
        var md = this.md;
        var m43SetPos = md.m43SetPos;
        var pi2 = this.pi2;
        var delta2PI = delta * pi2;
        if(this.move) {
            this.motionPhase += (this.rotationRate * delta2PI);
            this.motionWaveSin = Math.sin(this.motionPhase);
            this.motionWaveCos = Math.cos(this.motionPhase);
            this.updateMovement(delta);
            this.updateDirection()/* delta */ ;
            this.updateRotation()/* delta2PI */ ;
            m43SetPos.call(md, this.matrix, this.endPosition);
        }
    };
    Motion.create = // Motion Constructor function
    function create(md, name) {
        var m = new Motion();
        m.md = md;
        m.name = name;
        m.matrix = md.m43BuildIdentity();
        // Motion types
        m.rotMode = m.rotationType.none;
        m.movMode = m.movementType.none;
        m.dirMode = m.directionType.none;
        // Position, orientation
        m.up = md.v3Build(0, 1, 0);
        m.position = md.v3BuildZero();
        m.endPosition = md.v3BuildZero();
        // Circular Motion
        m.circularAngle = 0.0;
        m.circularCenter = md.v3BuildZero();
        // Central position from which circular motion is calculated
        m.centerPosition = md.v3Build(m.circularCenter[0], m.circularCenter[1], m.circularCenter[2]);
        m.motionPhase = 0.0;
        m.motionWaveSin = Math.sin(m.motionPhase);
        m.motionWaveCos = Math.cos(m.motionPhase);
        m.move = true;
        m.atTarget = true;
        m.atTargetDelta = 0.001;
        m.targetPosition = md.v3BuildZero();
        // Temporary variables
        m.xaxis = md.v3BuildZero();
        m.yaxis = md.v3BuildZero();
        m.zaxis = md.v3BuildZero();
        m.v3temp = md.v3BuildZero();
        // The default rotation of the object before motion
        m.baseRotation = md.m43BuildIdentity();
        // The rotation applied to the base rotation
        m.variantRotation = md.m43BuildIdentity();
        return m;
    };
    return Motion;
})();

