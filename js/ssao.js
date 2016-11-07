//Taken from: https://github.com/mrdoob/three.js/blob/master/examples/webgl_postprocessing_ssao.html

function initPostprocessing() {
    postprocessing = { enabled : true, renderMode: 0 }; // renderMode: 0('framebuffer'), 1('onlyAO')
    // Setup render pass
    var renderPass = new THREE.RenderPass( scene, camera );
    // Setup depth pass
    depthMaterial = new THREE.MeshDepthMaterial();
    depthMaterial.depthPacking = THREE.RGBADepthPacking;
    depthMaterial.blending = THREE.NoBlending;
    var pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter };
    depthRenderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, pars );
    // Setup SSAO pass
    ssaoPass = new THREE.ShaderPass( THREE.SSAOShader );
    ssaoPass.renderToScreen = true;
    //ssaoPass.uniforms[ "tDiffuse" ].value will be set by ShaderPass
    ssaoPass.uniforms[ "tDepth" ].value = depthRenderTarget.texture;
    ssaoPass.uniforms[ 'size' ].value.set( window.innerWidth, window.innerHeight );
    ssaoPass.uniforms[ 'cameraNear' ].value = camera.near;
    ssaoPass.uniforms[ 'cameraFar' ].value = camera.far;
    ssaoPass.uniforms[ 'onlyAO' ].value = ( postprocessing.renderMode == 1 );
    ssaoPass.uniforms[ 'aoClamp' ].value = 0.3;
    ssaoPass.uniforms[ 'lumInfluence' ].value = 0.5;
    // Add pass to effect composer
    effectComposer = new THREE.EffectComposer( renderer );
    effectComposer.addPass( renderPass );
    effectComposer.addPass( ssaoPass );
}

