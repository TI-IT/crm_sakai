import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ApplicationService } from '../../service/ApplicationService';
import getConfig from 'next/config';
import FormAddAllData from '../../forma/addAllData';
import { useRouter } from 'next/router';

const ClientsTable = ({ server_host }) => {
    const [applications1, setApplications1] = useState(null);
    const [applications2, setApplications2] = useState([]);
    const [applications3, setApplications3] = useState([]);
    const [filters1, setFilters1] = useState(null);
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [idFrozen, setIdFrozen] = useState(false);
    const [clients, setClients] = useState([]);
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
    const [expandedRows, setExpandedRows] = useState(null);
    const [allExpanded, setAllExpanded] = useState(false);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const [message, setMessage] = useState('');
    const router = useRouter();
    const [titles, setTitles] = React.useState({
        surname: 'Фамилия',
        name: 'Имя',
        patronymic: 'Отчество',
        phone: 'Телефон',
        email: 'Email',
        analiticAddress: 'Откуда о нас узнали?',
        organizations: 'Организация',
        city: 'Город',
        address: 'Адрес проживания',
        notes: 'Примечания'
    });

    const applicationService = new ApplicationService();

    async function getAllClientsData(text) {
        fetch(server_host + '/clients/getAll', {
            method: 'get',
            credentials: 'include'
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (data.ok) {
                    setClients(data.clients);
                    setMessage(text);
                }
            });
    }

    useEffect(() => {
        getAllClientsData();
        setLoading2(true);
        applicationService.getApplicationsLarge().then((data) => {
            setApplications1(getApplications(data));
            setLoading1(false);
        });
        applicationService.getApplicationsLarge().then((data) => {
            setApplications2(getApplications(data));
            setLoading2(false);
        });
        applicationService.getApplicationsMedium().then((data) => setApplications3(data));

        initFilters1();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const getApplications = (data) => {
        return [...(data || [])].map((d) => {
            d.date = new Date(d.date);
            return d;
        });
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const initFilters1 = () => {
        setFilters1({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            representative: { value: null, matchMode: FilterMatchMode.IN },
            date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
            verified: { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilterValue1('');
    };

    const toggleAll = () => {
        if (allExpanded) collapseAll();
        else expandAll();
    };

    const expandAll = () => {
        let _expandedRows = {};
        clients.forEach((p) => (_expandedRows[`${p._id}`] = true));

        setExpandedRows(_expandedRows);
        setAllExpanded(true);
    };

    const collapseAll = () => {
        setExpandedRows(null);
        setAllExpanded(false);
    };

    const amountBodyTemplate = (rowData) => {
        return formatCurrency(rowData.amount);
    };

    const statusOrderBodyTemplate = (rowData) => {
        return <span className={`order-badge order-${rowData.status.toLowerCase()}`}>{rowData.status}</span>;
    };

    const searchBodyTemplate = () => {
        return <Button icon="pi pi-search" />;
    };

    const imageBodyTemplate = (rowData) => {
        return <img src={`${contextPath}/demo/images/plient/${rowData.image}`} onError={(e) => (e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')} alt={rowData.image} className="shadow-2" width={100} />;
    };

    const rowExpansionTemplate = (data) => {
        return (
            <div className="orders-subtable">
                <h5>Orders for {data.name}</h5>
                <DataTable value={data.orders} responsiveLayout="scroll">
                    <Column field="_id" header="_Id" sortable></Column>
                    <Column header="Image" body={imageBodyTemplate} />
                    <Column field="application" header="Application" sortable></Column>
                    <Column field="date" header="Date" sortable></Column>
                    <Column field="amount" header="Amount" body={amountBodyTemplate} sortable></Column>
                    <Column field="status" header="Status" body={statusOrderBodyTemplate} sortable></Column>
                    <Column headerStyle={{ width: '4rem' }} body={searchBodyTemplate}></Column>
                </DataTable>
            </div>
        );
    };

    const header = (
        <div className="grid">
            <div className=" mr-3">
                <Button icon={allExpanded ? 'pi pi-minus' : 'pi pi-plus'} label={allExpanded ? 'Collapse All' : 'Expand All'} onClick={toggleAll} className="w-11rem" />
            </div>
            <Button label="Создать" className="bg-green-400 border-white-alpha-10" type="button" onClick={() => router.push('/crm/clients/addClients/')} />
        </div>
    );

    return (
        <div className="grid">
            <div className="col-12">
                {message}
                <DataTable value={clients} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} responsiveLayout="scroll" rowExpansionTemplate={rowExpansionTemplate} dataKey="_id" header={header}>
                    <Column expander style={{ width: '3em' }} />
                    <Column field="surname" header={titles.surname} sortable />
                    <Column field="name" header={titles.name} sortable />
                    <Column field="patronymic" header={titles.patronymic} sortable />
                    <Column field="phone" header={titles.phone} sortable />
                    <Column field="email" header={titles.email} sortable />
                    <Column field="analiticAddress" header={titles.analiticAddress} sortable />
                    <Column field="organizations" header={titles.organizations} sortable />
                    <Column field="city" header={titles.city} sortable />
                    <Column field="address" header={titles.address} sortable />
                    <Column field="notes" header={titles.notes} sortable />
                </DataTable>
            </div>
        </div>
    );
};

export default ClientsTable;