import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

function FormAddOneData({ server_host, addData, rerender }) {
    console.log(addData);
    const [newAddData, setNewAddData] = useState({});
    const [message, setMessage] = useState('');
    const [displayBasic, setDisplayBasic] = useState(false);

    const basicDialogFooter = (
        <Button
            type="button"
            label="OK"
            onClick={() => {
                setDisplayBasic(false);
                fetchAddNewData();
            }}
            icon="pi pi-check"
            className="p-button-secondary"
        />
    );

    async function fetchAddNewData() {
        const fethUrl = server_host + '/' + addData + '/addOneData';
        const newAddDataObject = {};
        newAddDataObject.name = newAddData;
        try {
            const res = await fetch(fethUrl, {
                method: 'post',
                credentials: 'include',
                body: JSON.stringify(newAddDataObject),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            if (data.ok) {
                setMessage('Город добавлен');
                rerender();
            } else {
                setMessage('Ошибка попробуйте другие данные');
            }
        } catch (error) {
            alert('Сервер не отвечает');
        }
    }

    return (
        <>
            <Dialog header={'Введите новую ' + addData} visible={displayBasic} style={{ width: '50vw' }} modal footer={basicDialogFooter} onHide={() => setDisplayBasic(false)}>
                <div className="field">
                    <InputText id={addData} type="text" name={'name'} onChange={(e) => setNewAddData(e.target.value)} value={newAddData.name} className="p-invalid" />
                </div>
            </Dialog>
            <div className="grid">
                <div className="col-12">
                    <Button type="button" icon="pi pi-plus" onClick={() => setDisplayBasic(true)} />
                </div>
            </div>
        </>
    );
}

export default FormAddOneData;
