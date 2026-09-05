import { getInitials, getColorForName } from "../utils/avatar";
import StatusDot from "./StatusDot";

export default function Avatar({ username, size = 44, showStatus = false, online = false }) {
  const dimension = `${size}px`;

  return (
    <div className="relative shrink-0" style={{ width: dimension, height: dimension }}>
      <div
        className="w-full h-full rounded-full flex items-center justify-center font-display font-semibold text-white select-none"
        style={{ backgroundColor: getColorForName(username), fontSize: size * 0.38 }}
      >
        {getInitials(username)}
      </div>
      {showStatus && (
        <span className="absolute bottom-0 right-0">
          <StatusDot online={online} ring />
        </span>
      )}
    </div>
  );
}
