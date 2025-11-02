// ./popups/popup-10.jsx
import SignModal from "../components/SignModal";
import zoomedSign from "../assets/wishes/crystal.png";

export default function Popup10({ open, onClose }) {
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
