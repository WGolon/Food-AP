import axios from 'axios';
import {APP_ID, APP_KEY} from '../config'

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getRecipes() {
        try {
            const res = await axios.get(`https://api.edamam.com/search?q=${this.query}&app_id=${APP_ID}&app_key=${APP_KEY}&from=0&to=40`);
            if(res.data.hits.length) {
                this.results = res.data.hits;
            } else {
                alert('Could not find any recipes matching your query')
            }
        } catch(error) {
            alert(error);
        }
    }
}