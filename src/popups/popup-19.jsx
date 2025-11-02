// ./popups/popup-01.jsx
import zoomedSign from "../assets/zoomedsignboard.png";
export default function Popup01() {
return (
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
);
}