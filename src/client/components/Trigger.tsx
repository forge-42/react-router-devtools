import clsx from "clsx";
import { usePersistOpen, useSettingsContext } from '../context/useRDTContext.js';
import { Logo } from './Logo.js';

export const Trigger = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { settings } = useSettingsContext();
  const { setPersistOpen } = usePersistOpen();
  const { hideUntilHover, position } = settings;
  const handleHover = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    event: "enter" | "leave"
  ) => {
    if (!hideUntilHover) return;
    const classesToRemove = "rdt-opacity-0";
    const classesToAdd = "rdt-opacity-100";
    if (event === "enter") {
      e.currentTarget.classList.remove(classesToRemove);
      e.currentTarget.classList.add(classesToAdd);
    }
    if (event === "leave") {
      e.currentTarget.classList.remove(classesToAdd);
      e.currentTarget.classList.add(classesToRemove);
    }
  };

  return (
    <div
      style={{ zIndex: 9999 }}
      onClick={() => {
        setIsOpen(!isOpen);
        setPersistOpen(!isOpen);
      }}
      onMouseEnter={(e) => handleHover(e, "enter")}
      onMouseLeave={(e) => handleHover(e, "leave")}
      className={clsx(
        "rdt-fixed rdt-m-1.5 rdt-h-14 rdt-w-14 rdt-cursor-pointer rdt-rounded-full rdt-transition-all ",
        hideUntilHover && "rdt-opacity-0",
        position === "bottom-right" && "rdt-bottom-0 rdt-right-0",
        position === "bottom-left" && "rdt-bottom-0 rdt-left-0",
        position === "top-right" && "rdt-right-0 rdt-top-0",
        position === "top-left" && "rdt-left-0 rdt-top-0",
        position === "middle-right" &&
          "rdt-right-0 rdt-top-1/2 -rdt-translate-y-1/2",
        position === "middle-left" &&
          "rdt-left-0 rdt-top-1/2 -rdt-translate-y-1/2",
        isOpen && "rdt-hidden" // Hide the button when the dev tools is open
      )}
    >
      <Logo
        className={clsx(
          "rdt-h-14 rdt-w-14 rdt-rounded-full rdt-transition-all rdt-duration-200",
          "hover:rdt-cursor-pointer hover:rdt-ring-2 hover:rdt-ring-offset-2 rdt-ring-[#212121]"
        )}
      />
    </div>
  );
};
