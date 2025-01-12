import "../styles/TreePage.css";
import Webcam from "react-webcam";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

interface WebcamPageProps {
  style?: React.CSSProperties;
  size: {
    width: number;
    height: number;
  };
}

export interface WebcamContainerRef {
  capture: () => string | null;
}

const WebcamContainer = forwardRef<WebcamContainerRef, WebcamPageProps>(({ style, size }: WebcamPageProps, ref) => {
  const { width, height } = size;
  const videoConstraints = {
    width,
    height,
    facingMode: "user",
  };

  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    if (!webcamRef.current) {
      return null;
    }
    const imageSrc = webcamRef.current.getScreenshot();

    return imageSrc;
  }, [webcamRef]);

  useImperativeHandle(ref, () => ({
    capture,
  }));

  return (
    <Webcam
      ref={webcamRef}
      style={style}
      audio={false}
      width={width}
      height={height}
      screenshotFormat="image/png"
      videoConstraints={videoConstraints}
      mirrored
    />
  );
});

export default WebcamContainer;
