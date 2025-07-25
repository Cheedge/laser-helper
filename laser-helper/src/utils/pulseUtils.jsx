export const fsToEv = 1.519;

export function gaussian(t, t0, sigma) {
    return Math.exp(-((t - t0) ** 2) / (2 * sigma ** 2));
}

export function sinPulse(t, omega, phi) {
    return Math.sin(omega * t + phi);
}

export function generatePulseData(p) {
    const data = [];
    for (let t = p.t_i; t <= p.t_f; t += p.delta_t) {
        const t_shift = t - p.t_0;

        const g1 = gaussian(t, p.t_0, p.sigma1);
        const g2 = gaussian(t, p.t_0, p.sigma2);

        const A1x = p.A1x * g1 * sinPulse(t_shift, p.omega1, p.phi1x);
        const A1y = p.A1y * g1 * sinPulse(t_shift, p.omega1, p.phi1y);
        const A2x = p.A2x * g2 * sinPulse(t_shift, p.omega2, p.phi2x);
        const A2y = p.A2y * g2 * sinPulse(t_shift, p.omega2, p.phi2y);

        const Ax = A1x + A2x;
        const Ay = -(A1y + A2y);

        data.push({ t, Ax, Ay });
    }
    return data;
}
