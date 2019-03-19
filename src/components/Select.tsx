import * as React from "react";
import './Product.scss';

export interface SelectProps {
  currentValue: string;
  options: Array<any>;
  onSelectChange: any;
};

export interface SelectState {
  onSelectChange: any;
};

export default class Select extends React.Component<SelectProps, SelectState> {
  constructor(props : any) {
    super(props);
    
    this.state = {
      onSelectChange: props.onSelectChange,
    };
  }

  handleChange = (e : any) => {
    const value = e.target.value;

    this.state.onSelectChange(value);
  }

  render() {
    let options = this.props.options.map((opt) => {
      return (
        <option key={ opt.value } value={ opt.value }>{ opt.label }</option>
      );
    });

    return (
      <div>
        {/* <div>Current Value: { this.props.currentValue }</div> */}
        <select value={this.props.currentValue} onChange={this.handleChange}>
          { options }
        </select>
      </div>
    );
  }
};

