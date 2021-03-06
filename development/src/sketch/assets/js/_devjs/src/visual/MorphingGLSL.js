/**
 * fileOverview:
 * Project: GLSL Morphing
 * File: MorphingGLSL
 * Date: 19/5/6
 * Author: Teraguchi
 */

'use strict';
import * as THREE from 'three';

export default class MorphingGLSL {

  constructor() {

    this.canvas = document.getElementById('webgl-output');
		this.canvasEl = $('#MorphingGLSL #webgl-output');

		this.width = 512;
		this.height = 512;
		this.ratio = 1.0;

		/**
		 *
		 * @type {PerspectiveCamera}
		 */
		this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 1, 1000);

		/**
		 *
		 * @type {Scene}
		 */
		this.scene = new THREE.Scene();

		/**
		 *
		 * @type {WebGLRenderer}
		 */
		this.renderer = new THREE.WebGLRenderer({
			alpha              : false,
			antialias          : false,
			stencil            : false,
			depth              : true,
			premultipliedAlpha : true,
			canvas: this.canvas
		});

		this.timeLoad = this.timePrev = performance.now();

		this.draw = this._draw.bind(this);

		this.uniforms = {};
		this.u_time = null;
		this.textureUnit = null;
		this.mesh = null;
		this.createMesh = this._createMesh.bind(this);

    this.onResize = this._onResize.bind(this);
		this.Update = this._Update.bind(this);
		this.loadTexture = this._loadTexture.bind(this);


  }


  /**
   * 初期化
   */
  init(){

		this.camera.position.x = 0;
		this.camera.position.y = 0;
		this.camera.position.z = 5;
		this.camera.lookAt(new THREE.Vector3(0,0,0));

		this.renderer.setClearColor(0x010c22, 0.0);
		this.renderer.setPixelRatio(window.devicePixelRatio || 1);
		this.renderer.setSize(this.width, this.height);


		let retina = window.devicePixelRatio;
		if(retina < 2) {
			// window.console.log('Retinaディスプレイとかの高解像度ではないです。');
			this.ratio = 1.0;
		} else if(retina >= 2) {
			// window.console.log('Retinaディスプレイとかの高解像度です！');
			this.ratio = 2.0;
		}

		this.mesh = this.createMesh();
		this.mesh.scale.set(512, 512, 512);
		this.scene.add(this.mesh);
		this.Update();

  }

	/**
	 * 再描画
	 * @private
	 */
	_draw(){
		this.renderer.render(this.scene, this.camera);
	}

	/**
	 *
	 * @returns {pe.params.Mesh|{}|Aa|*|Ln.params.Mesh|Mt}
	 * @private
	 */
	_createMesh() {

		this.uniforms = {
			u_time: { type: "f", value: 1.0 },
			// u_resolution: { type: "v2", value: new THREE.Vector2() },
			u_resolution: { type: "v2", value: new THREE.Vector2(this.width, this.height) },
			// textureUnit: { type: 't', value: this.textureUnit },
			// u_time: { type: "f", value: this.u_time },
			// u_time: { type: "f", value: 0 },
			// u_resolution: { type: "v2", value: new THREE.Vector2(this.width * this.ratio, this.height * this.ratio) },
			u_ratio: { type: "1f", value: this.ratio }
		};
		return new THREE.Mesh(
			new THREE.PlaneBufferGeometry(2, 2),
			new THREE.RawShaderMaterial({
				uniforms: this.uniforms,
				vertexShader: require('../../../../glsl/MorphingGLSL.vert'),
				fragmentShader: require('../../../../glsl/MorphingGLSL.frag'),
			})
		);

	}

	/**
	 * 更新
	 * @private
	 */
	_Update() {

		// let speed += 1;
		// this.uniforms.u_time.value += 0.05;
		// this.uniforms.u_time.value += 1;
		// let now = performance.now();
		// this.uniforms.u_time.value = (now - this.timeLoad) / 1000.0;

		this.uniforms.u_time.value += 0.05;

		this.renderer.render(this.scene, this.camera);

		requestAnimationFrame( () => {
			this.Update();
		});

	}

	/**
	 * 画像をロード
	 * @private
	 */
	_loadTexture(image, callback) {

		let that = this;
		const loader = new THREE.TextureLoader();
		loader.load(image, (texture) => {
			texture.magFilter = THREE.NearestFilter;
			texture.minFilter = THREE.NearestFilter;
			that.textureUnit = texture;
			this.mesh = this.createMesh();
			this.mesh.scale.set(512, 512, 512);
			callback();
		})

	}


  /**
   *　画面リサイズイベント
   */
  _onResize() {

		this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight;

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

  }

  onLoad() {
		// this.mesh = this.createMesh();
		// this.mesh.scale.set(512, 512, 512);
	}

	setEvents() {

    $(window).on('load', this.onLoad.bind(this));

  }

}
