import useSWR from 'swr';
import fetcher from '../utils/fetcher';

const useFoods = () => {
    const { data, isLoading, mutate, error } = useSWR('hotfoods', fetcher);
    
    // 在这里检查错误并输出详细信息
    if (error) {
        console.log('Error:', error); // 输出错误对象本身
        console.log('Error message:', error.message); // 输出错误消息
        console.log('Error response:', error.response); // 输出响应对象（如果有）
    }

    console.log('Data:', data); // 输出数据

    return {
        data,
        isLoading,
        mutate,
    };
}

export default useFoods;
