import React, {useMemo, useState, useEffect } from 'react';
import { Checkbox, Button, Modal } from 'antd';
import PropTypes from 'prop-types';
import styles from './RepeatedCodes.module.css';


const RepeatedCodes = ({batchCodes, onDelete, storedCodes}) => {
    const [showModal, setShowModal] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    
    const codes = useMemo(()=>batchCodes.split(/\n/).filter(Boolean), [batchCodes]);
    const repeatedCodes = useMemo(()=> codes
    .reduce(
        (acc, code, index) => {
            const alreadyExists = !!acc.find(({value})=> value===code);

            if(codes.filter((value, i)=> value===code && i !== index).length && !alreadyExists){
                return [...acc, {value: code, date: 'Today'}]
            }
            
            const result = storedCodes.find(storedCode => storedCode.value===code);
            if(result && !alreadyExists){
                return [...acc, result];
            }

            return acc;
    },[]), [storedCodes, codes]);
    
    const [selected, setSelected] = useState([]);

    useEffect(()=>{ setSelected(Array.from({length: repeatedCodes.length})) },[repeatedCodes]);
    

    const handleModalOk = ()=>{
        onDelete(repeatedCodes.map(({value}, i) =>({value, selected: selected[i]})), selectAll);
        setShowModal(false);
    }
    
    return (
        <>
        <Modal
            visible={showModal}
            onOk={handleModalOk}
            onCancel={()=>setShowModal(false)}
            okText="Delete"
            cancelText="Cancel"
        >
            Are you sure to delete these codes?
        </Modal>
        <div className={styles.content}>
            <div>
                <Checkbox 
                    className={styles.checkbox} 
                    onChange={({target})=>setSelectAll(target.checked)} 
                    disabled={!repeatedCodes.length}
                >
                    <h3>Select All</h3>
                </Checkbox>
            </div>
            <div >
                {repeatedCodes.map((code, i)=>(
                    <Checkbox 
                        className={styles.checkbox}
                        key={code.value} 
                        checked={selected[i] || selectAll}
                        onChange={({target})=>setSelected(prev=>prev.map((value,index)=> index===i? target.checked : value ))}
                    >
                    {code.value} - <strong>{code.date}</strong> {selected[i] }
                    </Checkbox>
                ))}
            </div>
            <div className={styles.footer}>
                <Button 
                    className={styles.checkbox} 
                    type='primary' 
                    danger
                    disabled={!selectAll && selected.filter(Boolean).length===0}
                    onClick={()=>setShowModal(true)} >Delete</Button>
            </div>
        </div>
        </>
    );
};

RepeatedCodes.defaultProps = {
    batchCodes: '',
};

RepeatedCodes.propTypes = {
    onDelete: PropTypes.func.isRequired,
    storedCodes: PropTypes.array.isRequired,
    batchCodes: PropTypes.string,
};

export default RepeatedCodes;