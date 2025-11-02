// ./popups/popup-03.jsx
import SignModal from "../components/SignModal";
import zoomedSign from "../assets/wishes/xinyi.png";

export default function Popup03({ open, onClose }) {
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
