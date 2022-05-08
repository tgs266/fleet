import * as React from 'react';
import { useNavContext } from '../../layouts/Navigation';

export default function Home() {
    const [, setState] = useNavContext();

    React.useEffect(() => {
        setState({
            breadcrumbs: [
                {
                    text: 'Home',
                },
            ],
            menu: null,
            buttons: [],
        });
    }, []);
    return <div />;
}
