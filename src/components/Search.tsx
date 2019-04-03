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
        this.clear = this.clear.bind(this);

        this.state = {
            suggestionList: [],
            currentResultSet: [],
            selected: -1,
            currentQueryValue: ''
        };
    }
    
    handleChange = (e : any) => {
        const searchString = e.target.value.toLowerCase();
        let suggestionList = [];

        if(searchString.length >= this.props.minimumSearchLength) {
            suggestionList = this.props.inputSet.filter((option) => {
                let optionValue = option[this.props.searchFieldName].toLowerCase();

                if(
                    (
                        (new RegExp('^' + searchString)).test(optionValue) // Regex search on whole list of partial match.
                        ||
                        (new RegExp('^.*' + searchString + '.*$')).test(optionValue)
                    )
                    // &&
                    // !this.state.currentResultSet.some(item => item === option) // Excludes words already on the list.
                    //^this line is still likely broken.
                )
                {
                    return true
                }
            });
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

    clear() {
        this.props.onQueryChange('');
        this.setState({
            currentQueryValue: '',
            suggestionList: [],
            selected: -1
        });
    }

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
        if(this.state.suggestionList.length > 0) {
            return (
                <div className="search-container">
                    <input 
                        type="text" 
                        onChange={ this.handleChange } 
                        value={ this.state.currentQueryValue } 
                        placeholder="Search..."
                        onKeyDown={ this.handleKeyDown }
                    />
                    <img src="cancel.svg" alt="Clear Search"/>
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
                    <img src="cancel.svg" alt="Clear Search" onClick={ this.clear }/>
                </div>
            );
        }
    };
};