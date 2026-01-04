import React, { type ComponentType } from "react";

/**
 * Higher Order Component untuk inject appProps ke dalam Component
 */
export function withAppContext<P extends object, A extends object>(
    Component: ComponentType<P & A>,
    appProps: A
) {
    return function WrappedComponent(props: P) {
        return React.createElement(Component, {
            ...(props as P & A),
            ...appProps,
        });
    };
}