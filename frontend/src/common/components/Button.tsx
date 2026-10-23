import type { ComponentPropsWithoutRef } from "react";
import './Button.css';

/**
 * 공통 버튼 컴포넌트
 * @param children: 버튼에 써지는 글씨 (글쓰기, 뒤로 가기, etc)
 * @param className: 다른 css 먹이고 싶을때
 * @param type: button 고정
 * @param props: onClick 등의 클릭 이벤트
 */

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