'use client'
import React from 'react'
import LaunchIcon from '@mui/icons-material/Launch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useTranslations } from 'next-intl';
import { Button } from '../ui/button';

function Footer() {
    const t = useTranslations('TermsOfService')
    return (
        <div className='flex justify-evenly items-center'>

            <Dialog>
                <DialogTrigger asChild>
                    <Button className='text-blue-500' variant="ghost">Looking to hire a UX/UI developer?</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>I&apos;m looking for employment! 🧑🏼‍💼</DialogTitle>
                        <DialogDescription>
                            If you like this website, consider hiring me! I work with React, Next.js, TypeScript and mobile platforms (React Native). I speak Finnish and English. I&apos;m able to work in Tampere, Helsinki, Espoo, Vantaa or remotely. You can reach me at:
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <a href="mailto:jonatan.lagland@gmail.com" className="font-bold">
                            suomilinja@gmail.com
                        </a>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <a href="https://www.digitraffic.fi/kayttoehdot/" target="_blank" rel="noopener noreferrer" className="text-blue-500">
                <div className='flex flex-row items-center gap-1 text-sm hover:underline'>
                    <LaunchIcon fontSize='small'></LaunchIcon>
                    <span className='block md:hidden'>{t("titleShort")}</span>
                    <span className='md:block hidden'>{t("title")}</span>
                </div>
            </a>
        </div>
    )
}

export default Footer