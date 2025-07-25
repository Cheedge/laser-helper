import React, { useState } from 'react';
import PulseVisualization from './PulseVisualization';
import PulsePathAnimation from './PulsePathAnimation';
import { fsToEv } from '../utils/pulseUtils';

const defaultLaserParams = {
    delta_t: 0.1,
    t_i: 100,
    t_f: 100,
    t_0: 20,
    A1x: 20,
    A1y: 0,
    omega1: 0.4, //0.4 * fsToEv,
    sigma1: 2,
    phi1x: -0.5,
    phi1y: 0,
    A2x: 1,
    A2y: 1,
    omega2: 1.6, //1.6 * fsToEv,
    sigma2: 3.18,
    phi2x: -0.5,
    phi2y: 0,
};

const LaserPulsePage = () => {
    const [params, setParams] = useState(defaultLaserParams);

    return (
        <div>
            <PulseVisualization params={params} setParams={setParams} />
            <PulsePathAnimation params={params} />
        </div>
    );
};

export default LaserPulsePage;
