import React from 'react';

type SwitchModalButtonProps = {
    mode: string,
    setActive: React.Dispatch<React.SetStateAction<string>>;
};

const SwitchModalButton = ({ mode, setActive }: SwitchModalButtonProps) => {
    return (
        <label
            htmlFor="switchModal"
            className="relative block h-8 w-14 rounded-full bg-gray-300 transition-colors [-webkit-tap-highlight-color:_transparent] has-checked:bg-green-500"
        >
            <input type="checkbox" id="switchModal" className="peer sr-only" onClick={() => { mode == "login" ? setActive("signup") : setActive("login") }} />

            <span
                className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-white transition-[inset-inline-start] peer-checked:start-6"
            ></span>
        </label>
    )
}

export default SwitchModalButton;