'use client'
import { useRouter } from 'next/navigation';
import React from 'react'
import { Button } from './button';

type RouterBackButtonProps = {
    label: string
}

function RouterBackButton({ label }: RouterBackButtonProps) {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    return (
        <Button variant={'secondary'} onClick={handleBack}>
            {label}
        </Button>
    );

}

export default RouterBackButton