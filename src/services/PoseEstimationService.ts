// src/services/pose-estimation.service.ts

import * as posenet from '@tensorflow-models/posenet';
import * as tf from '@tensorflow/tfjs';

tf.setBackend('webgl');

export class PoseEstimationService {
  private net: posenet.PoseNet | null = null;

  constructor() {
    this.loadModel();
  }

  async loadModel() {
    this.net = await posenet.load();
  }

  async estimatePose(imageElement: HTMLImageElement | HTMLVideoElement) {
    if (!this.net){
      throw new Error('Model not loaded1');
    }
    const pose = await this.net.estimateSinglePose(imageElement, {
      flipHorizontal: false,
    });
    return pose;
  }

  async ensureModelLoaded() {
    if (!this.net) {
      await this.loadModel();
    }
  }

  drawSkeleton(keypoints: any[], context: CanvasRenderingContext2D) {
    const skeletonStructure = [
      ['leftHip', 'leftShoulder'],
      ['leftElbow', 'leftShoulder'],
      ['leftElbow', 'leftWrist'],
      ['leftHip', 'leftKnee'],
      ['leftKnee', 'leftAnkle'],
      ['rightHip', 'rightShoulder'],
      ['rightElbow', 'rightShoulder'],
      ['rightElbow', 'rightWrist'],
      ['rightHip', 'rightKnee'],
      ['rightKnee', 'rightAnkle'],
      ['leftShoulder', 'rightShoulder'],
      ['leftHip', 'rightHip']
    ];

    keypoints.forEach(keypoint => {
      context.beginPath();
      context.arc(keypoint.position.x, keypoint.position.y, 3, 0, 2 * Math.PI);
      context.fillStyle = 'aqua';
      context.fill();
    });

    skeletonStructure.forEach(bone => {
      let startPoint = keypoints.find(keypoint => keypoint.part === bone[0]);
      let endPoint = keypoints.find(keypoint => keypoint.part === bone[1]);

      if (startPoint && endPoint) {
        context.beginPath();
        context.moveTo(startPoint.position.x, startPoint.position.y);
        context.lineTo(endPoint.position.x, endPoint.position.y);
        context.strokeStyle = 'aqua';
        context.stroke();
      }
    });
  }
}
