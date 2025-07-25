import React, { useState, useEffect } from 'react';

// Define the speed of light (c) and Planck's constant (h) for calculations
// c = 3 x 10^8 m/s
// h = 6.626 x 10^-34 J.s
// electron charge e = 1.602 x 10^-19 C
// Energy E = hc/lambda (Joules)
// Energy in eV = E_J / e = (hc / (lambda * e))
// Simplified: E_eV = 1240 / lambda_nm (where lambda_nm is wavelength in nanometers)

const ElectromagneticSpectrum = ({ wavelength }) => {
    // Data for the electromagnetic spectrum, including wavelength, frequency, and energy ranges.
    // Wavelengths are in meters (m), Frequencies in Hertz (Hz), and Energy in electron Volts (eV).
    // The ranges are approximate and can vary slightly depending on the source.
    const spectrumData = [
        {
            waveType: 'Gamma Rays',
            startWavelength: '1e-19', // meters
            endWavelength: '1e-12', // meters
            startFrequency: '3e+20', // Hz (calculated from endWavelength: c / 1e-12)
            endFrequency: '3e+27', // Hz (calculated from startWavelength: c / 1e-19)
            startEnergy: '1.24e+6', // eV (calculated from endWavelength: 1240 / (1e-12 * 1e9))
            endEnergy: '1.24e+13', // eV (calculated from startWavelength: 1240 / (1e-19 * 1e9))
        },
        {
            waveType: 'X-rays',
            startWavelength: '1e-12',
            endWavelength: '1e-8',
            startFrequency: '3e+16', // Hz (c / 1e-8)
            endFrequency: '3e+20', // Hz (c / 1e-12)
            startEnergy: '1.24e+2', // eV (1240 / (1e-8 * 1e9))
            endEnergy: '1.24e+6', // eV (1240 / (1e-12 * 1e9))
        },
        {
            waveType: 'Ultraviolet',
            startWavelength: '1e-8',
            endWavelength: '4e-7', // 400 nm
            startFrequency: '7.5e+14', // Hz (c / 4e-7)
            endFrequency: '3e+16', // Hz (c / 1e-8)
            startEnergy: '3.1', // eV (1240 / (4e-7 * 1e9))
            endEnergy: '1.24e+2', // eV (1240 / (1e-8 * 1e9))
        },
        {
            waveType: 'Visible Light',
            startWavelength: '4e-7', // 400 nm
            endWavelength: '7e-7', // 700 nm
            startFrequency: '4.28e+14', // Hz (c / 7e-7)
            endFrequency: '7.5e+14', // Hz (c / 4e-7)
            startEnergy: '1.77', // eV (1240 / (7e-7 * 1e9))
            endEnergy: '3.1', // eV (1240 / (4e-7 * 1e9))
        },
        {
            waveType: 'Infrared',
            startWavelength: '7e-7', // 700 nm
            endWavelength: '1e-3', // 1 mm
            startFrequency: '3e+11', // Hz (c / 1e-3)
            endFrequency: '4.28e+14', // Hz (c / 7e-7)
            startEnergy: '1.24e-3', // eV (1240 / (1e-3 * 1e9))
            endEnergy: '1.77', // eV (1240 / (7e-7 * 1e9))
        },
        {
            waveType: 'Microwaves',
            startWavelength: '1e-3', // 1 mm
            endWavelength: '1', // 1 m
            startFrequency: '3e+8', // Hz (c / 1)
            endFrequency: '3e+11', // Hz (c / 1e-3)
            startEnergy: '1.24e-6', // eV (1240 / (1 * 1e9))
            endEnergy: '1.24e-3', // eV (1240 / (1e-3 * 1e9))
        },
        {
            waveType: 'Radio Waves',
            startWavelength: '1', // 1 m
            endWavelength: '1e+5', // 100 km (can be much longer)
            startFrequency: '3e+3', // Hz (c / 1e+5)
            endFrequency: '3e+8', // Hz (c / 1)
            startEnergy: '1.24e-11', // eV (1240 / (1e+5 * 1e9))
            endEnergy: '1.24e-6', // eV (1240 / (1 * 1e9))
        },
    ];

    // State to store the index of the row that should be highlighted
    const [highlightedRowIndex, setHighlightedRowIndex] = useState(null);

    // Effect hook to update the highlighted row when the 'wavelength' prop changes
    useEffect(() => {
        if (wavelength) {
            // Convert the input wavelength from nanometers (nm) to meters (m) for comparison
            const wavelengthInMeters = parseFloat(wavelength) * 1e-9;
            let foundIndex = null;

            // Iterate through the spectrum data to find the matching wave type
            for (let i = 0; i < spectrumData.length; i++) {
                const row = spectrumData[i];
                // Parse string values to numbers for numerical comparison
                const startW = parseFloat(row.startWavelength);
                const endW = parseFloat(row.endWavelength);

                // Check if the input wavelength falls within the current row's range
                // Note: The ranges are defined such that startWavelength is smaller than endWavelength.
                // For Gamma Rays and X-rays, the wavelength decreases as energy/frequency increases.
                // For Radio Waves, wavelength increases as energy/frequency decreases.
                // The comparison logic needs to handle these ranges correctly.
                // Assuming startWavelength < endWavelength for all defined ranges.
                if (wavelengthInMeters >= startW && wavelengthInMeters < endW) {
                    foundIndex = i;
                    break; // Found the matching row, no need to check further
                }
            }
            setHighlightedRowIndex(foundIndex); // Update the state with the found index
        } else {
            setHighlightedRowIndex(null); // No wavelength provided, so no row is highlighted
        }
    }, [wavelength, spectrumData]); // Re-run this effect if 'wavelength' or 'spectrumData' changes

    return (
        // The main container for the table, applying responsive and styling classes
        <div className="flex justify-center items-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100 font-inter text-gray-800">
            {/* Table container with background, rounded corners, and shadow */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-5xl border border-gray-200">
                <table className="min-w-full border-separate border-spacing-0">
                    {/* Table Header */}
                    <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider rounded-tl-2xl"
                            >
                                Wave Type
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider"
                            >
                                Wavelength Range (m)
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider"
                            >
                                Frequency Range (Hz)
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider rounded-tr-2xl"
                            >
                                Energy Range (eV)
                            </th>
                        </tr>
                    </thead>
                    {/* Table Body */}
                    <tbody className="bg-white divide-y divide-gray-200">
                        {spectrumData.map((row, index) => (
                            <tr
                                key={index}
                                // Apply conditional styling for the highlighted row
                                className={`
                                    hover:bg-blue-50 transition-colors duration-200
                                    ${
                                        highlightedRowIndex === index
                                            ? 'border-2 border-red-500 shadow-md'
                                            : ''
                                    }
                                `}
                            >
                                <td
                                    className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900
                                        ${
                                            index === spectrumData.length - 1
                                                ? 'rounded-bl-2xl'
                                                : ''
                                        }
                                    `}
                                >
                                    {row.waveType}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {row.startWavelength} - {row.endWavelength}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {row.startFrequency} - {row.endFrequency}
                                </td>
                                <td
                                    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700
                                        ${
                                            index === spectrumData.length - 1
                                                ? 'rounded-br-2xl'
                                                : ''
                                        }
                                    `}
                                >
                                    {row.startEnergy} - {row.endEnergy}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ElectromagneticSpectrum;
