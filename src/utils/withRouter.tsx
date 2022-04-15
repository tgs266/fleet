import * as React from 'react';
import {
    useLocation,
    useNavigate,
    useParams,
    Location,
    Params,
    NavigateFunction,
} from 'react-router';
import { useSearchParams } from 'react-router-dom';

export interface IWithRouterProps {
    navigate: NavigateFunction;
    location: Location;
    params: Readonly<Params<string>>;
    search: URLSearchParams;
}

export const withRouter = (Component: any) => {
    function Wrapper(props: any) {
        const navigate = useNavigate();
        const location = useLocation();
        const params = useParams();
        const [searchParams] = useSearchParams();
        const key = Object.keys(params).map((k) => `/${k}:${params[k]}`);
        return (
            <Component
                key={key}
                navigate={navigate}
                location={location}
                params={params}
                search={searchParams}
                {...props}
            />
        );
    }

    return Wrapper;
};
