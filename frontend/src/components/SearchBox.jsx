import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setFilteredTodos } from '../features/todo/todoSlice';

const SearchBox = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    dispatch(setFilteredTodos(query));
  };

  return (
    <div className="w-full p-4 flex justify-center">
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search todos..."
        className="w-full p-2 border border-gray-600 rounded"
      />
    </div>
  );
};

export default SearchBox;
