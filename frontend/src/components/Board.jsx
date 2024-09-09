import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axios';
import { useDispatch, useSelector } from 'react-redux';
import { setTodos } from '../features/todo/todoSlice';
import TaskDetail from './TaskDetail';
import EditTodo from './EditTodo';

const Board = () => {
  const [taskAddView, setTaskAddView] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState('todo');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [showEditView, setShowEditView] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const { todo, inProgress, done } = useSelector((state) => state.todo);
  const dispatch = useDispatch();

  const handleTaskCreateView = async () => {
    setTaskAddView(!taskAddView);
  };

  const fetchTodos = async () => {
    try {
      const res = await axiosInstance.get('/todos/all');
      if (res.status === 200) {
        const todos = res.data;
        const todoList = [];
        const inProgressList = [];
        const doneList = [];

        todos.forEach((todoItem) => {
          if (todoItem.status === 'todo') {
            todoList.push(todoItem);
          } else if (todoItem.status === 'in_progress') {
            inProgressList.push(todoItem);
          } else if (todoItem.status === 'done') {
            doneList.push(todoItem);
          }
        });

        dispatch(setTodos({ type: 'todo', todos: todoList }));
        dispatch(setTodos({ type: 'inProgress', todos: inProgressList }));
        dispatch(setTodos({ type: 'done', todos: doneList }));
      }
    } catch (error) {
      console.error('Fetching todos failed', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post('/todos/create', {
        title,
        description,
        status: taskStatus,
        user: user.id,
      });
      console.log(res.status === 201, res.data);

      if (res.status === 201) {
        console.log(res.data);
        setTaskAddView(false);
        setTitle('');
        setDescription('');
        setTaskStatus('todo');

        if (res.data.status === 'todo') {
          dispatch(
            setTodos({
              type: 'todo',
              todos: [...todo, res.data],
            })
          );
        }
      }

      toast.success('Task created successfully', {
        autoClose: 2000,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTaskAddView(false);
    } catch (error) {
      console.error('Task creation failed', error);
      toast.error('Task creation failed: ' + error, {
        autoClose: 2000,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleTaskDelete = async (id) => {
    try {
      const res = await axiosInstance.delete(`/todos/delete/${id}`);
      if (res.status === 200) {
        toast.success('Task deleted successfully', {
          autoClose: 2000,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        fetchTodos();
      }
    } catch (error) {
      console.error('failed to delete task: ', error);
      toast.error('failed to delete task: ' + error, {
        autoClose: 2000,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleTaskEdit = (id) => {
    setShowEditView(true);
    setSelectedTask(id);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // If the task is dropped outside a column
    if (!destination) return;

    // If the task is dropped in the same column
    console.log(source, destination);
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    // Moving the task between columns
    const sourceColumn = [
      ...(source.droppableId === 'todo'
        ? todo
        : source.droppableId === 'inProgress'
        ? inProgress
        : done),
    ];
    const destinationColumn = [
      ...(destination.droppableId === 'todo'
        ? todo
        : destination.droppableId === 'inProgress'
        ? inProgress
        : done),
    ];
    const [removed] = sourceColumn.splice(source.index, 1);
    destinationColumn.splice(destination.index, 0, removed);

    dispatch(setTodos({ type: source.droppableId, todos: sourceColumn }));
    dispatch(
      setTodos({ type: destination.droppableId, todos: destinationColumn })
    );

    let newStatus = '';
    if (destination.droppableId === 'todo') {
      newStatus = 'todo';
    } else if (destination.droppableId === 'inProgress') {
      newStatus = 'in_progress';
    } else if (destination.droppableId === 'done') {
      newStatus = 'done';
    }

    axiosInstance
      .patch(`/todos/update/${removed._id}`, {
        status: newStatus,
      })
      .then((response) => {
        console.log('Task updated successfully', response.data);
        toast.success('Task updated successfully', {
          autoClose: 2000,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((error) => {
        console.error('Failed to update task', error);
        toast.error('Failed to update task: ' + error, {
          autoClose: 2000,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  return (
    <div className="pb-4 box-border">
      <button
        className="border border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500 hover:cursor-pointer w-24 h-10 mt-2 rounded flex justify-center items-center cursor-pointer"
        onClick={handleTaskCreateView}
      >
        <span className="relative -top-0.5 right-1">+</span>Add Task
      </button>
      {taskAddView && (
        <div className="absolute w-1/4 bg-white border border-blue-500 p-4 h-80 rounded top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 z-20 shadow-xl flex flex-col mt-10 items-center">
          <button
            className="absolute top-0 right-1 w-6 h-6 flex items-center justify-center border border-red-600 text-red-600 pb-1 mt-1 rounded-sm hover:text-white hover:bg-red-600 font-semibold"
            onClick={() => setTaskAddView(false)}
          >
            x
          </button>
          <div className="w-full overflow-auto">
            <h1 className="text-2xl text-blue-500 font-semibold mb-2 ml-4">
              Create Task
            </h1>
            <form onSubmit={handleSubmit} className="rounded-md p-4">
              <input
                placeholder="Title"
                className="mb-2 w-full pl-1 border border-gray-400 rounded h-8"
                id="taskName"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
              />
              <br />
              <textarea
                placeholder="Description"
                id="description"
                className="mb-2 w-full pl-1 border border-gray-400 rounded h-16 resize-y"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                type="text"
              />
              <br />
              <button
                type="submit"
                className="bg-blue-500 mx-auto w-full hover:bg-blue-700 block text-white font-bold py-2 px-4 rounded mt-2"
              >
                Add Task
              </button>
            </form>
          </div>
        </div>
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-3 mt-5">
          {/* TODO Column */}
          <Droppable droppableId="todo">
            {(provided) => (
              <div
                className="h-[calc(100vh-10rem)] p-2 overflow-y-auto rounded border border-gray-500 shadow-md"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <h1 className="text-md text-white bg-blue-500 rounded px-3 sticky top-0 z-20">
                  TODO
                </h1>
                {todo?.map((task, index) => (
                  <Draggable
                    key={task._id}
                    draggableId={task._id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        className="bg-white p-2 rounded mt-2 border shadow"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <h4 className="font-semibold text-lg">{task.title}</h4>

                        <p className="font-md mt-2">
                          Description: {task.description}
                        </p>

                        <div className="flex items-center mt-10 gap-11">
                          <p className="text-gray-500 text-sm font-light">
                            Created at:{' '}
                            {new Date(task.createdAt).toLocaleString('en-IN', {
                              timeZone: 'Asia/Kolkata',
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>

                          <div className="flex items-center gap-3">
                            <p
                              onClick={() => handleTaskEdit(task._id)}
                              className="text-gray-500 text-sm hover:cursor-pointer hover:text-gray-800 font-semibold"
                            >
                              edit
                            </p>
                            <p
                              onClick={() => handleTaskDelete(task._id)}
                              className="text-gray-500 text-sm hover:cursor-pointer hover:text-red-600 font-semibold"
                            >
                              delete
                            </p>
                            <p
                              className="text-gray-500 text-sm hover:cursor-pointer hover:text-blue-600 font-semibold"
                              onClick={() => {
                                setSelectedTask(task._id);
                                setShowTaskDetail(true);
                              }}
                            >
                              view details
                            </p>
                          </div>
                        </div>
                        {/* Todo Detail View */}
                        {selectedTask === task._id && showTaskDetail && (
                          <TaskDetail
                            title={task.title}
                            description={task.description}
                            createdAt={task.createdAt}
                            updatedAt={task.updatedAt}
                            setTaskDetailsView={() => {
                              setShowTaskDetail(false);
                              setSelectedTask(null);
                            }}
                          />
                        )}

                        {/* Todo Edit View */}
                        {selectedTask === task._id && showEditView && (
                          <EditTodo
                            title={task.title}
                            description={task.description}
                            setTitle={setTitle}
                            setDescription={setDescription}
                            setTaskEditView={() => {
                              setShowEditView(false);
                              setSelectedTask(null);
                            }}
                            taskId={task._id}
                          />
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* IN PROGRESS Column */}
          <Droppable droppableId="inProgress">
            {(provided) => (
              <div
                className="h-[calc(100vh-10rem)] p-2 overflow-y-auto rounded border border-gray-500 shadow-md"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <h1 className="text-md text-white bg-blue-500 rounded px-3 sticky top-0 z-20">
                  IN PROGRESS
                </h1>
                {inProgress.map((task, index) => (
                  <Draggable
                    key={task._id}
                    draggableId={task._id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        className="bg-white p-2 rounded mt-2 border shadow"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <h4 className="font-semibold text-lg">{task.title}</h4>

                        <p className="font-md mt-2">
                          Description: {task.description}
                        </p>

                        <div className="flex items-center mt-10 gap-11">
                          <p className="text-gray-500 text-sm font-light">
                            Created at:{' '}
                            {new Date(task.createdAt).toLocaleString('en-IN', {
                              timeZone: 'Asia/Kolkata',
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>

                          <div className="flex items-center gap-3">
                            <p
                              onClick={() => handleTaskEdit(task._id)}
                              className="text-gray-500 text-sm hover:cursor-pointer hover:text-gray-800 font-semibold"
                            >
                              edit
                            </p>
                            <p
                              onClick={() => handleTaskDelete(task._id)}
                              className="text-gray-500 text-sm hover:cursor-pointer hover:text-red-600 font-semibold"
                            >
                              delete
                            </p>
                            <p
                              className="text-gray-500 text-sm hover:cursor-pointer hover:text-blue-600 font-semibold"
                              onClick={() => {
                                setSelectedTask(task._id);
                                setShowTaskDetail(true);
                              }}
                            >
                              view details
                            </p>
                          </div>
                        </div>
                        {/* Task Detail View */}
                        {selectedTask === task._id && (
                          <TaskDetail
                            title={task.title}
                            description={task.description}
                            createdAt={task.createdAt}
                            updatedAt={task.updatedAt}
                            setTaskDetailsView={() => setSelectedTask(null)}
                          />
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* DONE Column */}
          <Droppable droppableId="done">
            {(provided) => (
              <div
                className="h-[calc(100vh-10rem)] p-2 overflow-y-auto rounded border border-gray-500 shadow-md"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <h1 className="text-md text-white bg-blue-500 rounded px-3 sticky top-0 z-20">
                  DONE
                </h1>
                {done.map((task, index) => (
                  <Draggable
                    key={task._id}
                    draggableId={task._id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        className="bg-white p-2 rounded mt-2 border shadow"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <h4 className="font-semibold text-lg">{task.title}</h4>

                        <p className="font-md mt-2">
                          Description: {task.description}
                        </p>

                        <div className="flex items-center mt-10 gap-11">
                          <p className="text-gray-500 text-sm font-light">
                            Created at:{' '}
                            {new Date(task.createdAt).toLocaleString('en-IN', {
                              timeZone: 'Asia/Kolkata',
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>

                          <div className="flex items-center gap-3">
                            <p
                              onClick={() => handleTaskEdit(task._id)}
                              className="text-gray-500 text-sm hover:cursor-pointer hover:text-gray-800 font-semibold"
                            >
                              edit
                            </p>
                            <p
                              onClick={() => handleTaskDelete(task._id)}
                              className="text-gray-500 text-sm hover:cursor-pointer hover:text-red-600 font-semibold"
                            >
                              delete
                            </p>
                            <p
                              className="text-gray-500 text-sm hover:cursor-pointer hover:text-blue-600 font-semibold"
                              onClick={() => setSelectedTask(task._id)}
                            >
                              view details
                            </p>
                          </div>
                        </div>
                        {/* Task Detail View */}
                        {selectedTask === task._id && (
                          <TaskDetail
                            title={task.title}
                            description={task.description}
                            createdAt={task.createdAt}
                            updatedAt={task.updatedAt}
                            setTaskDetailsView={() => setSelectedTask(null)}
                          />
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
};

export default Board;
