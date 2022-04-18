import * as React from 'react';
import Fleet from '../../components/Fleet/Fleet';

export default function Home() {
    // const [, setState] = useNavContext()

    // React.useEffect(() => {
    //     setState({
    //         breadcrumbs: [{
    //             text: "Home"
    //         }]
    //     })
    // }, [])

    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <Fleet />;
    // return <Demo />;
}
