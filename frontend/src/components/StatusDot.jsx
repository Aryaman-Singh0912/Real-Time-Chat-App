export default function StatusDot({ online, ring = false }) {
  return (
    <span
      className={`block rounded-full ${online ? "bg-moss" : "bg-slate/50"} ${
        ring ? "w-3 h-3 border-2 border-paper" : "w-2 h-2"
      }`}
      title={online ? "Online" : "Offline"}
    />
  );
}
