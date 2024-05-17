import useSWR from 'swr'
import fetcher from '../utils/fetcher'

const useCates = () =>{
    const {data,isLoading,mutate} = useSWR('categories',fetcher)
    return {
        data,
        isLoading,
        mutate,
    };
}

export default useCates