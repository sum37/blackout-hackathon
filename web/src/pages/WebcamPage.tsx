import "../styles/TreePage.css";
import BackHeader from "../components/BackHeader";
import Webcam from "react-webcam";
import { useCallback, useEffect, useRef, useState } from "react";

interface WebcamPageProps {
  size: {
    width: number;
    height: number;
  };
}

const WebcamPage = ({ size }: WebcamPageProps) => {
  const { width, height } = size;
  console.log(width, height);
  const videoConstraints = {
    width,
    height,
    facingMode: "user",
  };

  const [testCapturedImage, setTestCapturedImage] = useState<string | null>(
    null,
  );

  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    if (!webcamRef.current) {
      return;
    }
    const imageSrc = webcamRef.current.getScreenshot();
    console.log(imageSrc);
    setTestCapturedImage(imageSrc);
    // Check Helmet Here
  }, [webcamRef]);

  useEffect(() => {
    capture();
    const interval = setInterval(() => {
      capture();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <BackHeader showHeader={false} />
      {width > 0 && (
        <Webcam
          ref={webcamRef}
          audio={false}
          width={width}
          height={height}
          screenshotFormat="image/png"
          videoConstraints={videoConstraints}
          mirrored
        />
      )}
      {testCapturedImage && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <h3>캡처된 이미지</h3>
          <img
            src={testCapturedImage}
            alt="Captured"
            style={{
              width: "50%",
              border: "1px solid #ccc",
              borderRadius: "10px",
            }}
          />
        </div>
      )}
    </>
  );
};

export default WebcamPage;
