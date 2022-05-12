import * as React from 'react';
import { ElectronCluster } from '../models/cluster.model';

export interface IAuthContext {
    cluster?: ElectronCluster;
    useAuth?: boolean;
    username?: string;
}

export const AuthContext = React.createContext(null);

export function AuthContextProvider(props: { children: React.ReactNode }) {
    const [state, setState] = React.useState({} as IAuthContext);
    const value = React.useMemo(() => [state, setState], [state]);
    return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
}

export function useAuthContext(): [
    IAuthContext,
    React.Dispatch<React.SetStateAction<IAuthContext>>
] {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within a AuthContextProvider');
    }
    return context;
}
