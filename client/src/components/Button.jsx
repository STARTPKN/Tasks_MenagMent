import clsx from "clsx";
import React from "react";

const Button = ({ icon, className, label, type, onClick = () => {}, ...rest }) => {
  return (
    <button
      type={type || "button"}
      className={clsx("px-3 py-2 outline-none disabled:opacity-50 disabled:cursor-not-allowed", className)}
      onClick={onClick}
      {...rest}
    >
      <span>{label}</span>
      {icon && icon}
    </button>
  );
};

export default Button;
