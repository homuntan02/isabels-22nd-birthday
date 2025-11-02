// ./popups/popup-18.jsx
import SignModal from "../components/SignModal";
import zoomedSign from "../assets/wishes/present_card.png";

export default function Popup18({ open, onClose }) {
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
