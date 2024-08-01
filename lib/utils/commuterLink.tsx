export default function useCommuterLink(pathname: string, type: string | null, destination: string | null, commuter: string | null): string | undefined {
    if (commuter === 'true' || null) return undefined

    const str_dest = destination ? `&destination=${destination}` : ''
    return `${pathname}?type=${type}${str_dest}&commuter=true`
}