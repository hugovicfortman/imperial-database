import React from 'react';
import SWAPI from '../services/swapi'
import DatasheetSelectedCategory from './DatasheetSelectedCategory';

class DatasheetCategories extends React.Component {

    constructor() {
        super();

        this.state = {
            categories: {},
            categoryData: {
                /**
                 * count: 2
                 * next: ''
                 * previous: null
                 * results: [{ name, title }]
                 */
                count: 0,
                next: '',
                previous: null,
                results: []
            },
            loadingData: false,
            selectedCategory: null
        }

        this.swapi = new SWAPI();
    }

    componentDidMount() {
        // Load the swapi root, and store in state
        this.swapi.getSWAPI((cs) => this.setState(() => ({ categories : cs })))
    }

    selectCategory(cat) {
        this.setState(() => ({ selectedCategory: { name: cat, url: this.state.categories[cat] }}));
    }

    loadCategoryData(cat) {
        // Load the swapi root, and store in state
        this.setState(() => ({ loadingData: true }));
        this.swapi.getSWAPI((dt) => this.setState(() => ({ categoryData : dt, loadingData: false })), 
            this.state.categories[cat]);
    }

    loadMoreData(uri) {
        // Load the swapi root, and store in state
        this.swapi.getSWAPI((dt) => this.setState((prevState) => {
            let { count, next, previous, results } = dt;
            const ct = prevState.categoryData.results;
            results = ct.concat(results);
            return { categoryData : { count, next, previous, results } }
        }), 
        uri);
    }

    deselectCategory() {
        this.setState(() => ({ selectedCategory: null}));
    }

    render(){

        const categories = (() => {
            const cList = [];
            for(let c in this.state.categories)
            {
                cList.push(<li key={ this.state.categories[c] } className="category" 
                    onClick={ () => { 
                        this.selectCategory(c);
                        this.loadCategoryData(c);
                        return;
                    } }>{c}</li>);
            }
            return cList;
        })();

        return (
            <aside className="datasheet-categories">
                <h4>Categories</h4>
                <ul className="categories-list">
                    {categories}
                </ul>
                {
                this.state.selectedCategory !== null?
                    <DatasheetSelectedCategory category={ this.state.selectedCategory } 
                        deselect={ () => this.deselectCategory() } data={ this.state.categoryData }
                        selectArticle={ (it) => this.props.selectArticle(it) } 
                        loading={ this.state.loadingData } 
                        loadMore={ (uri) => this.loadMoreData(uri) }
                        handleClose={ () => this.deselectCategory() }/> : <span></span>
                }
            </aside>
        );
    }
}
export default DatasheetCategories;