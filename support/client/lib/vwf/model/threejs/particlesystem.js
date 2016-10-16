"use strict";
(function()
{

    function Particle(system, i)
    {
       
        this.i = i;
        this.system = system;
        //the world space position
        this.world = new THREE.Vector3();
        //the previous !tick! (not frame) position
        this.prevworld = new THREE.Vector3();
        this.position = new THREE.Vector3();
        //the color
        var color = new THREE.Vector4(1, 1, 1, 1);
       
        this.waitForRegen = false;
        this.color = color;

        this.size = 1;
        //back up initial (needed by the analyticShader)
        this.initialx = this.world.x;
        this.initialy = this.world.y;
        this.initialz = this.world.z;

        //start stoped, age 0
        this.age = 0;
        this.prevage = 0;
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.acceleration = new THREE.Vector3(0, 0, 0);
        this.lifespan = 1;

        //the sise
      

        this._aSize = this.system.threeParticleSystem.geometry.attributes.size;
        this._aAge = this.system.geometry.attributes.age;
        this._aLifespan = this.system.geometry.attributes.lifespan;
        //set the size - stored per vertex
       
        this.previousPosition = new THREE.Vector3();
        this.random = new THREE.Vector4(Math.random(),Math.random(),Math.random(),Math.random());
        //This looks like it could be computed from the start and end plus random on the shader
        //doing this saves computetime on the shader at expense of gpu mem

    
        this.sizeDirty = true;
        this.vertexColorDirty = true;
        this.ageDirty = true;
        this.previousPositionDirty = true;
        this.accelerationDirty = true;
        this.velocityDirty = true;
        this.lifespanDirty = true;
        this.randomDirty = true;
        this.positionDirty = true;
        this.randomDirty = true;
        this.renderToBuffers();
    }
    Particle.prototype.dirty = function()
    {

        this.sizeDirty = true;
        this.vertexColorDirty = true;
        this.ageDirty = true;
        this.previousPositionDirty = true;
        this.accelerationDirty = true;
        this.velocityDirty = true;
        this.lifespanDirty = true;
        this.randomDirty = true;
        this.positionDirty = true;
        this.randomDirty = true;
       
    }
    Particle.prototype.setSize = function(s)
    {
        this.size = s;
        this.sizeDirty = true;
    }
    //set the age - stored per vertex
    Particle.prototype.setAge = function(a)
    {
        this.age = a;
        this.ageDirty = true;
    }
    //the lifespan - stored per vertex
    Particle.prototype.setLifespan = function(a)
    {
        this.lifespan = a;
        this.lifespanDirty = true;
    }
    //the lifespan - stored per vertex
    Particle.prototype.setPreviousPosition = function(a)
    {
        this.previousPosition.set(a);
        this.previousPositionDirty = true;
    }
    Particle.prototype.setPosition = function(a)
    {
        this.position.set(a);
        this.positionDirty = true;
    }
    Particle.prototype.setVelocity = function(a)
    {
        this.velocity.set(a);
        this.velocityDirty = true;
    }
    Particle.prototype.setAcceleraton = function(a)
    {
        this.acceleration.set(a);
        this.accelerationDirty = true;
    }
    Particle.prototype.setVertexColor = function(a)
    {
        this.vertexColor.set(a);
        this.vertexColorDirty = true;
    }
    Particle.prototype.renderToBuffers = function()
    {
        if (this.positionDirty)
        {
            this.system.geometry.attributes.position.array[this.i * 3 + 0] = this.position.x;
            this.system.geometry.attributes.position.array[this.i * 3 + 1] = this.position.y;
            this.system.geometry.attributes.position.array[this.i * 3 + 2] = this.position.z;
            this.system.geometry.attributes.position.needsUpdate = true;
        }
        if (this.previousPositionDirty)
        {
            this.system.geometry.attributes.previousPosition.array[this.i * 3 + 0] = this.previousPosition.x;
            this.system.geometry.attributes.previousPosition.array[this.i * 3 + 1] = this.previousPosition.y;
            this.system.geometry.attributes.previousPosition.array[this.i * 3 + 2] = this.previousPosition.z;
            this.system.geometry.attributes.previousPosition.needsUpdate = true;
        }
        if (this.accelerationDirty)
        {
            this.system.geometry.attributes.acceleration.array[this.i * 3 + 0] = this.acceleration.x;
            this.system.geometry.attributes.acceleration.array[this.i * 3 + 1] = this.acceleration.y;
            this.system.geometry.attributes.acceleration.array[this.i * 3 + 2] = this.acceleration.z;
            this.system.geometry.attributes.acceleration.needsUpdate = true;
        }
        if (this.velocityDirty)
        {
            this.system.geometry.attributes.velocity.array[this.i * 3 + 0] = this.velocity.x;
            this.system.geometry.attributes.velocity.array[this.i * 3 + 1] = this.velocity.y;
            this.system.geometry.attributes.velocity.array[this.i * 3 + 2] = this.velocity.z;
            this.system.geometry.attributes.velocity.needsUpdate = true;
        }
        if (this.vertexColorDirty)
        {
            this.system.geometry.attributes.vertexColor.array[this.i * 4 + 0] = this.color.x;
            this.system.geometry.attributes.vertexColor.array[this.i * 4 + 1] = this.color.y;
            this.system.geometry.attributes.vertexColor.array[this.i * 4 + 2] = this.color.z;
            this.system.geometry.attributes.vertexColor.array[this.i * 4 + 3] = this.color.w;
            this.system.geometry.attributes.vertexColor.needsUpdate = true;
        }
        if (this.randomDirty)
        {
            this.system.geometry.attributes.random.array[this.i * 4 + 0] = this.random.x;
            this.system.geometry.attributes.random.array[this.i * 4 + 1] = this.random.y;
            this.system.geometry.attributes.random.array[this.i * 4 + 2] = this.random.z;
            this.system.geometry.attributes.random.array[this.i * 4 + 3] = this.random.w;
            this.system.geometry.attributes.random.needsUpdate = true;
        }
        
        if (this.lifespanDirty)
        {
            this.system.geometry.attributes.lifespan.array[this.i * 1 + 0] = this.lifespan;
            this.system.geometry.attributes.lifespan.needsUpdate = true;
        }
        if (this.ageDirty)
        {
            this.system.geometry.attributes.age.array[this.i * 1 + 0] = this.age;
            this.system.geometry.attributes.age.needsUpdate = true;
        }
        if (this.sizeDirty)
        {
            this.system.geometry.attributes.size.array[this.i * 1 + 0] = this.size;
            this.system.geometry.attributes.size.needsUpdate = true;
        }

        this.randomDirty = false;
        this.sizeDirty = false;
        this.positionDirty = false;
        this.vertexColorDirty = false;
        this.ageDirty = false;
        this.previousPositionDirty = false;
        this.accelerationDirty = false;
        this.velocityDirty = false;
        this.lifespanDirty = false;
        this.randomDirty = false;

    }

    function ParticleSystem(count)
    {

       
        // create the particle variables
      
        var particles = new THREE.BufferGeometry();
        this.particleCount = count;
        particles.addAttribute('position',new THREE.BufferAttribute(new Float32Array(count*3),3));
        particles.addAttribute('acceleration',new THREE.BufferAttribute(new Float32Array(count*3),3));
        particles.addAttribute('velocity',new THREE.BufferAttribute(new Float32Array(count*3),3));
        particles.addAttribute('previousPosition',new THREE.BufferAttribute(new Float32Array(count*3),3));

        particles.addAttribute('random',new THREE.BufferAttribute(new Float32Array(count*4),4));
        particles.addAttribute('vertexColor',new THREE.BufferAttribute(new Float32Array(count*4),4));

        particles.addAttribute('age',new THREE.BufferAttribute(new Float32Array(count*1),1));
        particles.addAttribute('lifespan',new THREE.BufferAttribute(new Float32Array(count*1),1));
        particles.addAttribute('size',new THREE.BufferAttribute(new Float32Array(count*1),1));

        particles.attributes.position.dynamic = true;
        particles.attributes.acceleration.dynamic = true;
        particles.attributes.velocity.dynamic = true;
        particles.attributes.previousPosition.dynamic = true;
        particles.attributes.random.dynamic = true;
        particles.attributes.vertexColor.dynamic = true;
        particles.attributes.age.dynamic = true;
        particles.attributes.lifespan.dynamic = true;
        particles.attributes.size.dynamic = true;

        //default material expects all computation done cpu side, just renders
        // note that since the color, size, spin and orientation are just linear
        // interpolations, they can be done in the shader
        var vertShader_default =
            "attribute float size; \n" +
            "attribute vec4 vertexColor;\n" +
            "varying vec4 vColor;\n" +
            "attribute vec4 random;\n" +
            "varying vec4 vRandom;\n" +
            "uniform float sizeRange;\n" +
            "uniform float screenSize;\n" +
            "uniform vec4 colorRange;\n" +
            "varying vec3 vFogPosition;\n" +
            "void main() {\n" +
            "   vFogPosition = (modelMatrix * vec4(position,1.0)).xyz; \n" +
            "   vColor = vertexColor + (random -0.5) * colorRange;\n" +
            "   vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n" +
            "   float psize = size + (random.y -0.5) * sizeRange;\n" +
            //"   psize *= screenSize;" +
            //"   gl_PointSize = psize * ( 1000.0/ length( mvPosition.xyz ) );\n" +
            "   vec4 p1 = vec4(mvPosition.x+0.5*psize, mvPosition.yzw);\n" +
            "   vec4 p2 = vec4(mvPosition.x-0.5*psize, mvPosition.yzw);\n" +
            "   gl_PointSize = max(1.0, screenSize/2.0 * 1.0/length(mvPosition.xyz) * length(projectionMatrix*p1 - projectionMatrix*p2) ); \n" +
            "   gl_Position = projectionMatrix * mvPosition;\n" +
            "   vRandom = random;" +
            "}    \n";
        var fragShader_default =
            "uniform float useTexture;\n" +
            "uniform sampler2D texture;\n" +
            "varying vec4 vColor;\n" +
            "varying vec4 vRandom;\n" +
            "uniform float time;\n" +
            "uniform float maxSpin;\n" +
            "uniform float minSpin;\n" +
            "uniform float maxOrientation;\n" +
            "uniform float minOrientation;\n" +
            "uniform float textureTiles;\n" +
            "uniform float alphaTest;\n" +
            "varying vec3 vFogPosition;\n" +
            THREE.ShaderChunk.common + "\n" +

            THREE.ShaderChunk.bsdfs + "\n" +
            
            THREE.ShaderChunk.lights_phong_pars_fragment + "\n" +
            THREE.ShaderChunk.fog_pars_fragment + "\n" +

            "void main() {\n" +
            " vec2 coord = vec2(0.0,0.0);" +
            " vec2 orig_coord = vec2(gl_PointCoord.s,1.0-gl_PointCoord.t);" +
            " float spin = mix(maxSpin,minSpin,vRandom.x);" +
            " float orientation = mix(maxOrientation,minOrientation,vRandom.y);" +
            " coord.s = (orig_coord.s-.5)*cos(time*spin+orientation)-(orig_coord.t-.5)*sin(time*spin+orientation);" +
            " coord.t = (orig_coord.t-.5)*cos(time*spin+orientation)+(orig_coord.s-.5)*sin(time*spin+orientation);" +
            " coord = coord + vec2(.5,.5);\n" +
            " coord = coord/textureTiles;\n" +
            " coord.x = clamp(coord.x,0.0,1.0/textureTiles);\n" +
            " coord.y = clamp(coord.y,0.0,1.0/textureTiles);\n" +
            " coord += vec2(floor(vRandom.x*textureTiles)/textureTiles,floor(vRandom.y*textureTiles)/textureTiles);\n" +
            "   vec4 outColor = (vColor * texture2D( texture, coord  )) *useTexture + vColor * (1.0-useTexture);\n" +

            "   gl_FragColor = outColor;\n" +
            THREE.ShaderChunk.fog_fragment + "\n" +
            "}\n";

        //the default shader - the one used by the analytic solver, just has some simple stuff
        //note that this could be changed to do just life and lifespan, and calculate the 
        //size and color from to uniforms. Im not going to bother
        var attributes_default = {
            size:
            {
                type: 'f',
                value: []
            },
            vertexColor:
            {
                type: 'v4',
                value: []
            },
            random:
            {
                type: 'v4',
                value: []
            },

        };
        var uniforms_default = {
            amplitude:
            {
                type: "f",
                value: 1.0
            },
            texture:
            {
                type: "t",
                value: _SceneManager.getTexture("./checker.jpg")
            },
            pCount:
            {
                type: 'f',
                value: 1000
            },
            maxRate:
            {
                type: 'f',
                value: 1000
            },
            useTexture:
            {
                type: "f",
                value: 0.0
            },
            maxSpin:
            {
                type: "f",
                value: 0.0
            },
            minSpin:
            {
                type: "f",
                value: 0.0
            },
            screenSize:
            {
                type: "f",
                value: 0.0
            },
            maxOrientation:
            {
                type: "f",
                value: 0.0
            },
            minOrientation:
            {
                type: "f",
                value: 0.0
            },
            time:
            {
                type: "f",
                value: 0.0
            },
            fractime:
            {
                type: "f",
                value: 0.0
            },
            sizeRange:
            {
                type: "f",
                value: 0.0
            },
            textureTiles:
            {
                type: "f",
                value: 1.0
            },
            colorRange:
            {
                type: 'v4',
                value: new THREE.Vector4(0, 0, 0, 0)
            },
            startColor:
            {
                type: "v4",
                value: new THREE.Vector4(1, 1, 1, 1)
            },
            endColor:
            {
                type: "v4",
                value: new THREE.Vector4(0, 0, 0, 1)
            },
            startSize:
            {
                type: "f",
                value: 1
            },
            endSize:
            {
                type: "f",
                value: 1
            },
            alphaTest:
            {
                type: "f",
                value: .5
            },
        };
        for (var i in THREE.UniformsLib.fog)
        {
            uniforms_default[i] = THREE.UniformsLib.fog[i];
        }
        for (var i in THREE.UniformsLib.lights)
        {
            uniforms_default[i] = THREE.UniformsLib.lights[i];
        }
        uniforms_default.texture.value.wrapS = uniforms_default.texture.value.wrapT = THREE.RepeatWrapping;
        var shaderMaterial_default = new THREE.ShaderMaterial(
        {
            uniforms: uniforms_default,
           
            vertexShader: vertShader_default,
            fragmentShader: fragShader_default

        });
        shaderMaterial_default.fog = true;
        //the interpolate shader blends from one simulation step to the next on the shader
        //this    allows for a complex sim to run at a low framerate, but still have smooth motion
        //this is very efficient, as it only requires sending data up to the gpu on each sim tick        
        //reuse the frag shader from the normal material    
        var vertShader_interpolate =

            "attribute float age; \n" +
            "attribute float lifespan; \n" +
            "attribute vec3 previousPosition;\n" +
            "varying vec4 vColor;\n" +
            "attribute vec4 random;\n" +
            "varying vec4 vRandom;\n" +
            "uniform float sizeRange;\n" +
            "uniform vec4 colorRange;\n" +
            "uniform float fractime;\n" +
            "uniform float startSize;\n" +
            "uniform float endSize;\n" +
            "uniform vec4 startColor;\n" +
            "uniform vec4 endColor;\n" +
            "varying vec3 vFogPosition;\n" +
            "uniform float screenSize;\n" +
            "void main() {\n" +
            "   vColor = mix(startColor,endColor,(age/2.0+fractime)/lifespan) + (random -0.5) * colorRange;\n" +
            "   vFogPosition = (modelMatrix * vec4(mix(previousPosition,position,fractime),1.0)).xyz; \n" +
            "   vec4 mvPosition = modelViewMatrix * vec4(mix(previousPosition,position,fractime), 1.0 );\n" +
            "   float psize = mix(startSize,endSize,(age/2.0+fractime)/lifespan) + (random.y -0.5) * sizeRange;\n" +
            //"   psize *= screenSize;" +
            //"   gl_PointSize = psize * ( 1000.0/ length( mvPosition.xyz ) );\n" +
            "   vec4 p1 = vec4(mvPosition.x+0.5*psize, mvPosition.yzw);\n" +
            "   vec4 p2 = vec4(mvPosition.x-0.5*psize, mvPosition.yzw);\n" +
            "   gl_PointSize = max(1.0, screenSize/2.0 * 1.0/length(mvPosition.xyz) * length(projectionMatrix*p1 - projectionMatrix*p2) ); \n" +
            "   gl_Position = projectionMatrix * mvPosition;\n" +
            "   vRandom = random;" +
            "}    \n";

        //the interpolation does need to remember the previous position
        var attributes_interpolate = {
            random: attributes_default.random,
            previousPosition:
            {
                type: 'v3',
                value: []
            },
            age:
            {
                type: 'f',
                value: []
            },
            lifespan:
            {
                type: 'f',
                value: []
            },
        };

        var shaderMaterial_interpolate = new THREE.ShaderMaterial(
        {
            uniforms: uniforms_default,
            
            vertexShader: vertShader_interpolate,
            fragmentShader: fragShader_default

        });


        //analytic shader does entire simulation on GPU
        //it cannot account for drag, gravity. nor can it generate new randomness. Each particle has it's randomness assigned and it 
        //just repeats the same motion over and over. Also, the other solvers can hold a particle until 
        //it can be reused based on the emitRate. This cannot, as the entire life of the particle must be 
        //computed from an equation given just time t. It does offset them in time to avoid all the particles 
        //being generated at once. Also, it does not account for emitter motion. 
        //upside : very very efficient. No CPU intervention required
        var vertShader_analytic =
            "attribute float size; \n" +
            "attribute vec4 vertexColor;\n" +
            "attribute vec3 acceleration;\n" +
            "attribute vec3 velocity;\n" +
            "attribute float lifespan;\n" +
            "attribute vec4 random;\n" +
            "uniform float time;\n" +
            "uniform float startSize;\n" +
            "uniform float endSize;\n" +
            "uniform vec4 startColor;\n" +
            "uniform vec4 endColor;\n" +
            "uniform float maxRate;\n" +
            "uniform float pCount;\n" +
            "varying vec4 vColor;\n" +
            "varying vec4 vRandom;\n" +
            "uniform float sizeRange;\n" +
            "uniform vec4 colorRange;\n" +
            "varying vec3 vFogPosition;\n" +
            "uniform float screenSize;\n" +
            "void main() {\n" +
            //randomly offset in time
            "   float lifetime = mod(lifespan*random.x*100.0 + time*100.0,lifespan);" +
            //solve for position
            "   vec3 pos2 = position.xyz + velocity*lifetime + (acceleration*lifetime*lifetime)/2.0;" + // ;
            "   vFogPosition = (modelMatrix * vec4(pos2,1.0)).xyz; \n" +
            "   vec4 mvPosition = modelViewMatrix * vec4( pos2.xyz, 1.0 );\n" +
            //find random size based on randomness, start and end size, and size range
            "   float psize = mix(startSize,endSize,lifetime/lifespan) + (random.y -0.5) * sizeRange;\n" +
            //"   psize *= screenSize;" +
            //"   gl_PointSize = psize * ( 1000.0/ length( mvPosition.xyz ) );\n" +
            "   vec4 p1 = vec4(mvPosition.x+0.5*psize, mvPosition.yzw);\n" +
            "   vec4 p2 = vec4(mvPosition.x-0.5*psize, mvPosition.yzw);\n" +
            "   gl_PointSize = max(1.0, screenSize/2.0 * 1.0/length(mvPosition.xyz) * length(projectionMatrix*p1 - projectionMatrix*p2) ); \n" +
            "   gl_Position = projectionMatrix * mvPosition;\n" +
            " vec4 nR = (random -0.5);\n" +
            //find random color based on start and endcolor, time and colorRange
            "   vColor = mix(startColor,endColor,lifetime/lifespan)  +  nR * colorRange;\n" +
            "   vRandom = random;" +
            "}    \n";

        var fragShader_analytic =
            "uniform float useTexture;\n" +
            "uniform sampler2D texture;\n" +
            "uniform float time;\n" +
            "uniform float maxSpin;\n" +
            "uniform float minSpin;\n" +
            "varying vec4 vColor;\n" +
            "varying vec4 vRandom;\n" +
            "uniform float maxOrientation;\n" +
            "uniform float minOrientation;\n" +
            "uniform float textureTiles;\n" +
            "uniform float alphaTest;\n" +
            "varying vec3 vFogPosition;\n" +
            THREE.ShaderChunk.common + "\n" +
            THREE.ShaderChunk.bsdfs + "\n" +
            THREE.ShaderChunk.lights_phong_pars_fragment + "\n" +
            THREE.ShaderChunk.fog_pars_fragment + "\n" +
            "void main() {\n" +

            //bit of drama for dividing into 4 or 9 'virtual' textures
            //nice to be able to have different images on particles
            " vec2 coord = vec2(0.0,0.0);" +
            " vec2 orig_coord = vec2(gl_PointCoord.s,1.0-gl_PointCoord.t);" +
            " float spin = mix(maxSpin,minSpin,vRandom.x);" +
            " float orientation = mix(maxOrientation,minOrientation,vRandom.y);" +
            " coord.s = (orig_coord.s-.5)*cos(time*spin+orientation)-(orig_coord.t-.5)*sin(time*spin+orientation);" +
            " coord.t = (orig_coord.t-.5)*cos(time*spin+orientation)+(orig_coord.s-.5)*sin(time*spin+orientation);" +
            " coord = coord + vec2(.5,.5);\n" +
            " coord = coord/textureTiles;\n" +
            " coord.x = clamp(coord.x,0.0,1.0/textureTiles);\n" +
            " coord.y = clamp(coord.y,0.0,1.0/textureTiles);\n" +
            " coord += vec2(floor(vRandom.x*textureTiles)/textureTiles,floor(vRandom.y*textureTiles)/textureTiles);\n" +

            //get the color from the texture and blend with the vertexColor.
            " vec4 outColor = (vColor * texture2D( texture, coord )) *useTexture + vColor * (1.0-useTexture);\n" +
            " if(outColor.a < alphaTest) discard;\n" +
            "   gl_FragColor = outColor;\n" +
            THREE.ShaderChunk.fog_fragment + "\n" +
            "}\n";
        var attributes_analytic = {
            acceleration:
            {
                type: 'v3',
                value: []
            },
            velocity:
            {
                type: 'v3',
                value: []
            },
            previousPosition: attributes_interpolate.previousPosition,
            age: attributes_interpolate.age,
            lifespan: attributes_interpolate.lifespan,
            random: attributes_default.random,
            vertexColor: attributes_default.vertexColor,
            size: attributes_default.size
        };
        var shaderMaterial_analytic = new THREE.ShaderMaterial(
        {
            uniforms: uniforms_default,
           
            vertexShader: vertShader_analytic,
            fragmentShader: fragShader_analytic
        });

        shaderMaterial_analytic.lights = true;
        shaderMaterial_analytic.fog = true;

        shaderMaterial_interpolate.lights = true;
        shaderMaterial_interpolate.fog = true;

        shaderMaterial_default.lights = true;
        shaderMaterial_default.fog = true;

        // create the particle system
        var particleSystem = new THREE.Points(particles, shaderMaterial_default);
        var self = this;

        this.threeParticleSystem = particleSystem;
        this.geometry = particles;
        //keep track of the shaders
        this.shaderMaterial_analytic = shaderMaterial_analytic;
        this.shaderMaterial_default = shaderMaterial_default;
        this.shaderMaterial_interpolate = shaderMaterial_interpolate;

        this.shaderMaterial_analytic.transparent = true;
        this.shaderMaterial_default.transparent = true;
        this.shaderMaterial_interpolate.transparent = true;

        //setup all the default values
        this.minVelocity = [0, 0, 0];
        this.maxVelocity = [0, 0, 0];
        this.maxAcceleration = [0, 0, 0];
        this.minAcceleration = [0, 0, 0];
        this.minLifeTime = 30;
        this.maxLifeTime = 30;
        this.emitterType = 'point';
        this.emitterSize = [0, 0, 0];
        this.startColor = [1, 1, 1, 1];
        this.endColor = [0, 0, 0, 1];
        this.regenParticles = [];
        this.maxRate = 1;
        this.particleCount = 1000;
        this.damping = 0;
        this.startSize = 1;
        this.endSize = 1;
        this.gravity = 0;
        this.gravityCenter = [0, 0, 0];
        this.velocityMode = 'cartesian';
        this.temp = new THREE.Vector3();
        this.maxSpin = 0;
        this.minSpin = 0;
        this.minOrientation = 0;
        this.maxOrientation = 0;
        this.sizeRange = 0;
        this.colorRange = [0, 0, 0, 0];
        this.gravity = 0;
        this.gravityCenter = [0, 0, 0];
        this.textureTiles = 1;
        this.solver = 'AnalyticShader';
        this.depthTest = true;
        this.opacity = 1;
        this.additive = false;
        this.image = null;

        this.initialized = false;
        this.counter = 0;
        this.testtime = 0;
        this.totaltime = 0;

        this._emitterPosition = new THREE.Vector3(0, 0, 0);
        this._previousEmitterPosition = new THREE.Vector3(0,0,0);

        this.particles = [];
        //Setup some defaults
       

        this.setSolverType('AnalyticShader');

        for(var i = 0; i < count; i++)
        {
            var p = this.createParticle(i);
            this.setupParticle(p,this.threeParticleSystem.matrix);
        }
        this.renderParticles();
        this.update(1);


    }
    ParticleSystem.prototype.renderParticles = function()
    {
        
        for(var i = 0; i < this.particles.length; i++)
        {
            this.particles[i].renderToBuffers();
        }

    }

    //timesliced Euler integrator
    //todo: switch to RK4 
    //This can do more complex sim, maybe even a cloth sim or such. It ticks 10 times a second, and blends tick with previous via a shader
    ParticleSystem.prototype.updateEuler = function(time)
    {
       
        this.threeParticleSystem.material.uniforms.time.value += time / 3333.0;
        //var timer = performance.now();
        var time_in_ticks = time / 100.0;

        if (this.lastTime === undefined) this.lastTime = 0;

        this.lastTime += time_in_ticks; //ticks - Math.floor(ticks);

       // var inv = this.threeParticleSystem.matrix.clone();
       // inv = inv.getInverse(inv);

        var particles = this.particles;

        //timesliced tick give up after 5 steps - just cant go fast enough        
        if (Math.floor(this.lastTime) > 5)
            this.lastTime = 1;

        for (var i = 0; i < Math.floor(this.lastTime); i++)
        {
            this.lastTime--;

            var pCount = this.particles.length;
            while (pCount--)
            {
                var particle = particles[pCount];
                this.updateParticleEuler(particle, this.threeParticleSystem.matrix, null, 3.333);
            }

            //examples developed with faster tick - maxRate *33 is scale to make work 
            //with new timing

            //Reuse up to maxRate particles, sliced for delta_time
            //Once a particle reaches it's end of life, its available to be regenerated.
            //We hold extras in limbo with alpha 0 until they can be regenerated
            //Note the maxRate never creates or destroys particles, just manages when they will restart
            //after dying

            var len = Math.min(this.regenParticles.length, this.maxRate *  1000 * time_in_ticks);
            for (var i = 0; i < len; i++)
            {


                var particle = this.regenParticles.shift();
                particle.waitForRegen = false;
                this.setupParticle(particle, this.threeParticleSystem.matrix);
                this.updateParticleEuler(particle, this.threeParticleSystem.matrix, null, Math.random() * 3.33);
                particle.age = 0;

            }

            //only need to send up the age, position, and previous position. other props handled in the shader


        }


        //even if this is not a sim tick, we need to send the fractional time up to the shader for the interpolation
        this.threeParticleSystem.material.uniforms.fractime.value = this.lastTime;
        this.renderParticles();
    }

    //Update a particle from the Analytic solver
    ParticleSystem.prototype.updateParticleAnalytic = function(particle, mat, inv, delta_time)
    {
       

        if(particle.waitForRegen)
        {
            particle.waitForRegen = true;
            particle.position.x = 0;
            particle.position.y = 10;
            particle.age = 0;
            particle.position.z = 0;
            particle.color.w = 0.0;
            particle.setSize(0);
            particle.dirty();
            particle.setLifespan(1)  

            return;
        }
         particle.age += delta_time;
        //Make the particle dead. Hide it until it can be reused
        if (particle.age < particle.lifespan)
        {
           
            //Run the formula to get position.
           
            var percent = particle.age / particle.lifespan;
            var pa2 = particle.age * particle.age;
            particle.position.x = particle.initialx + (particle.velocity.x * particle.age) + 0.5 * (particle.acceleration.x * pa2)
            particle.position.y = particle.initialy + (particle.velocity.y * particle.age) + 0.5 * (particle.acceleration.y * pa2)
            particle.position.z = particle.initialz + (particle.velocity.z * particle.age) + 0.5 * (particle.acceleration.z * pa2)

            //this.temp.x = particle.world.x;
            //this.temp.y = particle.world.y;
            //this.temp.z = particle.world.z;

            //need to specify in object space, event though comptued in local
            //this.temp.applyMatrix4(inv);
            //particle.position.x = this.temp.x;
            //particle.position.y = this.temp.y;
            //particle.position.z = this.temp.z;

            //Should probably move this to the shader. Linear with time, no point in doing on CPU
            particle.color.x = this.startColor[0] + (this.endColor[0] - this.startColor[0]) * percent;
            particle.color.y = this.startColor[1] + (this.endColor[1] - this.startColor[1]) * percent;
            particle.color.z = this.startColor[2] + (this.endColor[2] - this.startColor[2]) * percent;
            particle.color.w = this.startColor[3] + (this.endColor[3] - this.startColor[3]) * percent;

            particle.setSize(this.startSize);// + (this.endSize - this.startSize) * percent);
            particle.dirty();
        } else {
            this.regenParticles.push(particle);
            particle.waitForRegen = true;
            particle.position.x = 0;
            particle.position.y = 10;
            particle.age = 0;
            particle.position.z = 0;
            particle.color.w = 0.0;
            particle.setSize(0);
            particle.dirty();
        } 
    }

    //updtae a particle with the Euler solver
    ParticleSystem.prototype.updateParticleEuler = function(particle, mat, inv, step_dist)
    {
        

        if(particle.waitForRegen)
        {
            particle.setSize(0);
            particle.dirty();
            return;
        }

        particle.prevage = particle.age;
        particle.age += step_dist;
        particle.setAge(particle.age + step_dist);

        //If the particle is dead ,hide it unitl it can be reused
        if (particle.age/2 <particle.lifespan)
        {

         


            // and the position
            particle.previousPosition.x = particle.position.x;
            particle.previousPosition.y = particle.position.y;
            particle.previousPosition.z = particle.position.z;

            //find direction to center for gravity
            var gravityAccel = new THREE.Vector3(particle.world.x, particle.world.y, particle.world.z);
            gravityAccel.x -= this.gravityCenter[0];
            gravityAccel.y -= this.gravityCenter[1];
            gravityAccel.z -= this.gravityCenter[2];
            var len = gravityAccel.length() + .1;
            gravityAccel.normalize();
            gravityAccel.multiplyScalar(-Math.min(1 / (len * len), 100));
            gravityAccel.multiplyScalar(this.gravity);

            //update position
            particle.world.x += particle.velocity.x * step_dist + (particle.acceleration.x + gravityAccel.x) * step_dist * step_dist;
            particle.world.y += particle.velocity.y * step_dist + (particle.acceleration.y + gravityAccel.y) * step_dist * step_dist;;
            particle.world.z += particle.velocity.z * step_dist + (particle.acceleration.z + gravityAccel.z) * step_dist * step_dist;;

            //update velocity
            particle.velocity.x += (particle.acceleration.x + gravityAccel.x) * step_dist * step_dist;
            particle.velocity.y += (particle.acceleration.y + gravityAccel.y) * step_dist * step_dist;
            particle.velocity.z += (particle.acceleration.z + gravityAccel.z) * step_dist * step_dist

            var damping = 1 - (this.damping * step_dist);

            //drag
            particle.velocity.x *= damping;
            particle.velocity.y *= damping;
            particle.velocity.z *= damping;


            //move from world to local space
            this.temp.x = particle.world.x;
            this.temp.y = particle.world.y;
            this.temp.z = particle.world.z;
            //this.temp.applyMatrix4(inv);
            particle.position.x = this.temp.x;
            particle.position.y = this.temp.y;
            particle.position.z = this.temp.z;
            //careful to have prev and current pos in same space!!!!
            //particle.prevworld.applyMatrix4(inv);
            particle.dirty();
        } else{ 
            this.regenParticles.push(particle);
            particle.waitForRegen = true;
            particle.position.x = 0;
            particle.position.y = 0;
            particle.position.z = 0;
            particle.world.x = 0;
            particle.world.y = 0;
            particle.world.z = 0;
            particle.previousPosition.x = 0;
            particle.previousPosition.y = 0;
            particle.previousPosition.z = 0;
            particle.color.w = 0.0;
            particle.setSize(0);
            particle.dirty();
        }
    }
    ParticleSystem.prototype.update = function(time)
    {

        if (this.threeParticleSystem.visible == false) return;

        if (this.solver == 'Euler')
        {
            this.updateEuler(time);
        }
        if (this.solver == 'Analytic')
        {
            this.updateAnalytic(time);
        }
        if (this.solver == 'AnalyticShader')
        {
            this.updateAnalyticShader(time);
        }
        this.threeParticleSystem.material.uniforms.screenSize.value = parseFloat($('#index-vwf').attr('width'));
        
    }
    //Change the solver type for the system
    ParticleSystem.prototype.setSolverType = function(type)
    {
        this.solver = type;
        if (type == 'Euler')
        {

            this.threeParticleSystem.material = this.shaderMaterial_interpolate;
            this.rebuildParticles();
        }
        if (type == 'Analytic')
        {

            this.threeParticleSystem.material = this.shaderMaterial_default;
            this.rebuildParticles();
        }
        if (type == 'AnalyticShader')
        {

            this.threeParticleSystem.material = this.shaderMaterial_analytic;
            this.rebuildParticles();
        }

    }

    //If you move a system, all the particles need to be recomputed to look like they stick in world space
    //not that we pointedly dont do this for the AnalyticShader. We could, but that solver is ment to  be very high performance, do we dont
    ParticleSystem.prototype.updateTransform = function(newtransform)
    {
        return;
        //Get he current transform, and invert new one
        var inv = new THREE.Matrix4();
        var newt = new THREE.Matrix4();
        inv.elements = matCpy(newtransform);
        newt = newt.copy(this.threeParticleSystem.matrix);
        inv = inv.getInverse(inv);


        //don't adjust for the high performance shader
        if (this.solver == 'AnalyticShader')
        {
            return;
        }

        //Move all particles out of old space to world, then back into new space.
        //this will make it seem like they stay at the correct position in the world, though
        //acutally they change position
        //note that it would actually be more efficient to leave the matrix as identity, and change the position of the 
        //emitters for this...... Could probably handle it in the model setter actually... would be much more efficient, but linking 
        //a system to a moving object would break.
        for (var i = 0; i < this.particles.length; i++)
        {
            this.geometry.vertices[i].applyMatrix4(inv);
            this.geometry.attributes.previousPosition.value[i].applyMatrix4(inv);
            this.geometry.vertices[i].applyMatrix4(newt);
            this.geometry.attributes.previousPosition.value[i].applyMatrix4(newt);
        }
        this.geometry.verticesNeedUpdate = true;
        this.geometry.attributes.previousPosition.needsUpdate = true;
        this.geometry.attributes.vertexColor.needsUpdate = true;
        this.geometry.attributes.size.needsUpdate = true;
        this.geometry.attributes.lifespan.needsUpdate = true;
        this.geometry.attributes.age.needsUpdate = true;

    }
    
    //create a new particle. create and store all the values for vertex attributes in each shader
    ParticleSystem.prototype.createParticle = function(i)
    {
        var particle = new Particle(this, i);
        this.particles.push(particle);
        return particle;
    }

    //Generate a new point in space based on the emitter type and size
    ParticleSystem.prototype.generatePoint = function(point)
    {

        var emit = new THREE.Vector3(0,0,0);
        
        var motion = new THREE.Vector3(0,0,0);
      
        motion.copy(this._emitterPosition).sub(this._previousEmitterPosition);
        motion.multiplyScalar(Math.random());
        emit.sub(motion);
        emit.add(this._emitterPosition);
      

        point.x = 0;
        point.y = 0;
        point.z = 0;
        //generate from a point
        //TODO: specify point?
        if (this.emitterType.toLowerCase() == 'point')
        {
            return point.add(emit);
        }
        //Generate in a box
        //assumes centered at 0,0,0
        if (this.emitterType.toLowerCase() == 'box')
        {
            var x = this.emitterSize[0] * Math.random() - this.emitterSize[0] / 2;
            var y = this.emitterSize[1] * Math.random() - this.emitterSize[1] / 2;
            var z = this.emitterSize[2] * Math.random() - this.emitterSize[2] / 2;

            return point.set(x, y, z).add(emit);
        }
        //Generate in a sphere
        //assumes centered at 0,0,0
        if (this.emitterType.toLowerCase() == 'sphere')
        {
            var u2 = Math.random();
            u2 = Math.pow(u2, 1 / 3);
            var o = this.emitterSize[0] * Math.random() * Math.PI * 2;
            var u = this.emitterSize[1] * Math.random() * 2 - 1;
            var r = this.emitterSize[2] * u2;
            var x = Math.cos(o) * Math.sqrt(1 - (u * u));
            var y = Math.sin(o) * Math.sqrt(1 - (u * u));
            var z = u;


            return point.set(x, y, z).setLength(r).add(emit);
        }

    }
    ParticleSystem.prototype.initialize = function()
    {
        this.initialized = true;
        this.rebuildParticles();
    }
    //setup the particles with new values
    ParticleSystem.prototype.rebuildParticles = function()
    {
        if(!this.initialized) return;
        var count = this.solver == "AnalyticShader" ? this.particles.length : Math.floor(this.maxRate * 3);
        for (var i = 0; i < count && i < this.particles.length; i++)
        {
            this.setupParticle(this.particles[i], this.threeParticleSystem.matrix);
            this.particles[i].waitForRegen = false;
            this.particles[i].dirty();
        }
        this.regenParticles.length = 0;
        for (var i = count; i < this.particles.length; i++)
        {
            this.particles[i].waitForRegen = true;
            this.regenParticles.push(this.particles[i]);

        }
        this.renderParticles();
    }
    //set the particles initial values. Used when creating and resuing particles
    ParticleSystem.prototype.setupParticle = function(particle, mat)
    {   
     
        

        particle.position.x = 0;
        particle.position.y = 0;
        particle.position.z = 0;

        //generate a point in objects space, the move to world space
        //dont do if in analytic shader mode
        this.generatePoint(particle.world);
        if (this.solver != "AnalyticShader")
        {
            //particle.world.applyMatrix4(mat);
        }


        //back up initial (needed by the analyticShader)
        particle.initialx = particle.world.x;
        particle.initialy = particle.world.y;
        particle.initialz = particle.world.z;

        //start at initial pos
        particle.position.x = particle.initialx;
        particle.position.y = particle.initialy;
        particle.position.z = particle.initialz;


        //start stoped, age 0
        particle.age = 0;
        particle.velocity.set(0, 0, 0);
        particle.acceleration.set(0, 0, 0);
      //  particle.setLifespan(this.minLifeTime + (this.maxLifeTime - this.minLifeTime) * Math.random());

        //Generate the initial velocity
        //In this mode, you specify a min and max x,y,z
        if (this.velocityMode == 'cartesian')
        {
            particle.velocity.x = this.minVelocity[0] + (this.maxVelocity[0] - this.minVelocity[0]) * Math.random();
            particle.velocity.y = this.minVelocity[1] + (this.maxVelocity[1] - this.minVelocity[1]) * Math.random();
            particle.velocity.z = this.minVelocity[2] + (this.maxVelocity[2] - this.minVelocity[2]) * Math.random();
        }
        //In this mode, you give a pitch and yaw from 0,1, and a min and max length.
        //This is easier to emit into a circle, or a cone section
        if (this.velocityMode == 'spherical')
        {

            //random sphercial points concentrate at poles
            /* var r = this.minVelocity[2] + (this.maxVelocity[2] - this.minVelocity[2]) * Math.random();
                    var t = this.minVelocity[1] + (this.maxVelocity[1] - this.minVelocity[1]) * Math.random() * Math.PI*2;
                    var w = this.minVelocity[0] + (this.maxVelocity[0] - this.minVelocity[0]) * Math.random() * Math.PI - Math.PI/2;
                    particle.velocity.x = r * Math.sin(t)*Math.cos(w);
                    particle.velocity.y = r * Math.sin(t)*Math.sin(w);
                    particle.velocity.z = r * Math.cos(t); */

            //better distribution
            var o = this.minVelocity[0] + (this.maxVelocity[0] - this.minVelocity[0]) * Math.random() * Math.PI * 2;
            var u = this.minVelocity[1] + (this.maxVelocity[1] - this.minVelocity[1]) * Math.random() * 2 - 1;
            var u2 = Math.random();
            u2 = Math.pow(u2, 1 / 3);
            var r = this.minVelocity[2] + (this.maxVelocity[2] - this.minVelocity[2]) * u2;
            particle.velocity.x = Math.cos(o) * Math.sqrt(1 - (u * u));
            particle.velocity.y = Math.sin(o) * Math.sqrt(1 - (u * u));
            particle.velocity.z = u;
            particle.velocity.setLength(r);
        }

        //The velocity should be in world space, but is generated in local space for 
        //ease of use
        //removeing - global space velocity maks little sense
        /*   mat = mat.clone();
                mat.elements[12] = 0;
                mat.elements[13] = 0;
                mat.elements[14] = 0;
                particle.velocity.applyMatrix4(mat);
             */
        //accelerations are always world space, just min and max on each axis
        particle.acceleration.x = this.minAcceleration[0] + (this.maxAcceleration[0] - this.minAcceleration[0]) * Math.random();
        particle.acceleration.y = this.minAcceleration[1] + (this.maxAcceleration[1] - this.minAcceleration[1]) * Math.random();
        particle.acceleration.z = this.minAcceleration[2] + (this.maxAcceleration[2] - this.minAcceleration[2]) * Math.random();
        particle.setLifespan(this.minLifeTime + (this.maxLifeTime - this.minLifeTime) * Math.random());

        //color is start color
        particle.color.x = this.startColor[0];
        particle.color.y = this.startColor[1];
        particle.color.z = this.startColor[2];
        particle.color.w = this.startColor[3];


      
        //randomly move the particle up to one step in time
        particle.previousPosition.x = particle.position.x;
        particle.previousPosition.y = particle.position.y;
        particle.previousPosition.z = particle.position.z;
        
    }
    //In Analytic mode, run the equation for the position
    ParticleSystem.prototype.updateAnalytic = function(time)
    {


        this.threeParticleSystem.material.uniforms.time.value += time / 3333.0;

        var time_in_ticks = time / 33.333;

        //var inv = this.threeParticleSystem.matrix.clone();
        //inv = inv.getInverse(inv);

        var particles = this.particles;

      

        //examples developed with faster tick - maxrate *33 is scale to make work 
        //with new timing
        //Reuse up to maxRate particles, sliced for delta_time
        //Once a particle reaches it's end of life, its available to be regenerated.
        //We hold extras in limbo with alpha 0 until they can be regenerated
        //Note the maxRate never creates or destroys particles, just manages when they will restart
        //after dying
        var len = Math.min(this.regenParticles.length,   this.maxRate * 15 * time_in_ticks);


       
        for (var i = 0; i < len; i++)
        {

            //setup with new random values, and move randomly forward in time one step    
            var particle = this.regenParticles.shift();
            this.setupParticle(particle, this.threeParticleSystem.matrix);
            particle.waitForRegen = false;
            if (this.maxRate < this.particleCount)
                this.updateParticleAnalytic(particle, this.threeParticleSystem.matrix, null, Math.random() * 3.33);
            particle.age = 0;
            particle.dirty();
        }

          //update each particle
       
        for (var i = 0; i < particles.length; i++)
        {
            var particle = particles[i];
            this.updateParticleAnalytic(particle, this.threeParticleSystem.matrix, null, time_in_ticks);
        }
        this.renderParticles();

    }
    //when updating in AnalyticShader mode, is very simple, just inform the shader of new time.
    ParticleSystem.prototype.updateAnalyticShader = function(time)
    {
        this.threeParticleSystem.material.uniforms.time.value += time / 3333.0;
    }


    window.particleRegistry = {};

    function particleSystemNode(childID, childSource, childName)
    {

       
        particleRegistry[childID] = this;
        this.ps = new ParticleSystem(1000);

        this.inherits = ['vwf/model/threejs/transformable.js', 'vwf/model/threejs/visible.js', 'vwf/model/threejs/renderDepth.js'];
        //the node constructor
        this.deletingNode = function()
        {

            delete particleRegistry[this.ID];
        }
        this.settingProperty = function(propertyName, propertyValue)
        {


            var particles = this.ps.particles;
            if (propertyName == 'quaternion') return;
            if (propertyName == 'rotation') return;


            if (propertyName == "particleCount" && propertyValue != this.ps[propertyName])
            {

                var propbackup = Engine.getProperties(this.ID);
                delete propbackup.particleCount;
                var oldSolver = propbackup.solver;
                delete propbackup.solver;
                this.ps.threeParticleSystem.geometry.dispose();
                var oldparent = this.ps.threeParticleSystem.parent;
                this.ps.threeParticleSystem.parent.remove(this.ps.threeParticleSystem)
                this.ps = new ParticleSystem(propertyValue);
                this.ps.particleCount = propertyValue;
                
                this.ps.setSolverType(oldSolver);
                oldparent.add(this.ps.threeParticleSystem);
                oldparent.updateMatrixWorld(true);
                for (var i in propbackup)
                {
                    this.settingProperty(i, propbackup[i]);
                }
            }
            if (propertyName == "solver" && propertyValue != this.ps[propertyName])
            {

                var propbackup = Engine.getProperties(this.ID);
                delete propbackup.solver;
                var oldCount = propbackup.particleCount || this.ps.particleCount;

                delete propbackup.particleCount;
                this.ps.threeParticleSystem.geometry.dispose();
                var oldparent = this.ps.threeParticleSystem.parent;
                this.ps.threeParticleSystem.parent.remove(this.ps.threeParticleSystem)
                this.ps = new ParticleSystem(oldCount);
                
                this.ps.setSolverType(propertyValue);

                oldparent.add(this.ps.threeParticleSystem);
                oldparent.updateMatrixWorld(true);
                for (var i in propbackup)
                {
                    this.settingProperty(i, propbackup[i]);
                }

            }
            this.ps[propertyName] = propertyValue;


            if (propertyName == 'size')
            {
                //this.ps.material.size = propertyValue;

                for (var i = 0; i < this.ps.particles.length; i++)
                {
                    this.ps.particles[i].size = propertyValue;
                    this.ps.particles[i].sizeDirty = true;
                }
                this.ps.renderParticles();
            }
           
            else if (propertyName == 'emitterPosition')
            {
                this.ps._previousEmitterPosition.copy(this.ps._emitterPosition);
                this.ps._emitterPosition.x = propertyValue[0];
                this.ps._emitterPosition.y = propertyValue[1];
                this.ps._emitterPosition.z = propertyValue[2];

            }
            else if (propertyName == 'startSize')
            {
                this.ps.shaderMaterial_analytic.uniforms.startSize.value = propertyValue;
            }
            else if (propertyName == 'endSize')
            {
                this.ps.shaderMaterial_analytic.uniforms.endSize.value = propertyValue;
            }
            else if (propertyName == 'sizeRange')
            {
                this.ps.shaderMaterial_analytic.uniforms.sizeRange.value = propertyValue;
            }
            else if (propertyName == 'maxRate')
            {
                this.ps.shaderMaterial_analytic.uniforms.maxRate.value = propertyValue;
            }
            else if (propertyName == 'particleCount')
            {
                this.ps.shaderMaterial_analytic.uniforms.pCount.value = propertyValue;
            }
            else if (propertyName == 'maxSpin')
            {
                this.ps.shaderMaterial_analytic.uniforms.maxSpin.value = propertyValue;
            }
            else if (propertyName == 'textureTiles')
            {
                this.ps.shaderMaterial_analytic.uniforms.textureTiles.value = propertyValue;
            }
            else if (propertyName == 'minSpin')
            {
                this.ps.shaderMaterial_analytic.uniforms.minSpin.value = propertyValue;
            }
            else if (propertyName == 'maxOrientation')
            {
                this.ps.shaderMaterial_analytic.uniforms.maxOrientation.value = propertyValue;
            }
            else if (propertyName == 'minOrientation')
            {
                this.ps.shaderMaterial_analytic.uniforms.minOrientation.value = propertyValue;
            }
            else if (propertyName == 'alphaTest')
            {
                this.ps.shaderMaterial_analytic.uniforms.alphaTest.value = propertyValue;
            }


            else if (propertyName == 'colorRange')
            {
                this.ps.shaderMaterial_analytic.uniforms.colorRange.value.x = propertyValue[0];
                this.ps.shaderMaterial_analytic.uniforms.colorRange.value.y = propertyValue[1];
                this.ps.shaderMaterial_analytic.uniforms.colorRange.value.z = propertyValue[2];
                this.ps.shaderMaterial_analytic.uniforms.colorRange.value.w = propertyValue[3];
            }


            else if (propertyName == 'startColor')
            {
                this.ps.shaderMaterial_analytic.uniforms.startColor.value.x = propertyValue[0];
                this.ps.shaderMaterial_analytic.uniforms.startColor.value.y = propertyValue[1];
                this.ps.shaderMaterial_analytic.uniforms.startColor.value.z = propertyValue[2];
                this.ps.shaderMaterial_analytic.uniforms.startColor.value.w = propertyValue[3];
            }
            else if (propertyName == 'endColor')
            {
                this.ps.shaderMaterial_analytic.uniforms.endColor.value.x = propertyValue[0];
                this.ps.shaderMaterial_analytic.uniforms.endColor.value.y = propertyValue[1];
                this.ps.shaderMaterial_analytic.uniforms.endColor.value.z = propertyValue[2];
                this.ps.shaderMaterial_analytic.uniforms.endColor.value.w = propertyValue[3];
            }


            else if (propertyName == 'solver')
            {

                // this.ps.setSolverType(propertyValue)
            }
            else if (propertyName == 'image')
            {
                this.ps.shaderMaterial_default.uniforms.texture.value = _SceneManager.getTexture(propertyValue);
                this.ps.shaderMaterial_default.uniforms.useTexture.value = 1.0;
                this.ps.shaderMaterial_analytic.uniforms.texture.value = _SceneManager.getTexture(propertyValue);
                this.ps.shaderMaterial_analytic.uniforms.useTexture.value = 1.0;

            }
            else if (propertyName == 'additive')
            {
                if (propertyValue)
                {
                    this.ps.shaderMaterial_default.blending = THREE.AdditiveBlending;
                    this.ps.shaderMaterial_default.transparent = true;
                    this.ps.shaderMaterial_analytic.blending = THREE.AdditiveBlending;
                    this.ps.shaderMaterial_analytic.transparent = true;
                    this.ps.shaderMaterial_interpolate.blending = THREE.AdditiveBlending;
                    this.ps.shaderMaterial_interpolate.transparent = true;
                    this.ps.shaderMaterial_interpolate.fog = false;
                    this.ps.shaderMaterial_analytic.fog = false;
                    this.ps.shaderMaterial_default.fog = false;

                }
                else
                {
                    this.ps.shaderMaterial_default.blending = THREE.NormalBlending;
                    this.ps.shaderMaterial_default.transparent = true;
                    this.ps.shaderMaterial_analytic.blending = THREE.NormalBlending;
                    this.ps.shaderMaterial_analytic.transparent = true;
                    this.ps.shaderMaterial_interpolate.blending = THREE.NormalBlending;
                    this.ps.shaderMaterial_interpolate.transparent = true;
                    this.ps.shaderMaterial_interpolate.fog = true;
                    this.ps.shaderMaterial_analytic.fog = true;
                    this.ps.shaderMaterial_default.fog = true;

                }

                this.ps.shaderMaterial_default.needsUpdate = true;
                this.ps.shaderMaterial_analytic.needsUpdate = true;
                this.ps.shaderMaterial_interpolate.needsUpdate = true;
            }
            else if (propertyName == 'depthTest')
            {
                this.ps.shaderMaterial_default.depthTest = true;
                this.ps.shaderMaterial_default.depthWrite = propertyValue;
                this.ps.shaderMaterial_analytic.depthTest = true;
                this.ps.shaderMaterial_analytic.depthWrite = propertyValue;
                this.ps.shaderMaterial_interpolate.depthTest = true;
                this.ps.shaderMaterial_interpolate.depthWrite = propertyValue;

                this.ps.shaderMaterial_default.needsUpdate = true;
                this.ps.shaderMaterial_analytic.needsUpdate = true;
                this.ps.shaderMaterial_interpolate.needsUpdate = true;
            }
            else if (propertyName == "minAcceleration" || propertyName == "maxAcceleration")
            {
                if (!this.ps.minAcceleration) this.ps.minAcceleration = [0, 0, 0];
                if (!this.ps.maxAcceleration) this.ps.maxAcceleration = [0, 0, 0];

                for (var i = 0; i < particles.length; i++)
                {
                    particles[i].acceleration.x = this.ps.minAcceleration[0] + (this.ps.maxAcceleration[0] - this.ps.minAcceleration[0]) * Math.random();
                    particles[i].acceleration.y = this.ps.minAcceleration[1] + (this.ps.maxAcceleration[1] - this.ps.minAcceleration[1]) * Math.random();
                    particles[i].acceleration.z = this.ps.minAcceleration[2] + (this.ps.maxAcceleration[2] - this.ps.minAcceleration[2]) * Math.random();
                    particles[i].accelerationDirty = true;
                }
                this.ps.renderParticles();
            }
            else if (propertyName == "minVelocity" || propertyName == "maxVelocity")
            {
                if (!this.ps.minVelocity) this.ps.minVelocity = [0, 0, 0];
                if (!this.ps.maxVelocity) this.ps.maxVelocity = [0, 0, 0];

                for (var i = 0; i < particles.length; i++)
                {

                    particles[i].velocity.x = this.ps.minVelocity[0] + (this.ps.maxVelocity[0] - this.ps.minVelocity[0]) * Math.random();
                    particles[i].velocity.y = this.ps.minVelocity[1] + (this.ps.maxVelocity[1] - this.ps.minVelocity[1]) * Math.random();
                    particles[i].velocity.z = this.ps.minVelocity[2] + (this.ps.maxVelocity[2] - this.ps.minVelocity[2]) * Math.random();
                    particles[i].velocityDirty = true;
                }
                this.ps.renderParticles();
            }
            else if (propertyName == "minLifeTime" || propertyName == "maxLifeTime")
            {
                if (this.ps.minLifeTime === undefined) this.ps.minLifeTime = 0;
                if (this.ps.maxLifeTime === undefined) this.ps.maxLifeTime = 1;

                for (var i = 0; i < particles.length; i++)
                {
                    particles[i].lifespan = this.ps.minLifeTime + (this.ps.maxLifeTime - this.ps.minLifeTime) * Math.random();
                    particles[i].lifespanDirty = true;
                }
                this.ps.renderParticles();
            }

            if (propertyName == 'maxVelocity' ||
                propertyName == 'minVelocity' ||
                propertyName == 'maxAcceleration' ||
                propertyName == 'minAcceleration' ||
                propertyName == 'emitterType' ||
                (propertyName == 'emitterSize' && this.ps.solver == 'AnalyticShader') ||
                (propertyName == 'emitterPosition' && this.ps.solver == 'AnalyticShader') ||
                propertyName == 'maxLifeTime' ||
                propertyName == 'minLifeTime' ||
                propertyName == 'velocityMode' ||
                propertyName == 'maxRate'

            )
            {

                this.ps.rebuildParticles();

            }

        }
        this.update = function(time)
        {
            this.ps.update(time);
        }
        this.initializingNode = function() {

            this.ps.initialize();
        }
        this.gettingProperty = function(propertyName)
        {
            if (this.ps.hasOwnProperty(propertyName))
                return this.ps[propertyName];
        }
        this.callingMethod = function(name, args)
        {
            if (name == 'reset')
            {
                if (this.ps.solver == 'AnalyticShader')
                    this.ps.shaderMaterial_analytic.uniforms.time.value = 0;
                else
                    this.ps.rebuildParticles();
            }
        }
        //must be defined by the object
        this.getRoot = function()
        {
            return this.rootnode;
        }
        this.rootnode = new THREE.Object3D();
        this.rootnode.matrixAutoUpdate = false;
        this.rootnode.add(this.ps.threeParticleSystem);
        //this.Build();
    }
    //default factory code
    return function(childID, childSource, childName)
    {
        //name of the node constructor
        return new particleSystemNode(childID, childSource, childName);
    }
})();

//@ sourceURL=threejs.subdriver.particleSystem
