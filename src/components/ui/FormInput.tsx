import React from 'react';
import { ChevronDown, type LucideIcon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
    label: string;
    type?: 'text' | 'number' | 'email' | 'date' | 'textarea' | 'select';
    icon?: LucideIcon;
    options?: { value: string | number; label: string }[];
    rows?: number;
    containerClassName?: string;
    rightElement?: React.ReactNode;
}

export const FormInput: React.FC<FormInputProps> = ({
    label,
    type = 'text',
    icon: Icon,
    options,
    rows = 4,
    containerClassName,
    className,
    rightElement,
    ...props
}) => {
    const inputClasses = cn(
        "w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
        type === 'select' && "appearance-none bg-no-repeat bg-[right_1rem_center]",
        Icon && "pl-11",
        className
    );

    return (
        <div className={cn("flex flex-col", containerClassName)}>
            <label className="block text-sm font-semibold text-slate-600 mb-2">
                {label}
            </label>
            <div className="relative">
                {Icon && (
                    <Icon
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                )}

                {type === 'textarea' ? (
                    <textarea
                        {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                        rows={rows}
                        className={cn(inputClasses, "resize-none")}
                    />
                ) : type === 'select' ? (
                    <div className="relative">
                        <select
                            {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
                            className={inputClasses}
                        >
                            {options?.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown
                            size={18}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />
                    </div>
                ) : (
                    <div className="relative">
                        <input
                            type={type}
                            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
                            className={inputClasses}
                        />
                        {rightElement && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                {rightElement}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
