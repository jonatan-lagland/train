import { createContext, Dispatch, SetStateAction } from 'react';

type SelectedTrainContextType = {
    trainNumber: number | undefined;
    setTrainNumber: Dispatch<SetStateAction<number | undefined>>;
};

const defaultContextValue: SelectedTrainContextType = {
    trainNumber: undefined,
    setTrainNumber: () => { },
};

export const SelectedTrainContext = createContext<SelectedTrainContextType>(defaultContextValue);
