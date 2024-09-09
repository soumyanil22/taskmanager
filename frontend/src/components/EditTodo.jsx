/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import axiosInstance from '../api/axios';
import { updateTodo } from '../features/todo/todoSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const EditTodo = ({
  title: initialTitle,
  description: initialDescription,
  setTaskEditView,
  taskId,
}) => {
  const [localTitle, setLocalTitle] = useState(initialTitle);
  const [localDescription, setLocalDescription] = useState(initialDescription);
  const taskEditRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (taskEditRef.current && !taskEditRef.current.contains(event.target)) {
        setTaskEditView();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setTaskEditView]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.patch(`/todos/update/${taskId}`, {
        title: localTitle,
        description: localDescription,
      });
      if (res.status === 200) {
        toast.success('Todo updated successfully', {
          autoClose: 2000,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        dispatch(
          updateTodo({
            id: taskId,
            title: localTitle,
            description: localDescription,
          })
        );
        setTaskEditView();
      }
    } catch (error) {
      console.error('Editing todo failed', error);
      toast.error('Editing todo failed: ' + error, {
        autoClose: 2000,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div
      ref={taskEditRef}
      onClick={(event) => event.stopPropagation()}
      className="absolute w-1/4 bg-white border border-blue-500 p-4 h-80 rounded top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 z-20 shadow-xl flex flex-col mt-10 items-center"
    >
      <form onSubmit={handleSubmit} className="rounded-md p-4">
        <button
          type="button"
          className="absolute top-0 right-1 w-6 h-6 flex items-center justify-center border border-red-600 text-red-600 pb-1 mt-1 rounded-sm hover:text-white hover:bg-red-600 font-semibold"
          onClick={() => setTaskEditView()}
        >
          x
        </button>
        <div className="w-full pb-2">
          <h1 className="text-2xl text-blue-500 font-semibold mb-2">
            Task Details
          </h1>
          <div className="rounded-md box-border">
            <input
              type="text"
              value={localTitle}
              className="w-full p-1 border border-gray-600 rounded"
              onChange={(e) => setLocalTitle(e.target.value)}
            />
            <textarea
              className="mt-2 h-32 p-1 border border-gray-600 resize-y w-full rounded"
              value={localDescription}
              onChange={(e) => setLocalDescription(e.target.value)}
            />
          </div>
          <button
            className="bg-blue-500 mt-3 hover:bg-blue-700 w-24 text-white font-bold py-2 px-4 rounded block mx-auto"
            type="submit"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTodo;
