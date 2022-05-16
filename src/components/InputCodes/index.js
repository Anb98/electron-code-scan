import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Modal } from 'antd';
import styles from './InputCodes.module.css';

const { TextArea } = Input;

const InputCodes = ({onChangeCodes, batchCodes, onSave}) => {
    const [showModal, setShowModal] = useState(false);

    const handleModalOk = ()=>{
        onSave();
        setShowModal(false);
    }

    return (
        <>
            <Modal
                visible={showModal}
                onOk={handleModalOk}
                onCancel={()=>setShowModal(false)}
                okText="Save"
                cancelText="Cancel"
            >
                Are you sure to save these codes?
            </Modal>
            <div className={styles.content}>
                <TextArea onChange={onChangeCodes} rows={20} value={batchCodes} />
                <div className={styles.footer}>
                    <Button 
                        type='primary' 
                        onClick={()=>setShowModal(true)}
                        disabled={!batchCodes.length}
                    >Save</Button>
                </div>
            </div>
        </>
    );
};

InputCodes.defaultProps = {
    batchCodes: ''
};

InputCodes.propTypes = {
    onChangeCodes: PropTypes.func.isRequired,
    batchCodes: PropTypes.string,
};

export default InputCodes;