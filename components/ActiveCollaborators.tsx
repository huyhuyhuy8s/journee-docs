import { useOthers } from "@liveblocks/react/suspense";
import Image from "next/image";

const ActiveCollaborators = () => {
  const others = useOthers();

  const collaborators = others.map((other) => other.info);

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <ul className="collaborators-list">
      {collaborators.map(({ id, avatar, name, color }) => {
        const hasValidAvatar =
          avatar &&
          avatar.trim() !== "" &&
          avatar !== "undefined" &&
          avatar !== "null";

        return (
          <li key={id}>
            {hasValidAvatar ? (
              <Image
                src={avatar}
                alt={name || id || "Collaborator"}
                width={32}
                height={32}
                className="inline-block size-8 rounded-full ring-2 ring-dark-100"
                style={{ border: `3px solid ${color}` }}
                onError={(e) => {
                  // Hide the image and show fallback
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className="size-8 rounded-full ring-2 ring-dark-100 flex items-center justify-center text-white text-xs font-semibold"
              style={{
                backgroundColor: color || "#3b82f6",
                border: `3px solid ${color || "#3b82f6"}`,
                display: hasValidAvatar ? "none" : "flex",
              }}
            >
              {getInitials(name || id)}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ActiveCollaborators;
