import { createContext, Dispatch, RefObject, SetStateAction } from 'react';

type SelectedTrainContextType = {
    selectedTrainNumber: number | undefined;
    setTrainNumber: Dispatch<SetStateAction<number | undefined>>;
    sidebarRef: RefObject<HTMLDivElement>;
};

const defaultContextValue: SelectedTrainContextType = {
    selectedTrainNumber: undefined,
    setTrainNumber: () => { },
    sidebarRef: { current: null },
};

export const SelectedTrainContext = createContext<SelectedTrainContextType>(defaultContextValue);
