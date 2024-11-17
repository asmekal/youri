import React, { useState, useEffect, Suspense } from 'react';
import { Paper, Typography } from '@mui/material';
import * as Babel from '@babel/standalone';
import ErrorBoundary from './ErrorBoundary';

const DynamicComponentLoader = ({ componentId }) => {
    const [Component, setComponent] = useState(null);

    useEffect(() => {
        const loadComponent = () => {
            const code = localStorage.getItem(componentId);
            console.log(`Loading component with ID: ${componentId}`);
            console.log(`Component code: ${code}`);

            if (code) {
                try {
                    // Transpile the code using Babel
                    const transpiledCode = Babel.transform(code, {
                        presets: ['env', 'react'],
                    }).code;

                    console.log(`Transpiled code: ${transpiledCode}`);

                    // Create a new function with React, Paper, Typography as parameters
                    const componentFunc = new Function('React', 'Paper', 'Typography', 'module', 'exports', transpiledCode);

                    const exports = {};
                    const module = { exports };

                    console.log('Executing transpiled code...');
                    // Execute the function with dependencies
                    componentFunc(React, Paper, Typography, module, exports);
                    console.log('Transpiled code executed.');

                    const LoadedComponent = module.exports.default || module.exports;
                    console.log('LoadedComponent:', LoadedComponent);

                    if (!LoadedComponent) {
                        throw new Error('Loaded component is undefined.');
                    }

                    // Create a wrapper component to pass dependencies as props
                    const ComponentWithProps = (props) => (
                        <LoadedComponent {...props} Paper={Paper} Typography={Typography} />
                    );

                    setComponent(() => ComponentWithProps);
                    console.log('Component set successfully.');
                } catch (error) {
                    console.error('Error loading component:', error);
                }
            } else {
                console.warn(`No code found for component ID: ${componentId}`);
            }
        };

        loadComponent();
    }, [componentId]);

    if (!Component) {
        return <div>Loading component...</div>;
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Component />
        </Suspense>
    );
};

export default DynamicComponentLoader;
