// ./popups/popup-08.jsx
import SignModal from "../components/SignModal";
import zoomedSign from "../assets/wishes/emily.png";

export default function Popup08({ open, onClose }) {
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
