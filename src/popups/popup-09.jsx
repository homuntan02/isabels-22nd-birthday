// ./popups/popup-09.jsx
import SignModal from "../components/SignModal";
import zoomedSign from "../assets/wishes/shanice.png";

export default function Popup09({ open, onClose }) {
  return (
    <SignModal open={open} onClose={onClose}>
      <img
        src={zoomedSign}
        alt="Sign"
        style={{
          width: "100%",
          height: "auto",
          borderRadius: 12,
          objectFit: "contain",
        }}
      />
    </SignModal>
  );
}
