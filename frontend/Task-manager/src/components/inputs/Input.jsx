import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ value, onChange, label, placeholder, type }) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            <label className="text-[13px] text-slate-800">{label}</label>
            <div className="input-box flex items-center justify-between border p-2 rounded-md">
                <input
                    type={type === "password" ? (showPassword ? "text" : "password") : type}
                    placeholder={placeholder}
                    className="w-full bg-transparent outline-none"
                    value={value}
                    onChange={onChange}
                />
                {type === "password" && (
                    showPassword ? (
                        <FaRegEye
                            size={22}
                            className="text-primary cursor-pointer ml-2"
                            onClick={toggleShowPassword}
                        />
                    ) : (
                        <FaRegEyeSlash
                            size={22}
                            className="text-slate-500 cursor-pointer ml-2"
                            onClick={toggleShowPassword}
                        />
                    )
                )}
            </div>
        </div>
    );
};

export default Input;
