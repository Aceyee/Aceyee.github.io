import Config from './config.js';
import {Chip, Circuit, Cannonball, Explosion} from './module.js';
import {drawVertices, drawVerticesAfter} from './utils.js';

var config = new Config();
var chipMain = new Chip('chipMain');
var circuit = new Circuit(chipMain, config);

for(let i =0; i<circuit.paths.length; i++){
    let pathIntro = circuit.paths[i];
    for(let j=0; j<pathIntro.length; j++){
        let path = pathIntro[j];
        drawVertices(svg1, path.points, path.length, path.brightness, 
            path.moveCircleH, path.moveCircleV, path.slopeFix);
    }
}

var canvas = config.canvas;
var c = config.c;

var cannonballs = [];
var explosions = [];
var input = false;
var end = false;
var count = 0;
const period = 10;

const cannonballColor = "aqua";


function animate() {
    window.requestAnimationFrame(animate);
    c.fillRect(0, 0, canvas.width, canvas.height);
  
    if (!end) {
      for (let i = 0; i < circuit.pathsSparking.length; i++) {
        let path = circuit.pathsSparking[i];
        cannonballs.push(new Cannonball(canvas.width / 2, canvas.height / 2, 2, cannonballColor, path, circuit.dashesSparking[i]));
      }
    }
    end = true;
  
    //update cannonbals, and create new Explosion after every period
    for (let i = 0; i < cannonballs.length; i++) {
      cannonballs[i].update();
      if (count % period == 0) {
        explosions.push(new Explosion(cannonballs[i]));
      }
      if (cannonballs[i].destroy) {
        cannonballs.splice(i, 1);
      }
    }
  
    //update explosions, each explosion will create several particles,
    //if all partcicles are done, delete this explosion
    for (let i = 0; i < explosions.length; i++) {
      explosions[i].update();
      if (explosions[i].particles.length <= 0) {
        explosions.splice(i, 1);
      }
    }
  
    if (explosions.length <= 0) {
      if (cannonballs.length < 3) {
        $(svg1after).empty();
        let index = Math.floor(Math.random() * 4);
        for (let i = 0; i < 3; i++) {
          let path = circuit.randomPaths[index][i];
          cannonballs.push(new Cannonball(canvas.width / 2, canvas.height / 2, 2, cannonballColor, path.points, path.length));
          drawVerticesAfter(svg1after, path.points, path.length, "bright", path.moveCircleH, path.moveCircleV, path.slopeFix, false);
        }
        input = true;
      }
    }
  
    if (input) {
      if (cannonballs.length < 3) {
        let index = Math.floor(Math.random() * 4);
        for (let i = 0; i < 3; i++) {
          let path = circuit.randomPathsReverse[index][i];
          cannonballs.push(new Cannonball(canvas.width / 2, canvas.height / 2, 2, cannonballColor, path.points, path.length));
          drawVerticesAfter(svg1after, path.points, path.length, "bright", path.moveCircleH, path.moveCircleV, path.slopeFix, true);
        }
        input = false;
      }
    }
  
    if (count < 1000) {
      count++;
    } else {
      count = 0;
    }
  }
  animate();