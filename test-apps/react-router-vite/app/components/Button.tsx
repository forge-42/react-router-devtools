import { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

const Button = ({ children, ...props }: ButtonProps) => {
 return (
    <button {...props}>
     {children}
    </button>
 );
}

export { Button }; 