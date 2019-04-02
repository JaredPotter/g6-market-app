import * as React from "react";
import './Search.scss';

export interface SearchProps { 
    inputSet: Array<any>;
    searchFieldName: string;
    onQueryChange: Function;
    minimumSearchLength: number;   
}

export interface SearchState {
    suggestionList: Array<any>;
    currentResultSet: Array<any>;
    selected: number;
    currentQueryValue: string;
}

export default class Search extends React.Component<SearchProps, SearchState> {   
    constructor(props : SearchProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.formatSuggestionList = this.formatSuggestionList.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);

        this.state = {
            suggestionList: [],
            currentResultSet: [],
            selected: -1,
            currentQueryValue: ''
        };
    }
    
    handleChange = (e : any) => {
        const searchString = e.target.value;
    
        // Valid if alpha or approved special character.            
        // if(!(/\w+/.test(searchString))) {
        //     this.setState({
        //         suggestionList: []
        //     });

        //     return;
        // }

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
            currentQueryValue: searchString
        });
    }

    handleClick = (index : number) => {
        const value = this.state.suggestionList[index].title;

        this.setState({
            suggestionList: [],
            selected: -1,
            currentQueryValue: value,
        });

        this.props.onQueryChange(value);
    };

    handleMouseOver = (index : number) => {
        this.setState({
            selected: index
        });
    };

    handleKeyDown = (e : any) => {
        if(e.key === 'Enter') {
            let value = '';

            if(this.state.selected !== -1) {
                value = this.state.suggestionList[this.state.selected];
            }
            else {
                value = this.state.currentQueryValue;
            }
            this.props.onQueryChange(value);

            this.setState({
                suggestionList: [],
                selected: -1
            });
        }
    };

    formatSuggestionList(suggestionList : Array<any>) {
        const list = suggestionList.map((item, index) => {
            return (
                <div
                    key={ item[this.props.searchFieldName] }
                    className={'suggestion-item ' + (index === this.state.selected ? 'selected' : '')}
                    onClick={ () => this.handleClick(index) }
                    onMouseEnter={ () => this.handleMouseOver(index) }
                    
                >
                    { item[this.props.searchFieldName] }
                </div>
            )
          });        

        return list;
    }

    render() {
        if(this.state.suggestionList.length > 1) {
            return (
                <div className="search-container">
                    <input 
                        type="text" 
                        onChange={ this.handleChange } 
                        value={ this.state.currentQueryValue } 
                        placeholder="Search..."
                        onKeyDown={ this.handleKeyDown }
                    />
                    <div className="suggestion-list">
                        { this.formatSuggestionList(this.state.suggestionList) }
                    </div>
                </div>
            );
        }
        else {
            return (
                <div className="search-container">
                    <input 
                        type="text" 
                        onChange={ this.handleChange } 
                        value={ this.state.currentQueryValue } 
                        placeholder="Search..."
                        onKeyDown={ this.handleKeyDown }
                    />                    
                </div>
            );
        }
    };
};