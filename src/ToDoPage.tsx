import React, {useEffect, useReducer, useRef, useState} from 'react';
import {RouteComponentProps} from 'react-router-dom';

import reducer, {initialState} from './store/reducer';
import {
    setTodos,
    createTodo,
    deleteTodo,
    toggleAllTodos,
    deleteAllTodos,
    updateTodoStatus,
    modifyTodo
} from './store/actions';
import Service from './service';
import {TodoStatus} from './models/todo';
import {isTodoCompleted} from './utils';
import ToDoItem from './ToDoItem';
import {mockToken} from './service/api-frontend';
import './ToDoPage.css';

type EnhanceTodoStatus = TodoStatus | 'ALL';

const ToDoPage = ({history}: RouteComponentProps) => {

    const token =  localStorage.getItem('token') || '';
    if(token !== mockToken) history.push('/')
    else {}

    const [{todos}, dispatch] = useReducer(reducer, initialState);
    const [showing, setShowing] = useState<EnhanceTodoStatus>('ALL');
    const inputRef = useRef<HTMLInputElement>(null);
    const [todoFocused, setTodoFocused] = useState('');

    // useEffect(()=>{
    //     (async ()=>{
    //         const resp = await Service.getTodos();
    //         dispatch(setTodos(resp || []));
    //     })()
    // }, [])


    const onCreateTodo = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputRef.current) {
            try {
                const resp = await Service.createTodo(inputRef.current.value);
                dispatch(createTodo(resp));
                inputRef.current.value = '';
            } catch (e) {
                if (e.response.status === 401) {
                    history.push('/')
                }
            }
        }
    }

    const onUpdateTodoStatus = (e: React.ChangeEvent<HTMLInputElement>, todoId: string) => {
        dispatch(updateTodoStatus(todoId, e.target.checked))
    }

    const onToggleAllTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(toggleAllTodos(e.target.checked))
    }

    const onDeleteAllTodo = () => {
        dispatch(deleteAllTodos());
    }

    const showTodos = todos.filter((todo) => {
        switch (showing) {
            case TodoStatus.ACTIVE:
                return todo.status === TodoStatus.ACTIVE;
            case TodoStatus.COMPLETED:
                return todo.status === TodoStatus.COMPLETED;
            default:
                return true;
        }
    });

    const activeTodos = todos.reduce(function (accum, todo) {
        return isTodoCompleted(todo) ? accum : accum + 1;
    }, 0);

    const discardChange = (id: string) => {
        const content = todos.find((todo) => {
            return todo.id === id
        })?.content || '';

        document.getElementById(id)?.setAttribute("value", content);
        
        setTodoFocused('');
    }

    const onModifyTodo = async (e: React.KeyboardEvent<HTMLInputElement>, id: string, content: string) => {
        if (e.key === 'Enter' && content && id) {
            try {
                dispatch(modifyTodo(id, content));
                setTodoFocused('');
            } catch (e) {
                if (e.response.status === 401) {
                    history.push('/')
                }
            }
        }
    }

    const doubleClickInput = (id: string) => {
        setTodoFocused(id);
        document.getElementById(id)?.focus();
    }

    return (
        <div className="ToDo__container">
            <div className="Todo__Title"> 
                <h1>TODO APP</h1>
            </div>
            <div className="Todo__Controller"> 
                <div className="Todo__creation">
                    <input
                        ref={inputRef}
                        className="Todo__input"
                        placeholder="What need to be done?"
                        onKeyDown={onCreateTodo}
                    />
                </div>
                <div className="Todo__Content">
                    <div className="ToDo__list">
                        <div className="check__all">
                            {todos.length > 0 ?
                                <div className={`checkbox__container ${activeTodos === 0 ? 'active' : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={activeTodos === 0}
                                        onChange={onToggleAllTodo}
                                        id="check__all__button"
                                    />
                                    <label htmlFor="check__all__button" className="checkbox__active"><i className="fas fa-check"></i></label>
                                    <label htmlFor="check__all__button" className="checkbox__inactive"></label>                            
                                </div>
                                : <div/>
                            }
                            {todos.length > 0 ? <p>{activeTodos === 0 ? 'Uncheck All' : 'Check All'}</p> : ''}
                            
                        </div>
                        <div className="todo__item__list">
                            {
                                showTodos.map((todo, index) => {
                                    return (
                                        <ToDoItem
                                            key={index} checked={isTodoCompleted(todo)}
                                            readOnly={todoFocused === todo.id ? false : true}
                                            defaultValue={todo.content}
                                            idProps={todo.id}
                                            updateTodo={onUpdateTodoStatus}
                                            doubleClick={(e, id) => doubleClickInput(id)}
                                            outsideClick={(id) => discardChange(id)}
                                            deleteTodo={(e, id) => dispatch(deleteTodo(id))}
                                            modifyTodo={onModifyTodo}
                                        />
                                    );
                                })
                            }
                        </div>
                    </div>
                    <div className="Todo__toolbar">
                        
                        <div className="Todo__tabs">
                            <button onClick={()=>setShowing('ALL')} className={showing === 'ALL' ? 'active' : ''}>
                                All
                            </button>
                            <button onClick={()=>setShowing(TodoStatus.ACTIVE)} className={showing === TodoStatus.ACTIVE ? 'active' : ''}>
                                Active
                            </button>
                            <button onClick={()=>setShowing(TodoStatus.COMPLETED)} className={showing === TodoStatus.COMPLETED ? 'active' : ''}>
                                Completed
                            </button>
                        </div>
                        <button className="btn__clear" onClick={onDeleteAllTodo}>
                            Clear all todos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ToDoPage;