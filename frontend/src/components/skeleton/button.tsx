
interface BtnProps {
    Icon?: React.ElementType;
    label: string;
    action?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    variant?: "primary" | "secondary" | "danger";

}

export const Button: React.FC<BtnProps> = ({
    Icon,
    label,
    action,
    type = "button",
    disabled = false,
    variant = "primary"
}) => {

    const variantClasses = {
        primary: "btn-primary",
        secondary: "btn-secondary",
        danger: "bg-gradient-to-r from-[#b57A74] to-[#9C655F] text-white hover:from-[#9C655F] hover:to-[#7e6957]"
    };

    return (
        <button
            type={type}
            onClick={action}
            disabled={disabled}
            className={`
                ${variantClasses[variant]} 
                flex items-center justify-center gap-2
            `}
        >
            {Icon && <Icon size={16} />}
            {label}
        </button>
    );
}