import React, { FunctionComponent, useRef, useState } from 'react';

interface ComponentProps {
    checked: boolean
    readOnly: boolean
    idProps: string
    defaultValue: string
    updateTodo: (event: React.ChangeEvent<HTMLInputElement>, id: string) => void
    doubleClick: (event: React.MouseEvent<HTMLLabelElement>, id: string) => void
    outsideClick: (id: string) => void
    deleteTodo: (event: React.MouseEvent<HTMLButtonElement> ,id: string) => void
    modifyTodo: (event: React.KeyboardEvent<HTMLInputElement>, id: string, content: string) => void
}

const ToDoItem : FunctionComponent<ComponentProps> = (props) => {

    const {checked, readOnly, idProps, defaultValue} = props;
    const {updateTodo, doubleClick, outsideClick, deleteTodo, modifyTodo} = props;
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="ToDo__item">
            <div className={`checkbox__container ${checked ? 'active' : ''}`}>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => updateTodo(e, idProps)}
                    id={`checkbox__${idProps}`}
                />
                <label htmlFor={`checkbox__${idProps}`} className="checkbox__active"><i className="fas fa-check"></i></label>
                <label htmlFor={`checkbox__${idProps}`} className="checkbox__inactive"></label>
            </div>

            <div className="input__todo__box">
                <label className={`${readOnly ? '' : 'hidden'} ${checked ? 'completed' : ''}`} onDoubleClick={(e) => doubleClick(e, idProps)}>{defaultValue}</label>
                <input type="text" className={!readOnly ? '' : 'hidden'}
                    id={idProps} autoComplete='off'
                    defaultValue={defaultValue}
                    onBlur={() => outsideClick(idProps)}
                    ref={inputRef}
                    onKeyDown={(e) => modifyTodo(e, idProps, inputRef.current?.value || '')}
                />
                <button
                className="Todo__delete"
                onClick={(e) => deleteTodo(e,idProps)}><i className="fas fa-times"></i></button>
            </div>      
        </div>
    );
}

export default ToDoItem;