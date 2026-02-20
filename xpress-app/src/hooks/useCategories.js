import { CATEGORIES, getCategoryBySlug, getCategoryById } from '../constants/categories';

const useCategories = () => {
    return {
        categories: CATEGORIES,
        getCategoryBySlug,
        getCategoryById
    };
};

export default useCategories;
