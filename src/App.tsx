import React from 'react';
import './App.css';
import './styles/fleet.less';
import { Route, Routes } from 'react-router';
import DeploymentList from './views/DeploymentList/DeploymentList';
import ContainerSpecDetails from './views/ContainerSpecDetails/ContainerSpecDetails';
import PodDetails from './views/PodDetails/PodDetails';
import Layout from './layouts/Layout';
import DeploymentDetails from './views/DeploymentDetails/DeploymentDetails';
import CreateDeployment from './views/CreateDeployment/CreateDeployment';
import PodContainerDetails from './views/PodContainerDetails/PodContainerDetails';
import ServiceDetails from './views/ServiceDetails/ServiceDetails';
import Home from './views/Home/Home';
import NodeList from './views/NodeList/NodeList';
import NodeDetails from './views/NodeDetails/NodeDetails';
import PodList from './views/PodList/PodList';
import Namespace from './views/Namespace/Namespace';
import NamespaceList from './views/NamespaceList/NamespaceList';
import ServiceList from './views/ServiceList/ServiceList';

function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function deleteCookie(name: string) {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

function App() {
    const token = getCookie('token');
    if (token) {
        localStorage.setItem('jwe', token);
        deleteCookie('token');
    }

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="" element={<Home />} />
                <Route path="deployments" element={<DeploymentList />} />
                <Route path="nodes" element={<NodeList />} />
                <Route path="create-deployment" element={<CreateDeployment />} />
                <Route path="deployments/:namespace/:deployment" element={<DeploymentDetails />} />
                <Route
                    path="deployments/:namespace/:deployment/container-spec/:specName"
                    element={<ContainerSpecDetails />}
                />

                <Route path="pods/:namespace/:podName" element={<PodDetails />} />
                <Route
                    path="pods/:namespace/:podName/containers/:containerName"
                    element={<PodContainerDetails />}
                />

                <Route path="services" element={<ServiceList />} />
                <Route path="services/:namespace/:serviceName" element={<ServiceDetails />} />

                <Route path="nodes/:nodeName" element={<NodeDetails />} />

                <Route path="pods/" element={<PodList />} />

                <Route path="namespaces" element={<NamespaceList />} />
                <Route path="namespaces/:namespace" element={<Namespace />} />
            </Route>
        </Routes>
    );
}

export default App;
