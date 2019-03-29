import * as React from "react";
import './Search.scss';

export interface SearchProps { 
    inputSet: Array<any>;
    searchFieldName: string;
    // currentQueryValue: string;
    minimumSearchLength: number;
}

export interface SearchState {
    suggestionList: Array<any>;
    currentResultSet: Array<any>;
}

export default class Search extends React.Component<SearchProps, SearchState> {   
    constructor(props : SearchProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.formatSuggestionList = this.formatSuggestionList.bind(this);
        this.state = {
            suggestionList: [],
            currentResultSet: []
        };
    }
    
    handleChange = (e : any) => {
        const searchString = e.target.value;
    
        // Valid if alpha or approved special character.            
        if(!(/\w+/.test(searchString))) {
            this.setState({
                suggestionList: []
            });

            return;
        }

        let suggestionList = null;

        if(searchString.length >= this.props.minimumSearchLength) {
            let thisRef = this;
            suggestionList = this.props.inputSet.filter((option) => {
                let optionValue = option[thisRef.props.searchFieldName];

                if(
                    (
                        (new RegExp('^' + searchString.toLowerCase())).test(optionValue.toLowerCase()) // Regex search on whole list of partial match.
                        ||
                        (new RegExp('^.*' + searchString.toLowerCase() + '.*$')).test(optionValue.toLowerCase())
                    )
                    &&
                    !this.state.currentResultSet.some(item => item === option) // Excludes words already on the list.
                    //^this line is still likely broken.
                )
                {
                    return true
                }
            });
            
        }
        else {
            suggestionList = [];
        }        

        this.setState({
            suggestionList: suggestionList,
        });
      }

    formatSuggestionList(suggestionList : Array<any>) {
        const results: any[] = [];

        suggestionList.forEach(item => {
            let value = item[this.props.searchFieldName];
            results.push(value);
        });

        return results;
    }

    render() {
        if(this.state.suggestionList.length > 1) {
            return (
                <div className="search-container">
                    <input type="text" onChange={ this.handleChange } placeholder="Search..."/>
                    <ul>
                        <li>{ this.formatSuggestionList(this.state.suggestionList) }</li>
                    </ul>
                </div>
            );
        }
        else {
            return (
                <div className="search-container">
                    <input type="text" onChange={ this.handleChange } placeholder="Search..."/>
                </div>
            );
        }
    };
};