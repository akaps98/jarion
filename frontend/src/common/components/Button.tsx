import type { ComponentPropsWithoutRef } from "react";
import './Button.css';

type ButtonProps = ComponentPropsWithoutRef<"button">;

function Button({
    children,
    className = "",
    type = "button",
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            className={`common-button ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;