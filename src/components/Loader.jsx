import React from "react";

export function Loader({ message = "Loading..." }) {
    return (
        <div>{message}</div>
    )
}