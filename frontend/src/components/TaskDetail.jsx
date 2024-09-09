/* eslint-disable react/prop-types */

import { useEffect, useRef } from 'react';

const TaskDetail = ({
  title,
  description,
  createdAt,
  updatedAt,
  setTaskDetailsView,
}) => {
  const taskDetailRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        taskDetailRef.current &&
        !taskDetailRef.current.contains(event.target)
      ) {
        setTaskDetailsView();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setTaskDetailsView]);

  return (
    <div
      ref={taskDetailRef}
      onClick={(event) => event.stopPropagation()}
      className="absolute w-1/4 bg-white tranform border border-blue-500 p-4 h-80 rounded top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 z-20 shadow-xl flex flex-col mt-10 items-center"
    >
      <button
        className="absolute top-0 right-1 w-6 h-6 flex items-center justify-center border border-red-600 text-red-600 pb-1 mt-1 rounded-sm hover:text-white hover:bg-red-600 font-semibold"
        onClick={() => setTaskDetailsView()}
      >
        x
      </button>
      <div className="w-full">
        <h1 className="text-2xl text-blue-500 font-semibold mb-2 ml-3">
          Task Details
        </h1>
        <div className="rounded-md p-4">
          <h4 className="mb-2 rounded text-lg font-semibold">
            <b>Title</b>: {title}
          </h4>
          <p className="pt-2">{description}</p>

          <p className="mb-2 text-sm fixed bottom-8 font-light">
            Created At:{' '}
            {new Date(createdAt).toLocaleDateString('en-IN', {
              timeZone: 'Asia/Kolkata',
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}{' '}
            {new Date(createdAt).toLocaleTimeString('en-IN', {
              timeZone: 'Asia/Kolkata',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <p className="mb-2 text-sm fixed bottom-2 font-light">
            Updated At:{' '}
            {new Date(updatedAt).toLocaleDateString('en-IN', {
              timeZone: 'Asia/Kolkata',
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}{' '}
            {new Date(updatedAt).toLocaleTimeString('en-IN', {
              timeZone: 'Asia/Kolkata',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
