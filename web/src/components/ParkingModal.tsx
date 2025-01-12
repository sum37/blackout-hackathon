import React from "react";
import "../styles/Modal.css"; // 모달 스타일

interface ParkingModalProps {
    onConfirm: () => void;
    onCancel: () => void;
  }

const ParkingModal: React.FC<ParkingModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p className="modal-message">권장 주차구역이 아닙니다.</p>
        <p className="modal-submessage">이 곳에 주차할 시 적립된 포인트가 사라집니다. 그래도 하시겠습니까?</p>
        <div className="modal-buttons">
          <button className="modal-button" onClick={onConfirm}>
            계속하기
          </button>
          <button className="modal-button" onClick={onCancel}>
            이동하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParkingModal;