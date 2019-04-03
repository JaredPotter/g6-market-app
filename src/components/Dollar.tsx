import * as React from "react";
export interface DollarProps { value: number; }

const Dollar = (props: DollarProps) => {
    return (
        <span>${ format(props.value) }</span>
    );
};

function format(num : number) {
    if(!isNaN(num)) {
        return num.toFixed(2);
    }
  }

export default Dollar;