import React from 'react';

export const SpinnerSm = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-5 h-5 border-4 border-secondary border-t-primary rounded-full animate-spin"></div>
        </div>
    );
};
