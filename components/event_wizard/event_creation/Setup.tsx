import { Dispatch, SetStateAction } from "react";

interface SetupProps {
    steps: { name: string; enabled: boolean }[];
    setSteps: Dispatch<
        SetStateAction<
            {
                name: string;
                enabled: boolean;
            }[]
        >
    >;
}

export default function Setup({ steps, setSteps }: SetupProps) {
}
