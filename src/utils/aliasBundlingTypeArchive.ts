type BundlingTypeArchive = 'TRUCKING_ONLY' | 'CUSTOMS_CLEARANCE';

export const aliasBundlingTypeArchive = (bundlingTypeArchive: BundlingTypeArchive | undefined): string => {
    const alias: Record<BundlingTypeArchive, string> = {
        TRUCKING_ONLY: 'Trucking Only',
        CUSTOMS_CLEARANCE: 'Customs Clearance',
    };

    return bundlingTypeArchive ? alias[bundlingTypeArchive] : 'N/A';
};
