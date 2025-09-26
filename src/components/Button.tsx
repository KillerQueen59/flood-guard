import clsx from "clsx";
import Image from "next/image";

export enum ButtonColor {
  PRIMARY = "primary-60",
  SECONDARY = "gray-30",
  DANGER = "danger-60",
}

export enum ButtonType {
  OUTLINED = "border border",
  FILL = "bg",
}

export enum ButtonSize {
  SMALL = "h-[44px] text-xs",
  MEDIUM = "h-[48px] text-sm",
  LARGE = "h-[56px] text-base",
}

type ButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  buttonColor?: ButtonColor;
  buttonType?: ButtonType;
  buttonSize?: ButtonSize;
  fullWidth?: boolean;
  icon?: string;
  type?: "button" | "submit" | "reset";
};

function Button({
  label,
  onClick,
  disabled = false,
  buttonColor = ButtonColor.PRIMARY,
  buttonType = ButtonType.FILL,
  buttonSize = ButtonSize.MEDIUM,
  fullWidth = false,
  icon,
  type = "button",
}: ButtonProps) {
  const baseClasses = clsx(
    "flex max-h-[48px] items-center rounded-xl px-4 space-x-[4px] transition-all duration-200 ease-in-out",
    buttonSize,
    fullWidth && "w-full",
    disabled
      ? "bg-opacity-30 cursor-not-allowed"
      : "cursor-pointer hover:bg-opacity-80 hover:scale-105 hover:shadow-md active:scale-95",
    buttonType === ButtonType.OUTLINED ? "border" : ""
  );

  const colorClasses = clsx({
    "bg-primary-60":
      buttonType === ButtonType.FILL && buttonColor === ButtonColor.PRIMARY,
    "bg-gray-30":
      buttonType === ButtonType.FILL && buttonColor === ButtonColor.SECONDARY,
    "bg-danger-60":
      buttonType === ButtonType.FILL && buttonColor === ButtonColor.DANGER,
    "text-danger-60 border-danger-60 hover:bg-danger-60 hover:text-white":
      buttonType === ButtonType.OUTLINED && buttonColor === ButtonColor.DANGER,
    "text-gray-100 border-gray-100 hover:bg-gray-100 hover:text-white":
      buttonType === ButtonType.OUTLINED &&
      buttonColor === ButtonColor.SECONDARY,
    "text-primary-60 border-primary-60 hover:bg-primary-60 hover:text-white":
      buttonType === ButtonType.OUTLINED && buttonColor === ButtonColor.PRIMARY,
    "text-white": buttonType === ButtonType.FILL,
  });

  return (
    <button
      type={type}
      className={clsx(baseClasses, colorClasses)}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) {
          onClick();
        }
      }}>
      {icon && <Image alt="" src={icon} width={16} height={16} />}
      <div className="text-center w-full">{label}</div>
    </button>
  );
}

export default Button;
