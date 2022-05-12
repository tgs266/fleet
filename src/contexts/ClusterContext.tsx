import * as React from 'react';
import { ElectronCluster } from '../models/cluster.model';

export interface IClusterContext {
    cluster?: ElectronCluster;
    useAuth?: boolean;
    username?: string;
}

export const ClusterContext = React.createContext(null);

export function ClusterContextProvider(props: { children: React.ReactNode }) {
    const [state, setState] = React.useState({} as IClusterContext);
    const value = React.useMemo(() => [state, setState], [state]);
    return <ClusterContext.Provider value={value}>{props.children}</ClusterContext.Provider>;
}

export function useClusterContext(): [
    IClusterContext,
    React.Dispatch<React.SetStateAction<IClusterContext>>
] {
    const context = React.useContext(ClusterContext);
    if (context === undefined) {
        throw new Error('useClusterContext must be used within a ClusterContextProvider');
    }
    return context;
}
