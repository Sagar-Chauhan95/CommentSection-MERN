import { useState, useEffect } from "react";
import _ from 'lodash';
import { Post } from "./App";


export function useCustomHook() {
    const [ data, setData ] = useState<Post[]>([]);
    useEffect(() => {
        async function fetchAPI() {
            const response = await fetch("http://localhost:3004/data");
            const defaultList = await response.json();
            setData(_.orderBy(defaultList, 'like', 'desc'));
        }

        fetchAPI();

    }, []);

    return {
        posts: data,
        setPosts: setData
    };

}