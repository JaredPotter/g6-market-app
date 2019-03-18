import * as React from "react";
export interface DollarProps { value: number; }

const Dollar = (props: DollarProps) => {
    return (
        <div>${ format(props.value) }</div>
    );
};

function format(num : number) {
    if(!isNaN(num)) {
        return num.toFixed(2);
    }
  }

export default Dollar;