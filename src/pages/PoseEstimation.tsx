// src/pages/pose-estimation/pose-estimation.page.ts

import React, {useRef, useEffect} from 'react';
import { IonButton, IonContent, IonPage, IonText } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { PoseEstimationService } from "/home/sudarshan/projects/yoga/src/services/PoseEstimationService";
import './PoseEstimation.css';

const PoseEstimation: React.FC = () => {
  const history = useHistory();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poseEstimationService = new PoseEstimationService();

  useEffect(() => {
    poseEstimationService.ensureModelLoaded();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play();
          analyzePose();
        };
      });
    }
  }, []);

  const analyzePose = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    console.log("canvas", canvas);
    if (video && canvas) {
      const pose = await poseEstimationService.estimatePose(video);
      console.log("pose", pose);
      const context = canvas.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        poseEstimationService.drawSkeleton(pose.keypoints, context);
      }
      requestAnimationFrame(analyzePose);
    }
  };


    return (
      <IonPage>
        <IonContent>
          <div style = {{position: 'relative', width: '640px', height: '480px'}}>
            <video ref={videoRef} width="640" height="480" autoPlay playsInline muted style={{position: 'absolute', top: 0, left: 0}} />
            <canvas ref = {canvasRef} width="640" height="480" style={{position: 'absolute', top: 0, left: 0}}/>
          </div>
        </IonContent>
      </IonPage>
    );
  };
  

export default PoseEstimation;